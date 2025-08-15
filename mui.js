// src/components/molecules/Dropdown.jsx
import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

/**
 * Clean Autocomplete
 * - options: string[] | { label: string, value: any }[]
 * - value: string | string[] (raw values)
 * - multiple?: boolean
 * - onChange: (value) => void
 * - label?: string        // visible floating label
 * - ariaLabel?: string    // accessible name when label=""
 */
export default function Dropdown({
  options = [],
  value,
  multiple = false,
  onChange,
  label = "",
  ariaLabel,
  error,
  helperText,
  sx,
  ...rest
}) {
  const opts = useMemo(
    () =>
      options.map((o) =>
        typeof o === "object" && o !== null ? o : { label: String(o), value: o }
      ),
    [options]
  );

  const internalValue = useMemo(() => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      return opts.filter((o) => arr.includes(o.value));
    }
    return opts.find((o) => o.value === value) || null;
  }, [value, multiple, opts]);

  return (
    <Autocomplete
      fullWidth
      multiple={multiple}
      disableCloseOnSelect={multiple}
      filterSelectedOptions={multiple}
      options={opts}
      value={internalValue}
      onChange={(_, v) =>
        multiple ? onChange((v || []).map((o) => o.value)) : onChange(v ? v.value : "")
      }
      getOptionLabel={(o) => o?.label ?? ""}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          inputProps={{ ...params.inputProps, "aria-label": ariaLabel || label }}
          error={Boolean(error)}
          helperText={helperText}
        />
      )}
      sx={{ width: "100%", ...sx }}
      {...rest}
    />
  );
}
