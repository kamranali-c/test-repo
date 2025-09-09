export const addWordSpacing = (key) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\./, (s) => s);

export const formatMINData = (prevState, newRecords) => {
  // UI field -> API base key (countries use knownCountries in the API)
  const FIELDS = [
    ["title",            "title"],
    ["summary",          "summary"],
    ["latestUpdate",     "latestUpdate"],
    ["knownRootCause",   "knownRootCause"],
    ["whatDoesThisMean", "whatDoesThisMean"],
    ["countriesImpacted","knownCountries"], // ✅ include countries for result/comment only
  ];

  const out = { ...prevState };
  const asArr = (x) =>
    Array.isArray(x) ? x : (x != null && String(x).trim() ? [String(x).trim()] : []);

  FIELDS.forEach(([formKey, apiBase]) => {
    const resultKey     = `${apiBase}Result`;
    const commentKey    = `${apiBase}Comment`;
    const suggestionKey = `${apiBase}Suggestion`;

    const result   = newRecords[resultKey]   ?? "";
    const comment  = newRecords[commentKey]  ?? "";

    // ❗ Countries never show suggestions
    const suggestion =
      formKey === "countriesImpacted" ? [] : asArr(newRecords[suggestionKey]);

    if (!out[formKey]) {
      out[formKey] = { result, comment, suggestion };
    } else {
      if (result)  out[formKey].result  = result;
      if (comment) out[formKey].comment = comment;
      if (formKey !== "countriesImpacted" && suggestion.length) {
        out[formKey].suggestion = [...(out[formKey].suggestion || []), ...suggestion];
      }
    }
  });

  return out;
};
