// utils/formatter.js

export const addWordSpacing = (key = "") =>
  String(key).replace(/([a-z])([A-Z])/g, "$1 $2");

/* ---------- normalisers ---------- */
const toText = (v) => {
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (v && typeof v === "object") {
    if ("label" in v) return String(v.label);
    if ("value" in v) return String(v.value);
    return "";
  }
  return v == null ? "" : String(v);
};

// Keep paragraph blocks together; split only on blank lines
const toItems = (v) =>
  v == null
    ? []
    : Array.isArray(v)
    ? v.map(toText).filter(Boolean)
    : String(v)
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);

const dedupe = (arr = []) => [...new Set(arr.map((s) => String(s)))].filter(Boolean);

/* ---------- main reducer used by both review & regenerate ---------- */
export const formatMINData = (prevState = {}, newRecords = {}) => {
  // NOTE: include knownCountries so the form can show its PASS/FAIL + comment
  // but we purposely DO NOT surface suggestions for countries.
  const FIELDS = [
    "title",
    "summary",
    "latestUpdate",
    "knownRootCause",
    "whatDoesThisMean",
    "knownCountries",
  ];

  const out = { ...prevState };

  FIELDS.forEach((field) => {
    const result = toText(newRecords[`${field}Result`]);
    const comment = toText(newRecords[`${field}Comment`]);

    // Countries: no GenAI outputs list in the UI; keep empty.
    const rawSuggestion =
      field === "knownCountries" ? [] : toItems(newRecords[`${field}Suggestion`]);

    if (!out[field]) {
      out[field] = {
        result,
        comment,
        suggestion: dedupe(rawSuggestion),
      };
      return;
    }

    if (result) out[field].result = result;
    if (comment) out[field].comment = comment;
    if (rawSuggestion?.length) {
      out[field].suggestion = dedupe([...(out[field].suggestion || []), ...rawSuggestion]);
    }
  });

  return out;
};
