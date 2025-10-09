// Centralise the models used in the app (add/remove here).
export const MODELS = [
  {
    id: "claude-3-5-sonnet",
    label: "Claude 3.5 Sonnet",
    provider: "claude",
    icon: "/assets/icons/claude.svg", // optional; add file if you have it
  },
  {
    id: "mistral-large-latest",
    label: "Mistral Large",
    provider: "mistral",
    icon: "/assets/icons/mistral.svg", // optional; add file if you have it
  },
];

// A simple helper to find a model by id
export const getModelById = (id) => MODELS.find((m) => m.id === id);


//
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MODELS, getModelById } from "../constants/models";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "model.selected";

const ModelContext = createContext({
  selectedModelId: null,
  setSelectedModelId: () => {},
  allowedModels: [],
  locked: false,
});

export const ModelProvider = ({ children }) => {
  const { roles = [] } = useAuth();

  // Business rules:
  // - If in MISTRAL_AD => locked to Mistral and dropdown disabled.
  // - Example role handling (adapt as needed):
  //   * "CLAUDE_ONLY" => Claude only
  //   * "ALL_MODELS" or anything else => both available
  const isMistralAD = roles.includes("MISTRAL_AD");

  const allowedModels = useMemo(() => {
    if (isMistralAD) {
      return MODELS.filter((m) => m.provider === "mistral");
    }
    if (roles.includes("CLAUDE_ONLY")) {
      return MODELS.filter((m) => m.provider === "claude");
    }
    // default: all
    return MODELS;
  }, [roles, isMistralAD]);

  // Initial selection from storage or default to first allowed
  const initial = (() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage && getModelById(fromStorage)) return fromStorage;
    return allowedModels[0]?.id || null;
  })();

  const [selectedModelId, setSelectedModelIdState] = useState(initial);

  const setSelectedModelId = (id) => {
    setSelectedModelIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (_) {}
  };

  // Enforce lock & allowed set changes
  useEffect(() => {
    if (allowedModels.length === 0) {
      setSelectedModelIdState(null);
      return;
    }
    const currentAllowed = allowedModels.some((m) => m.id === selectedModelId);
    const forcedId = isMistralAD
      ? allowedModels[0].id // locked to the only allowed
      : currentAllowed
      ? selectedModelId
      : allowedModels[0].id;

    if (forcedId !== selectedModelId) {
      setSelectedModelId(forcedId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(allowedModels), isMistralAD]);

  const value = useMemo(
    () => ({
      selectedModelId,
      setSelectedModelId,
      allowedModels,
      locked: isMistralAD,
    }),
    [selectedModelId, allowedModels, isMistralAD]
  );

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModel = () => useContext(ModelContext);


//

import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology"; // brain icon

import { useModel } from "../contexts/ModelContext";

const ProviderIcon = ({ icon, provider }) => {
  // prefer custom SVG/PNG if you have it; otherwise fall back to initials
  if (icon) {
    return <Avatar src={icon} alt={provider} sx={{ width: 18, height: 18 }} />;
  }
  const letter = provider?.[0]?.toUpperCase() || "?";
  return (
    <Avatar sx={{ width: 18, height: 18, fontSize: 12 }}>
      {letter}
    </Avatar>
  );
};

const ModelSelector = () => {
  const { selectedModelId, setSelectedModelId, allowedModels, locked } = useModel();

  // Hide entirely if nothing allowed (defensive)
  if (!allowedModels || allowedModels.length === 0) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <PsychologyIcon fontSize="small" />
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          label="Model"
          value={selectedModelId || ""}
          onChange={(e) => setSelectedModelId(e.target.value)}
          disabled={locked}
          sx={{
            bgcolor: "background.paper",
          }}
        >
          {allowedModels.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              <ListItemIcon>
                <ProviderIcon icon={m.icon} provider={m.provider} />
              </ListItemIcon>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{m.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ({m.provider})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {locked && (
        <Tooltip title="Your organisation restricts model changes (MISTRAL AD).">
          <Typography variant="caption" color="text.secondary">
            Locked
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default ModelSelector;


////

import React from "react";
import { Toolbar, Typography, Box } from "@mui/material";
import ModelSelector from "./ModelSelector";

const ModuleSubheader = ({ title, actions }) => {
  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
      disableGutters
    >
      <Typography component="h2" variant="h5">
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ModelSelector />
        {actions}
      </Box>
    </Toolbar>
  );
};

export default ModuleSubheader;
