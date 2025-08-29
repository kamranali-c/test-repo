// components/FormFieldWithEval.js
import { Grid } from "@mui/material";
import TextArea from "./TextArea";
import InputText from "./InputText";
import Dropdown from "./Dropdown";
import EvalMessage from "./EvalMessage";

export default function FormFieldWithEval({
  type = "input", // "input" | "textarea" | "dropdown"
  name,
  label,
  values,
  touched,
  errors,
  evalLatest,
  onChange,
  onBlur,
  onRetry,
  ...rest // extra props (e.g. options, minRows, multiple, etc.)
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
    <Grid size={12}>
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
/>

<FormFieldWithEval
  type="dropdown"
  name="status"
  label={FIELD_LABELS.status}
  values={values}
  touched={touched}
  errors={errors}
  evalLatest={evalLatest}
  onChange={(v) => setFieldValue("status", v || "")}
  onBlur={handleBlur}
  onRetry={onHandleRetry}
  options={statusOptions}
/>

<FormFieldWithEval
  type="textarea"
  name="whatDoesThisMean"
  label={FIELD_LABELS.whatDoesThisMean}
  values={values}
  touched={touched}
  errors={errors}
  evalLatest={evalLatest}
  onChange={handleChange}
  onBlur={handleBlur}
  onRetry={onHandleRetry}
/>

<FormFieldWithEval
  type="textarea"
  name="latestUpdate"
  label={FIELD_LABELS.latestUpdate}
  values={values}
  touched={touched}
  errors={errors}
  evalLatest={evalLatest}
  onChange={handleChange}
  onBlur={handleBlur}
  onRetry={onHandleRetry}
/>

<FormFieldWithEval
  type="textarea"
  name="knownRootCause"
  label={FIELD_LABELS.knownRootCause}
  values={values}
  touched={touched}
  errors={errors}
  evalLatest={evalLatest}
  onChange={handleChange}
  onBlur={handleBlur}
  onRetry={onHandleRetry}
/>

<FormFieldWithEval
  type="textarea"
  name="summary"
  label={FIELD_LABELS.summary}
  values={values}
  touched={touched}
  errors={errors}
  evalLatest={evalLatest}
  onChange={handleChange}
  onBlur={handleBlur}
  onRetry={onHandleRetry}
/>





    <Grid rowSpacing={2} size={12}>
  <Paper variant="outlined" sx={{ p: 3, boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
    <Grid mb={4}>
      <FormFieldWithEval
        type="dropdown"
        name="countriesImpacted"
        label={FIELD_LABELS.countriesImpacted}
        values={values}
        touched={touched}
        errors={errors}
        evalLatest={evalLatest}
        onChange={(v) => setFieldValue("countriesImpacted", v)}
        onBlur={handleBlur}
        onRetry={onHandleRetry}
        options={countriesOptions}
        multiple
      />
    </Grid>

    <Grid>
      <FormFieldWithEval
        type="textarea"
        name="whatDoesThisMean"
        label={FIELD_LABELS.whatDoesThisMean}
        values={values}
        touched={touched}
        errors={errors}
        evalLatest={evalLatest}
        onChange={handleChange}
        onBlur={handleBlur}
        onRetry={onHandleRetry}
        minRows={3}
      />
    </Grid>
  </Paper>
</Grid>
