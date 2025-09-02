// utils/formatters.js (or wherever formatHistoryResults lives)
export function formatHistoryResults(rows = []) {
  const fields = [
    "title",
    "summary",
    "whatDoesThisMean",
    "knownRootCause",
    "latestUpdate",
    "countriesImpacted", // mapped from knownCountries in the API
  ];

  // latest record (most recent) for filling the read-only form
  const latest = rows[rows.length - 1] || {};

  const initialValues = {
    incidentNumber: latest.incidentNumber ?? "",
    title: latest.title ?? "",
    summary: latest.summary ?? "",
    whatDoesThisMean: latest.whatDoesThisMean ?? "",
    knownRootCause: latest.knownRootCause ?? "",
    latestUpdate: latest.latestUpdate ?? "",
    countriesImpacted:
      Array.isArray(latest.knownCountries) ? latest.knownCountries : [],
    status: latest.status ?? "",
  };

  const initialEval = {};
  for (const f of fields) {
    initialEval[f] = {
      result: latest[`${mapApiField(f)}Result`] ?? "",
      comment: latest[`${mapApiField(f)}Comment`] ?? "",
      suggestion: [],
    };
  }

  // minimal normalization so *exact* dupes collapse, but “couldn’t” vs “unable to” survive
  const norm = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();

  const seen = Object.fromEntries(fields.map((f) => [f, new Set()]));

  // collect suggestions from every row (oldest -> newest keeps stable, newest -> oldest also fine)
  for (const row of rows) {
    pushIfUnique("title", row.titleSuggestion);
    pushIfUnique("summary", row.summarySuggestion);
    pushIfUnique("whatDoesThisMean", row.whatDoesThisMeanSuggestion);
    pushIfUnique("knownRootCause", row.knownRootCauseSuggestion);
    pushIfUnique("latestUpdate", row.latestUpdateSuggestion);
    // API uses knownCountriesSuggestion; we surface under countriesImpacted
    pushIfUnique("countriesImpacted", row.knownCountriesSuggestion);
  }

  function pushIfUnique(field, value) {
    if (!value) return;
    const key = norm(value);
    if (key && !seen[field].has(key)) {
      seen[field].add(key);
      initialEval[field].suggestion.push(value);
    }
  }

  return { initialValues, initialEval };
}

// map UI keys to API base field names for result/comment lookup above
function mapApiField(uiField) {
  switch (uiField) {
    case "countriesImpacted":
      return "knownCountries";
    default:
      return uiField;
  }
}
