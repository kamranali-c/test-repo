// utils/formatHistoryResults.js

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  const s = String(v).trim();
  return s ? [s] : [];
};

const dedupe = (arr) => [...new Set(arr.map(s => s.trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  return String(v).split(",").map(s => s.trim()).filter(Boolean);
};

// newest → oldest, return first non-empty scalar
const backfillScalar = (records, key) => {
  for (let i = records.length - 1; i >= 0; i--) {
    const val = records[i]?.[key];
    if (val != null && String(val).trim() !== "") return String(val);
  }
  return "";
};

export function formatHistoryResults(records = []) {
  const arr = Array.isArray(records) ? records.filter(Boolean) : [records].filter(Boolean);
  if (arr.length === 0) {
    return {
      initialValues: {
        incidentNumber: "",
        title: "",
        summary: "",
        whatDoesThisMean: "",
        knownRootCause: "",
        latestUpdate: "",
        status: "",
        countriesImpacted: [],
      },
      initialEval: {},
    };
  }

  // Values shown in the form — use most recent non-empty values
  const initialValues = {
    incidentNumber:   backfillScalar(arr, "incidentNumber"),
    title:            backfillScalar(arr, "title"),
    summary:          backfillScalar(arr, "summary"),
    whatDoesThisMean: backfillScalar(arr, "whatDoesThisMean"),
    knownRootCause:   backfillScalar(arr, "knownRootCause"),
    latestUpdate:     backfillScalar(arr, "latestUpdate"),
    status:           backfillScalar(arr, "status"),
    countriesImpacted: parseCountries(backfillScalar(arr, "knownCountries")),
  };

  // Helper: collect eval with backfilled result/comment and merged suggestions
  const collect = (base) => ({
    result:    backfillScalar(arr, `${base}Result`),
    comment:   backfillScalar(arr, `${base}Comment`),
    suggestion: dedupe(arr.flatMap(r => toArray(r?.[`${base}Suggestion`]))),
  });

  // Eval blocks used by your green/red banner + carousel
  const initialEval = {
    title:            collect("title"),
    summary:          collect("summary"),
    whatDoesThisMean: collect("whatDoesThisMean"),
    knownRootCause:   collect("knownRootCause"),
    latestUpdate:     collect("latestUpdate"),

    // Countries: keep pass/fail + comment, but NO suggestions (no carousel)
    countriesImpacted: {
      result:    backfillScalar(arr, "knownCountriesResult"),
      comment:   backfillScalar(arr, "knownCountriesComment"),
      suggestion: [],
    },
  };

  return { initialValues, initialEval };
}
