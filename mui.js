import React, { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const OPTIONS = [
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "mistral-large-latest", label: "Mistral Large" },
];

export default function ModelSelector({ onChange, size = "small" }) {
  const [value, setValue] = useState(OPTIONS[0].id);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onChange?.(v); // optional callback for parent if needed later
  };

  return (
    <Box>
      <FormControl size={size} sx={{ minWidth: 200 }}>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          label="Model"
          value={value}
          onChange={handleChange}
        >
          {OPTIONS.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
