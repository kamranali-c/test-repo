// utils/formatHistoryResults.js

/* ---------- helpers ---------- */
const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
  const s = String(v).trim();
  return s ? [s] : [];
};

const dedupe = (arr) =>
  [...new Set(arr.map(s => String(s).trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
  return String(v).split(",").map(s => s.trim()).filter(Boolean);
};

const lastNonEmpty = (records, key) => {
  for (let i = records.length - 1; i >= 0; i--) {
    const val = records[i]?.[key];
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === "string" && val.trim() !== "") return val;
  }
  return "";
};

const collect = (records, base) => {
  const result   = lastNonEmpty(records, `${base}Result`)  || "";
  const comment  = lastNonEmpty(records, `${base}Comment`) || "";
  const suggestion = dedupe(
    records.flatMap(r => toArray(r?.[`${base}Suggestion`]))
  );
  return { result, comment, suggestion };
};

// Turn country array (or csv) into a nice comma-separated label string.
const countriesToString = (rawList, options = []) => {
  const list = Array.isArray(rawList) ? rawList : parseCountries(rawList);
  const labels = list.map(s => {
    const hit =
      options.find(o => o?.value === s) ||
      options.find(o => o?.label === s) ||
      options.find(o => o?.label?.toLowerCase?.() === s.toLowerCase());
    return hit ? hit.label : s;
  });
  return labels.filter(Boolean).join(", ");
};

/* ---------- main ---------- */
export function formatHistoryResults(
  records = [],
  { countriesOptions = [] } = {}
) {
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
        countriesImpacted: "",           // <- string
      },
      initialEval: {},
    };
  }

  // Build initialValues from the last non-empty value across the list.
  const initialValues = {
    incidentNumber:   lastNonEmpty(arr, "incidentNumber")   || "",
    title:            lastNonEmpty(arr, "title")            || "",
    summary:          lastNonEmpty(arr, "summary")          || "",
    whatDoesThisMean: lastNonEmpty(arr, "whatDoesThisMean") || "",
    knownRootCause:   lastNonEmpty(arr, "knownRootCause")   || "",
    latestUpdate:     lastNonEmpty(arr, "latestUpdate")     || "",
    status:           (lastNonEmpty(arr, "status") || "").trim(),
    countriesImpacted: countriesToString(
      parseCountries(lastNonEmpty(arr, "knownCountries")),
      countriesOptions
    ), // <- single string like "Hong Kong, England"
  };

  // Build initialEval; keep countries suggestions/comments but no carousel items required.
  const initialEval = {
    title:             collect(arr, "title"),
    summary:           collect(arr, "summary"),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean"),
    knownRootCause:    collect(arr, "knownRootCause"),
    latestUpdate:      collect(arr, "latestUpdate"),
    countriesImpacted: {
      result:     lastNonEmpty(arr, "knownCountriesResult")  || "",
      comment:    lastNonEmpty(arr, "knownCountriesComment") || "",
      suggestion: dedupe(
        arr.flatMap(r => toArray(r?.knownCountriesSuggestion ?? r?.knownCountries))
      ),
    },
  };

  return { initialValues, initialEval };
}
