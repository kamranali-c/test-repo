
const getPrevResponse = (key) => {
  const node = evalLatest?.[key];
  if (!node) return "";

  if (key === "countriesImpacted") {
    return (node.comment || "").trim();
  }

  const sug = Array.isArray(node.suggestion) ? node.suggestion : [];
  return (node.value && String(node.value).trim()) || (sug[sug.length - 1] || "");
};


// Normalize the value we’re sending (string for dropdown)
let currentValue = getFormValue(fieldData.name);
if (fieldData.name === "countriesImpacted" && Array.isArray(currentValue)) {
  currentValue = currentValue.filter(Boolean).join(", ");
}

// For previousResponse: use comment for countries, normal logic for others
const previous =
  fieldData.name === "countriesImpacted"
    ? (evalLatest?.countriesImpacted?.comment?.trim() || "")
    : getPrevResponse(fieldData.name);

// Final payload
const payload = {
  taskId: incidentReviewResponse?.taskId,
  incidentNumber: incidentReviewResponse?.incidentNumber,
  field: toApiField(fieldData.name),   // <-- sends "knownCountries"
  value: currentValue,                 // e.g. "Hong Kong, France"
  previousResponse: previous,          // comment for countries
  reason,
};
