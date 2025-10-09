import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useAuth } from "../hooks/useAuth"; // adjust path if needed

const OPTIONS = [
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "claude" },
  { id: "mistral-large-latest", label: "Mistral Large",   provider: "mistral" },
];

// If perms don’t grant anything, we still show this one
const FALLBACK_MODEL_ID = "mistral-large-latest";

export default function ModelSelector({ onChange, size = "small" }) {
  const { userInfo, hasPermission } = useAuth();
  const roles = userInfo?.roles || [];
  const isMistralAD = roles.includes("MISTRAL_AD");

  const allowedOptions = useMemo(() => {
    // Hard lock for MISTRAL_AD
    if (isMistralAD) return OPTIONS.filter((o) => o.provider === "mistral");

    const allowedIds = [];
    if (hasPermission?.("model:claude"))  allowedIds.push("claude-3-5-sonnet");
    if (hasPermission?.("model:mistral")) allowedIds.push("mistral-large-latest");

    const ids = allowedIds.length ? allowedIds : [FALLBACK_MODEL_ID];
    return OPTIONS.filter((o) => ids.includes(o.id));
  }, [isMistralAD, hasPermission, roles.join("|")]);

  // local controlled value that always remains valid
  const [value, setValue] = useState(allowedOptions[0].id);
  useEffect(() => {
    if (!allowedOptions.find((o) => o.id === value)) {
      setValue(allowedOptions[0].id);
    }
  }, [allowedOptions, value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onChange?.(v);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <PsychologyIcon fontSize="small" />
      <FormControl
        size={size}
        sx={{
          minWidth: 200,
          mr: 2, // 16px
          "& .MuiInputLabel-root": { color: "white" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "& .MuiSelect-select": { color: "white", backgroundColor: "transparent" },
          "& .MuiSvgIcon-root": { color: "white" },
        }}
      >
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          label="Model"
          value={value}
          onChange={handleChange}
          disabled={isMistralAD}
        >
          {allowedOptions.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isMistralAD && (
        <Tooltip title="Your organisation restricts model changes (MISTRAL AD).">
          <Typography variant="caption" color="white">Locked</Typography>
        </Tooltip>
      )}
    </Box>
  );
}
