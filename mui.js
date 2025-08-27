// Imports (keep your existing paths if they differ)
import * as React from "react";
import { emitAlert } from "../utils/alert";                  // or wherever you export this
import RegenerateMINDialog from "../components/RegenerateMINDialog";
import { formatMajorIncidentData } from "../utils/formatter"; // your formatter
import { getRetryMIN } from "../services/min";                // the API call that regenerates

// Component signature (adjust props if yours differ)
export default function IM00IForm({
  statusOptions,
  countriesOptions,
  validationSchema,
  initialValues,
}) {
  // -------------------- State --------------------
  const [evalLatest, setEvalLatest] = React.useState({});
  const [incidentReviewResponse, setIncidentReviewResponse] = React.useState({});
  const [isOpenRegenerateMin, setOpenRegenerateMin] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [isDisabledIncidentNumber, setIsDisabledIncidentNumber] = React.useState(false);

  // which field we’re retrying (name maps to evalLatest keys, label is for the dialog title)
  const [fieldData, setFieldData] = React.useState({
    name: "",
    value: "",
    label: "",
  });

  // -------------------- Handlers --------------------

  /**
   * User clicked "Retry" for a field’s evaluation.
   * Keep the field metadata and open the regenerate dialog.
   */
  const onHandleRetry = (key, value, label) => {
    setFieldData({ name: key, value, label });

    // Preserve the current suggestion for this field so we can send it back as previousResponse
    setIncidentReviewResponse((prev) => ({
      ...prev,
      [`${key}Suggestion`]: evalLatest?.[key]?.suggestion?.[0] ?? "",
    }));

    setOpenRegenerateMin(true);
  };

  /**
   * User confirmed regenerate, with an optional reason.
   * Make the API call, update evaluation, close dialog, handle errors.
   */
  const onHandleRegenerateResponse = async (reason) => {
    if (!fieldData.name) {
      emitAlert?.({ type: "error", message: "Missing field context for retry." });
      return;
    }

    const payload = {
      taskId: incidentReviewResponse?.taskId,
      incidentNumber: incidentReviewResponse?.incidentNumber,
      fieldData: {
        name: fieldData.name,
        value: fieldData.value,
        label: fieldData.label,
      },
      previousResponse: incidentReviewResponse?.[`${fieldData.name}Suggestion`] ?? "",
      reason,
    };

    try {
      setIsRegenerating(true);

      // IMPORTANT: await so UI re-enables and state updates deterministically
      const response = await getRetryMIN(payload);

      // Map API response into your UI shape
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

  // (your JSX return starts here)
  // return ( ... )
}
