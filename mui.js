// utils/formatHistoryResults.js
// Turn an array of review results into { initialValues, initialEval } for the form + EvalMessage.

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  // suggestions sometimes come with \n
  return String(v)
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
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
  // prefer timestamp; fallback to id
  const byTs = [...list].sort((a, b) => {
    const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
    const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
    if (ta !== tb) return ta - tb;
    return (a?.id ?? 0) - (b?.id ?? 0);
  });
  return byTs[byTs.length - 1] || {};
};

const collect = (records, base, latest) => ({
  result: latest?.[`${base}Result`] ?? "",
  comment: latest?.[`${base}Comment`] ?? "",
  suggestion: dedupe(
    records.flatMap(r => toArray(r?.[`${base}Suggestion`]))
  ),
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

  const initialValues = {
    incidentNumber: latest?.incidentNumber ?? "",
    title: latest?.title ?? "",
    summary: latest?.summary ?? "",
    whatDoesThisMean: latest?.whatDoesThisMean ?? "",
    knownRootCause: latest?.knownRootCause ?? "",
    latestUpdate: latest?.latestUpdate ?? "",
    status: latest?.status ?? "",
    // API field is "knownCountries" -> our form uses "countriesImpacted"
    countriesImpacted: parseCountries(latest?.knownCountries),
  };

  const initialEval = {
    title:             collect(arr, "title",             latest),
    summary:           collect(arr, "summary",           latest),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean",  latest),
    knownRootCause:    collect(arr, "knownRootCause",    latest),
    latestUpdate:      collect(arr, "latestUpdate",      latest),
    // Countries use the *knownCountries* keys in the API:
    countriesImpacted: {
      result: latest?.knownCountriesResult ?? "",
      comment: latest?.knownCountriesComment ?? "",
      // show either explicit suggestions or the country strings themselves
      suggestion: dedupe(
        arr.flatMap(r =>
          toArray(r?.knownCountriesSuggestion ?? r?.knownCountries)
        )
      ),
    },
  };

  return { initialValues, initialEval };
}
