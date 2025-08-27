// keep this ref in your component (already there)
const formikValuesRef = React.useRef(initialValues || {});
const bindFormikValues = (vals) => (formikValuesRef.current = vals || {});

// helpers
+const getFormValue = (key) => {
+  const v = formikValuesRef.current?.[key];
+  return Array.isArray(v) ? v.join(", ") : (v ?? "");
+};
+const getPrevResponse = (key) =>
+  evalLatest?.[key]?.value ??
+  evalLatest?.[key]?.suggestion?.[0] ??
+  "";

// in onHandleRegenerateResponse:
-const latestFieldValue = getCurrentValueForKey(fieldData.name);
+const currentValue = getFormValue(fieldData.name);
+const previous = getPrevResponse(fieldData.name);

const payload = {
  taskId: incidentReviewResponse?.taskId,
  incidentNumber: incidentReviewResponse?.incidentNumber,
  field: fieldData.name,
- value: latestFieldValue,
- previousResponse: latestFieldValue,
+ value: currentValue,            // <- what’s currently in the form
+ previousResponse: previous,     // <- last model output / suggestion
  reason,
};

{({ values /* ... */ }) => {
  bindFormikValues(values);
  // ...
}}
