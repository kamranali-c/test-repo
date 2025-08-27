import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import Carousel from "./Carousel";

export default function EvalMessage({ latest, onRetry }) {
  if (!latest || Object.keys(latest).length === 0) return null;

  const pass = String(latest.result).toLowerCase() === "pass";
  const items = Array.isArray(latest.suggestion) ? latest.suggestion : [];

  return (
    <Box mt={1.25}>
      <Box display="flex" alignItems="center">
        {pass ? (
          <CheckCircle sx={{ color: "green", fontSize: 20, mr: 1 }} />
        ) : (
          <Cancel sx={{ color: "red", fontSize: 20, mr: 1 }} />
        )}
        <Typography
          variant="body2"
          sx={{ color: pass ? "green" : "red", fontWeight: 400, marginTop: "2px" }}
        >
          {latest?.comment}
        </Typography>
      </Box>

      {items.length === 1 ? (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 0.75, color: "text.secondary" }}
        >
          <strong>GenAI Output:</strong> {items[0]}
        </Typography>
      ) : (
        items.length > 1 && <Carousel list={items} onRetry={onRetry} />
      )}
    </Box>
  );
}
