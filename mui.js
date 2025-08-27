// --- imports (keep your paths) ---
import * as React from "react";
import { emitAlert } from "../utils/alert";
import RegenerateMINDialog from "../components/RegenerateMINDialog";
import { formatMajorIncidentData } from "../utils/formatter";
import { getRetryMIN } from "../services/min";

export default function IM00IForm({
  statusOptions,
  countriesOptions,
  validationSchema,
  initialValues,
}) {
  // -------------------- state --------------------
  const [evalLatest, setEvalLatest] = React.useState({});
  const [incidentReviewResponse, setIncidentReviewResponse] = React.useState({});
  const [isOpenRegenerateMin, setOpenRegenerateMin] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [isDisabledIncidentNumber, setIsDisabledIncidentNumber] = React.useState(false);

  // which field is being retried
  const [fieldData, setFieldData] = React.useState({ name: "", value: "", label: "" });

  // Keep a live reference of the current Formik values.
  // IMPORTANT: inside your Formik render, call: bindFormikValues(values)
  const formikValuesRef = React.useRef(initialValues || {});
  const bindFormikValues = React.useCallback((vals) => {
    formikValuesRef.current = vals || {};
  }, []);

  // Map evaluation keys to form field keys when they differ.
  // (Adjust if your keys aren’t identical.)
  const FIELD_KEY_MAP = {
    incidentNumber: "incidentNumber",
    title: "title",
    whatDoesThisMean: "whatDoesThisMean",
    latestUpdate: "latestUpdate",
    knownRootCause: "knownRootCause",
    summary: "summary",
    status: "status",
    countriesImpacted: "countriesImpacted",
  };

  // Get the freshest value for a field (prefers provided value, falls back to Formik)
  const getCurrentValueForKey = (key, provided) => {
    const hasProvided =
      provided !== undefined && provided !== null && String(provided).length > 0;
    if (hasProvided) return provided;

    const formKey = FIELD_KEY_MAP[key] || key;
    const val = formikValuesRef.current?.[formKey];

    // Arrays (e.g., countries) pass through; strings return as-is
    return Array.isArray(val) ? val : (val ?? "");
  };

  /**
   * User clicked "Retry" near an evaluated field.
   * Persist field meta and open the regenerate dialog.
   */
  const onHandleRetry = (key, value, label) => {
    const freshValue = getCurrentValueForKey(key, value);
    setFieldData({ name: key, value: freshValue, label });

    // keep the last suggestion so we can send it as previousResponse
    setIncidentReviewResponse((prev) => ({
      ...prev,
      [`${key}Suggestion`]: evalLatest?.[key]?.suggestion?.[0] ?? "",
    }));

    setOpenRegenerateMin(true);
  };

  /**
   * Dialog confirm handler: build payload from *fresh* values, call API, update UI.
   */
  const onHandleRegenerateResponse = async (reason) => {
    if (!fieldData.name) {
      emitAlert?.({ type: "error", message: "Missing field context for retry." });
      return;
    }

    // Re-resolve the latest value in case it changed while the dialog was open
    const latestFieldValue = getCurrentValueForKey(fieldData.name, fieldData.value);

    const payload = {
      taskId: incidentReviewResponse?.taskId,
      incidentNumber: incidentReviewResponse?.incidentNumber,
      fieldData: {
        name: fieldData.name,
        value: latestFieldValue,                // <— now reliably populated
        label: fieldData.label,
      },
      previousResponse:
        incidentReviewResponse?.[`${fieldData.name}Suggestion`] ?? "",
      reason,
    };

    try {
      setIsRegenerating(true);

      const response = await getRetryMIN(payload); // await network call
      const formatted = formatMajorIncidentData(evalLatest, response);
      setEvalLatest(formatted);

      emitAlert?.({ type: "success", message: "Response regenerated." });
    } catch (err) {
      console.error("Regenerate failed:", err);
      emitAlert?.({
        type: "error",
        message: `Failed to regenerate: ${err?.message || "Unknown error"}`,
      });
    } finally {
      setIsRegenerating(false);
      setOpenRegenerateMin(false);
    }
  };

  // NOTE: in your JSX (inside Formik render), call `bindFormikValues(values)` at the top so
  // this module always has the freshest form values when building the retry payload.
  // The rest of your component's JSX return goes below…
  // return ( ... )
}
