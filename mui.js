// src/pages/FormComponent.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Dropdown from "../components/molecules/Dropdown";
import FormButton from "../components/molecules/FormButton";
import TextArea from "../components/molecules/TextArea";
import { CheckCircle, Cancel } from "@mui/icons-material";

// ---- Yup schema (basic validation only) ----
const validationSchema = Yup.object({
  incidentNumber: Yup.string()
    .trim()
    .min(10, "Incident number must be between 10 and 20 characters")
    .max(20, "Incident number must be between 10 and 20 characters")
    .required("Incident number is required"),

  title: Yup.string()
    .trim()
    .max(500, "Title must be ≤ 500 characters")
    .required("Title is required"),

  status: Yup.string().trim().required("Status is required"),

  countriesImpacted: Yup.array()
    .ensure()
    .of(Yup.string().trim())
    .test(
      "max-total-length",
      "Combined selections must be ≤ 1000 characters",
      (arr) => (arr || []).join(",").length <= 1000
    ),

  impactDescription: Yup.string()
    .trim()
    .max(20000, "Impact description must be ≤ 20000 characters")
    .required("Describe the customer/colleague impact"),

  latestUpdate: Yup.string()
    .trim()
    .max(1000, "Latest update must be ≤ 1000 characters")
    .required("Latest update is required"),

  knownRootCause: Yup.string()
    .trim()
    .max(5000, "Root cause must be ≤ 5000 characters")
    .required("Root cause is required"),

  summary: Yup.string()
    .trim()
    .max(2000, "Summary must be ≤ 2000 characters")
    .required("Summary is required"),
});

// ---- Status options ----
const STATUS_OPTIONS = [
  "New",
  "Recovered Under Investigation",
  "Re-assessed as non major",
  "New Resolved Under Investigation",
  "New Resolved",
  "New Resolved Monitoring",
  "Downgraded",
  "Upgraded",
  "Reopened",
  "Resolved",
  "Resolved Under Monitoring",
  ...Array.from({ length: 20 }, (_, i) => `Update ${i + 1}`),
];

// ---- Countries/entities ----
const COUNTRIES_IMPACTED = [
  "Algeria","Argentina","Australia","Bahamas","Bahrain","Bahrain Offshore","Bangalore4 India","Bangalore7 India","Bangalore? India","Bangladesh","Belgium","Bermuda","Brazil","Brunei","Cairo Egypt","Canada","Cayman Islands","Chennai1 India","Chile","China","CIOM","Colombo Sri Lanka","Czech Republic","Egypt","France","Germany","Guangzhou China","Gurgaon India","Hang Seng China","Hang Seng","Hong Kong","HSBC Expat","HTI India","Hyderabad2 India","India (INM)","Indonesia","Ireland","Israel","Italy","Japan","Kazakhstan","Kolkata1 India","Krakow Poland","Kuwait","Luxembourg","Macau","Malaysia","Menara Malaysia","Maldives","Malta","Mauritius","Mexico","Nanhai Centre China","Netherlands","New Zealand","Oman","Philippines","Poland","Qatar","Quezon Manila 2","Saudi Arabia","Singapore","Slovakia","South Africa","South Korea","Spain","Sri Lanka","Switzerland","Taikoo Hui China","Taiwan","Thailand","United Kingdom (UK)","Uruguay","USA","Vietnam","Witman","RMZ Hyderabad India","Turkey",
];

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

// ---- Reusable EvalMessage ----
function EvalMessage({ field, evaluationResults }) {
  if (!evaluationResults || !evaluationResults[field]) return null;

  const { status, message, genaiOutput } = evaluationResults[field];

  return (
    <Box mt={1}>
      <Box display="flex" alignItems="center">
        {status === "pass" ? (
          <CheckCircle sx={{ color: "green", fontSize: 20, mr: 1 }} />
        ) : (
          <Cancel sx={{ color: "red", fontSize: 20, mr: 1 }} />
        )}
        <Typography
          variant="body2"
          sx={{ color: status === "pass" ? "green" : "red", fontWeight: 500 }}
        >
          {message}
        </Typography>
      </Box>
      {genaiOutput && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
        >
          <strong>GenAI Output:</strong> {genaiOutput}
        </Typography>
      )}
    </Box>
  );
}

export default function FormComponent() {
  const [evaluationResults, setEvaluationResults] = React.useState({});

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await fetch("/api/v1/im001/review-result", {
        method: "POST", // adjust to GET if needed
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setEvaluationResults(data);
    } catch (err) {
      console.error("Evaluation API failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Major Incident Review Form
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
          <Form noValidate className="form-root">
            {/* Row 1: Incident Number + Title */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                <EvalMessage field="titleResult" evaluationResults={evaluationResults} />
              </Grid>
            </Grid>

            {/* Row 2: Status */}
            <Box mt={3}>
              <Dropdown
                label="Status"
                ariaLabel="Status"
                options={STATUS_OPTIONS}
                value={values.status}
                onChange={(v) => setFieldValue("status", v || "")}
                error={touched.status && errors.status}
                helperText={touched.status && errors.status}
              />
            </Box>

            {/* Row 3: Countries + Impact */}
            <Box mt={3}>
              <Paper
                variant="outlined"
                sx={{ p: 3, bgcolor: "#fafafa", borderColor: "rgba(0,0,0,.2)" }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1.25, color: "text.secondary" }}>
                  Known countries/entities impacted
                </Typography>
                <Dropdown
                  multiple
                  ariaLabel="Known countries/entities impacted"
                  options={COUNTRIES_IMPACTED}
                  value={values.countriesImpacted}
                  onChange={(v) => setFieldValue("countriesImpacted", v)}
                  error={touched.countriesImpacted && errors.countriesImpacted}
                  helperText={touched.countriesImpacted && errors.countriesImpacted}
                  sx={{ mb: 2.5 }}
                />

                <Typography variant="subtitle2" sx={{ mb: 1.25, color: "text.secondary" }}>
                  What does this mean for our customers and colleagues?
                </Typography>
                <TextArea
                  name="impactDescription"
                  minRows={3}
                  value={values.impactDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.impactDescription && errors.impactDescription}
                  helperText={touched.impactDescription && errors.impactDescription}
                />
                <EvalMessage
                  field="whatDoesThisMeanResult"
                  evaluationResults={evaluationResults}
                />
              </Paper>
            </Box>

            {/* Row 4: Latest Update */}
            <Box mt={3}>
              <TextField
                fullWidth
                label="What's the latest update?"
                name="latestUpdate"
                value={values.latestUpdate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.latestUpdate && errors.latestUpdate)}
                helperText={touched.latestUpdate && errors.latestUpdate}
              />
              <EvalMessage
                field="latestUpdateResult"
                evaluationResults={evaluationResults}
              />
            </Box>

            {/* Row 5: Known root cause */}
            <Box mt={3}>
              <TextArea
                label="Known root cause"
                name="knownRootCause"
                minRows={2}
                value={values.knownRootCause}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.knownRootCause && errors.knownRootCause}
                helperText={touched.knownRootCause && errors.knownRootCause}
              />
              <EvalMessage
                field="knownRootCauseResult"
                evaluationResults={evaluationResults}
              />
            </Box>

            {/* Row 6: Summary */}
            <Box mt={3}>
              <TextArea
                label="Summary"
                name="summary"
                minRows={2}
                value={values.summary}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.summary && errors.summary}
                helperText={touched.summary && errors.summary}
              />
              <EvalMessage field="summaryResult" evaluationResults={evaluationResults} />
            </Box>

            {/* Row 7: Actions */}
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Stack direction="row" spacing={2}>
                <FormButton
                  label="Clear All"
                  variant="outlined"
                  color="secondary"
                  onClick={() => resetForm()}
                  sx={{ borderColor: "#9ec2f7", color: "#9ec2f7" }}
                />
                <FormButton
                  type="submit"
                  label="Submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ backgroundColor: "#f5a96a", color: "#111" }}
                />
              </Stack>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
