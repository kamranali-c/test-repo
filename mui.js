// formatHistoryResults.js (ensure shapes)
const asString = v => (v == null ? "" : String(v).trim());
const asArray  = v =>
  v == null
    ? []
    : Array.isArray(v)
      ? v.filter(Boolean).map(s => String(s).trim())
      : String(v).split(",").map(s => s.trim()).filter(Boolean);

const initialValues = {
  // ...
  status: asString(latest?.status),
  countriesImpacted: asArray(latest?.knownCountries),
};
