// src/pages/IM001Form.js
import React from "react";
import { Box, Grid, Paper, Stack } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Dropdown from "../components/molecules/Dropdown";
import FormButton from "../components/molecules/FormButton";
import TextArea from "../components/molecules/TextArea";
import InputText from "../components/molecules/InputText";
import EvalMessage from "../components/molecules/EvalMessage";
import { submitIncidentReview } from "../services/api";

// --- helpers (prepare state only; no refresh functions) ---
const RESP_MAP = {
  title: { r: "titleResult", c: "titleComment", s: "titleSuggestion" },
  summary: { r: "summaryResult", c: "summaryComment", s: "summarySuggestion" },
  latestUpdate: { r: "latestUpdateResult", c: "latestUpdateComment", s: "latestUpdateSuggestion" },
  knownRootCause: { r: "knownRootCauseResult", c: "knownRootCauseComment", s: "knownRootCauseSuggestion" },
  whatDoesThisMean: { r: "whatDoesThisMeanResult", c: "whatDoesThisMeanComment", s: "whatDoesThisMeanSuggestion" },
};
const toEntry = (api, key) => ({
  result: api?.[RESP_MAP[key].r] ?? null,
  comment: api?.[RESP_MAP[key].c] ?? "",
  suggestion: api?.[RESP_MAP[key].s] ?? "",
  timestamp: api?.timestamp ?? null,
});
const buildPayload = (v) => ({
  incidentNumber: v.incidentNumber?.trim(),
  title: v.title?.trim(),
  summary: v.summary?.trim(),
  whatDoesThisMean: v.impactDescription?.trim(),
  knownRootCause: v.knownRootCause?.trim(),
  latestUpdate: v.latestUpdate?.trim(),
  status: v.status,
  knownCountries: (v.countriesImpacted || []).join(", "),
});

// --- form scaffolding ---
const initialValues = {
  incidentNumber: "",
  title: "",
  status: "",
  countriesImpacted: [],
  impactDescription: "",
  latestUpdate: "",
  knownRootCause: "",
  summary: "",
};

const validationSchema = Yup.object({
  incidentNumber: Yup.string().trim().min(10, "Incident number must be between 10 and 20 characters").max(20, "Incident number must be between 10 and 20 characters").required("Incident number is required"),
  title: Yup.string().trim().max(500, "Title must be less than 500 characters").required("Title is required"),
  status: Yup.string().trim().required("Status is required"),
  countriesImpacted: Yup.array().ensure().of(Yup.string().trim()).test("max-total-length", "Combined selections must be less than 1000 characters", (arr) => (arr || []).join(",").length <= 1000),
  impactDescription: Yup.string().trim().max(20000, "Impact description must be less than 20000 characters").required("Describe the customer/colleague impact"),
  latestUpdate: Yup.string().trim().max(1000, "Latest update must be less than 1000 characters").required("Latest update is required"),
  knownRootCause: Yup.string().trim().max(5000, "Root cause must be less than 5000 characters").required("Root cause is required"),
  summary: Yup.string().trim().max(2000, "Summary must be less than 2000 characters").required("Summary is required"),
});

// --- evaluation state (latest only; prepared for future refresh/history) ---
const emptyEval = { result: null, comment: "", suggestion: "", timestamp: null };

export default function IM001Form({ statusOptions, countriesOptions }) {
  const [evalLatest, setEvalLatest] = React.useState({
    title: emptyEval,
    summary: emptyEval,
    latestUpdate: emptyEval,
    knownRootCause: emptyEval,
    whatDoesThisMean: emptyEval,
  });

  return (
    <Box mt={4} mb={4}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const api = await submitIncidentReview(buildPayload(values));
            setEvalLatest({
              title: toEntry(api, "title"),
              summary: toEntry(api, "summary"),
              latestUpdate: toEntry(api, "latestUpdate"),
              knownRootCause: toEntry(api, "knownRootCause"),
              whatDoesThisMean: toEntry(api, "whatDoesThisMean"),
            });
          } catch (err) {
            console.error("Submit failed:", err);
            setEvalLatest({
              title: emptyEval,
              summary: emptyEval,
              latestUpdate: emptyEval,
              knownRootCause: emptyEval,
              whatDoesThisMean: emptyEval,
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          setFieldValue,
          resetForm,
          isSubmitting,
        }) => (
          <Form noValidate>
            {/* Row 1: Incident Number and Title */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <InputText
                  required
                  size="small"
                  fullWidth
                  label="Incident Number"
                  name="incidentNumber"
                  value={values.incidentNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.incidentNumber && errors.incidentNumber)}
                  helperText={touched.incidentNumber && errors.incidentNumber}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <InputText
                  required
                  size="small"
                  fullWidth
                  label="Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                <EvalMessage latest={evalLatest.title} />
              </Grid>
            </Grid>

            {/* Row 2: Status */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Dropdown
                required
                label="Status"
                options={statusOptions}
                value={values.status}
                onChange={(v) => setFieldValue("status", v || "")}
                error={touched.status && errors.status}
                helperText={touched.status && errors.status}
                onBlur={handleBlur}
              />
            </Grid>

            {/* Row 3: Countries and Impact Desc */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Paper variant="outlined" sx={{ p: 3, boxShadow: "0 rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                <Grid mb={4}>
                  <Dropdown
                    label="Known countries/entities impacted"
                    multiple
                    options={countriesOptions}
                    value={values.countriesImpacted}
                    onChange={(v) => setFieldValue("countriesImpacted", v)}
                  />
                </Grid>

                <Grid>
                  <TextArea
                    required
                    name="impactDescription"
                    minRows={3}
                    value={values.impactDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.impactDescription && errors.impactDescription)}
                    helperText={touched.impactDescription && errors.impactDescription}
                    label="What does this mean for our customers and colleagues?"
                  />
                  <EvalMessage latest={evalLatest.whatDoesThisMean} />
                </Grid>
              </Paper>
            </Grid>

            {/* Row 4: Latest update */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <InputText
                required
                size="small"
                fullWidth
                label="What's the latest update?"
                name="latestUpdate"
                value={values.latestUpdate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.latestUpdate && errors.latestUpdate)}
                helperText={touched.latestUpdate && errors.latestUpdate}
              />
              <EvalMessage latest={evalLatest.latestUpdate} />
            </Grid>

            {/* Row 5: Known root cause */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TextArea
                required
                label="Known root cause"
                name="knownRootCause"
                minRows={3}
                value={values.knownRootCause}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.knownRootCause && errors.knownRootCause)}
                helperText={touched.knownRootCause && errors.knownRootCause}
              />
              <EvalMessage latest={evalLatest.knownRootCause} />
            </Grid>

            {/* Row 6: Summary */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TextArea
                required
                label="Summary"
                name="summary"
                minRows={3}
                value={values.summary}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.summary && errors.summary)}
                helperText={touched.summary && errors.summary}
              />
              <EvalMessage latest={evalLatest.summary} />
            </Grid>

            {/* Row 7: Actions */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <FormButton
                    type="button"
                    label="Clear All"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      resetForm({ values: initialValues });
                      setEvalLatest({
                        title: emptyEval,
                        summary: emptyEval,
                        latestUpdate: emptyEval,
                        knownRootCause: emptyEval,
                        whatDoesThisMean: emptyEval,
                      });
                    }}
                  />
                  <FormButton
                    type="submit"
                    label="Submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  />
                </Stack>
              </Box>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
