// formatHistoryResults.js

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  const s = String(v).trim();
  return s ? [s] : [];
};

const dedupe = (arr) => [...new Set(arr.map(s => s.trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  return String(v)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
};

const pickLatest = (list) => {
  if (!Array.isArray(list) || list.length === 0) return {};
  const byTs = [...list].sort((a, b) => {
    const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
    const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
    if (ta !== tb) return ta - tb;
    return (a?.id ?? 0) - (b?.id ?? 0);
  });
  return byTs[byTs.length - 1] || {};
};

// NEW: walk from newest → oldest and return the first non-empty value
const backfill = (records, getter) => {
  for (let i = records.length - 1; i >= 0; i--) {
    const v = getter(records[i]);
    if (v != null && String(v).trim() !== "") return v;
  }
  return "";
};

const collect = (records, base, latest) => ({
  result: latest?.[`${base}Result`] ?? "",
  comment: latest?.[`${base}Comment`] ?? "",
  suggestion: dedupe(records.flatMap(r => toArray(r?.[`${base}Suggestion`]))),
});

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

  const latest = pickLatest(arr);

  // Use the LAST non-empty knownCountries across the history
  const knownCountriesStr = backfill(arr, r => r?.knownCountries);

  const initialValues = {
    incidentNumber: latest?.incidentNumber ?? "",
    title:           backfill(arr, r => r?.title),
    summary:         backfill(arr, r => r?.summary),
    whatDoesThisMean: backfill(arr, r => r?.whatDoesThisMean),
    knownRootCause:   backfill(arr, r => r?.knownRootCause),
    latestUpdate:     backfill(arr, r => r?.latestUpdate),
    status:           backfill(arr, r => r?.status),
    countriesImpacted: parseCountries(knownCountriesStr), // ← prefill dropdown only
  };

  const initialEval = {
    title:            collect(arr, "title",            latest),
    summary:          collect(arr, "summary",          latest),
    whatDoesThisMean: collect(arr, "whatDoesThisMean", latest),
    knownRootCause:   collect(arr, "knownRootCause",   latest),
    latestUpdate:     collect(arr, "latestUpdate",     latest),

    // Countries: keep pass/fail + comment if you like, but NO suggestions / carousel.
    countriesImpacted: {
      result:  latest?.knownCountriesResult ?? "",
      comment: latest?.knownCountriesComment ?? "",
      suggestion: [], // ← no GenAI Output for countries
    },
  };

  return { initialValues, initialEval };
}
