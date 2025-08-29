// components/FormFieldWithEval.js
import { Grid } from "@mui/material";
import TextArea from "./TextArea";
import InputText from "./InputText";
import Dropdown from "./Dropdown";
import EvalMessage from "./EvalMessage";

export default function FormFieldWithEval({
  type = "input",
  name,
  label,
  gridSize = { xs: 12 },   // 👈 default full width, can override
  values,
  touched,
  errors,
  evalLatest,
  onChange,
  onBlur,
  onRetry,
  ...rest
}) {
  const error = Boolean(touched[name] && errors[name]);
  const helperText = touched[name] && errors[name];

  let FieldComponent;
  switch (type) {
    case "textarea":
      FieldComponent = (
        <TextArea
          required
          fullWidth
          minRows={3}
          label={label}
          name={name}
          value={values[name]}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          helperText={helperText}
          {...rest}
        />
      );
      break;
    case "dropdown":
      FieldComponent = (
        <Dropdown
          required
          label={label}
          name={name}
          value={values[name]}
          onChange={onChange}
          error={error}
          helperText={helperText}
          {...rest}
        />
      );
      break;
    default:
      FieldComponent = (
        <InputText
          required
          fullWidth
          label={label}
          name={name}
          value={values[name]}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          helperText={helperText}
          {...rest}
        />
      );
  }

  return (
    <Grid size={gridSize}>
      {FieldComponent}
      {evalLatest && (
        <EvalMessage
          latest={evalLatest?.[name]}
          onRetry={() =>
            onRetry(name, evalLatest?.[name]?.suggestion?.[0] ?? "")
          }
        />
      )}
    </Grid>
  );
}






<Grid container spacing={4}>
  <FormFieldWithEval
    type="input"
    name="incidentNumber"
    label={FIELD_LABELS.incidentNumber}
    values={values}
    touched={touched}
    errors={errors}
    evalLatest={evalLatest}
    onChange={handleChange}
    onBlur={handleBlur}
    onRetry={onHandleRetry}
    gridSize={{ xs: 12, md: 4 }}   // 👈 keep 4/12 split
    autoFocus
    disabled={isDisabledIncidentNumber}
  />

  <FormFieldWithEval
    type="input"
    name="title"
    label={FIELD_LABELS.title}
    values={values}
    touched={touched}
    errors={errors}
    evalLatest={evalLatest}
    onChange={handleChange}
    onBlur={handleBlur}
    onRetry={onHandleRetry}
    gridSize={{ xs: 12, md: 8 }}   // 👈 keep 8/12 split
  />
</Grid>
