// src/components/RegenerateMINDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import SharedButton from "./molecules/SharedButton";
import TextArea from "./molecules/TextArea";

export default function RegenerateMINDialog({
  open,
  onClose,
  fieldName,          // may be undefined the first time
  onSubmit,
  loading = false,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const displayName = fieldName || "this field";

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setValue("");
      setError(false);
      setHelperText("");
    }
  }, [open]);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    const isEmpty = v.trim() === "";
    setError(isEmpty);
    setHelperText(isEmpty ? "This field is required." : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) {
      setError(true);
      setHelperText("This field is required.");
      return;
    }
    onSubmit?.(v);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Regenerate answer</DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            You’ve chosen to regenerate the answer to{" "}
            <strong>{displayName}</strong>. Please share any new details or
            changes you’d like included.
          </Typography>

          <Box>
            <TextArea
              ariaLabel="Regeneration notes"
              placeholder="Enter your text here..."
              name="reason"
              minRows={5}
              value={value}
              onChange={handleChange}
              error={error}
              helperText={helperText}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <SharedButton onClick={onClose} disabled={loading}>
            Cancel
          </SharedButton>
          <SharedButton type="submit" variant="contained" disabled={loading}>
            Confirm
          </SharedButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}



{isOpenRegenerateMin && (
  <RegenerateMINDialog
    open={isOpenRegenerateMin}
    fieldName={fieldData.label || fieldData.name}
    loading={isRegenerating}
    onClose={() => setOpenRegenerateMin(false)}            // ← correct setter
    onSubmit={(reason) => onHandleRegenerateResponse(reason)}
  />
)}


// keep these together
const [isOpenRegenerateMin, setOpenRegenerateMin] = React.useState(false);

// when opening
const onHandleRetry = (key, value, label) => {
  setFieldData({ name: key, value, label });   // label can be empty initially
  setOpenRegenerateMin(true);
};
