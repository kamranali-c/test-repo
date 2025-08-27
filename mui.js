// Use the last model output; fall back to the last stored suggestion if needed
const getPrevResponse = (key) => {
  const node = evalLatest?.[key];
  if (node) {
    const sug = Array.isArray(node.suggestion)
      ? node.suggestion
      : node.suggestion ? [node.suggestion] : [];
    return (node.value && String(node.value).trim()) || (sug[0] ?? "");
  }
  return incidentReviewResponse?.[`${key}Suggestion`] ?? "";
};
