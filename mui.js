// src/components/molecules/Dropdown.js
import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function Dropdown({
  options = [],
  value,
  multiple = false,
  onChange,
  label = "",
  error,
  helperText,
  sx,
  onBlur,
  readOnly = false,
  ...rest
}) {
  const opts = useMemo(
    () =>
      options.map((o) =>
        typeof o === "object" && o != null ? o : { label: String(o), value: o }
      ),
    [options]
  );

  // Read-only rendering: show labels in a disabled TextField
  if (readOnly) {
    const toLabel = (v) => {
      if (v == null) return "";
      if (typeof v === "object") return v.label ?? v.value ?? String(v);
      const match = opts.find((o) => o.value === v || o.label === v);
      return match?.label ?? String(v);
    };
    const display = multiple
      ? (Array.isArray(value) ? value : []).map(toLabel).filter(Boolean).join(", ")
      : toLabel(value);

    return (
      <TextField
        fullWidth
        label={label}
        value={display}
        error={Boolean(error)}
        helperText={helperText}
        InputProps={{ readOnly: true }}
        disabled
        sx={{ width: "100%", ...sx }}
        {...rest}
      />
    );
  }

  // Editable rendering: map incoming values to option objects
  const internalValue = useMemo(() => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      const keyOf = (v) => (typeof v === "object" ? v.value ?? v.label : v);
      const set = new Set(arr.map(keyOf));
      return opts.filter((o) => set.has(o.value) || set.has(o.label));
    }
    const norm = typeof value === "object" ? value?.value ?? value?.label : value;
    return opts.find((o) => o.value === norm || o.label === norm) || null;
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
        multiple
          ? onChange((v || []).map((o) => o.value))
          : onChange(v ? v.value : "")
      }
      getOptionLabel={(o) => o?.label ?? ""}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          error={Boolean(error)}
          helperText={helperText}
          size="small"
          required={rest.required}
          onBlur={onBlur}
        />
      )}
      sx={{ width: "100%", ...sx }}
      {...rest}
    />
  );
}
