// utils/formatHistoryResults.js
// Collapses history rows -> { initialValues, initialEval } and hydrates dropdowns.

/* ---------------- helpers ---------------- */

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
  // keep paragraph blocks (split only on blank lines)
  const s = String(v).trim();
  if (!s) return [];
  return /\n{2,}/.test(s) ? [s] : [s];
};

const dedupe = (arr) =>
  [...new Set(arr.map(s => String(s).trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
  return String(v)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
};

// scan from the end and return the last non-empty value for key
const lastNonEmpty = (records, key) => {
  for (let i = records.length - 1; i >= 0; i--) {
    const val = records[i]?.[key];
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === "string" && val.trim() !== "") return val;
  }
  return "";
};

// latest record by timestamp (fallback to id)
const pickLatest = (records) => {
  if (!Array.isArray(records) || records.length === 0) return {};
  const sorted = [...records].sort((a, b) => {
    const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
    const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
    if (ta !== tb) return ta - tb;
    return (a?.id ?? 0) - (b?.id ?? 0);
  });
  return sorted[sorted.length - 1] || {};
};

// collect result/comment from last-non-empty + suggestions from all
const collect = (records, base) => {
  const result   = lastNonEmpty(records, `${base}Result`)   || "";
  const comment  = lastNonEmpty(records, `${base}Comment`)  || "";
  const suggestion = dedupe(
    records.flatMap(r => toArray(r?.[`${base}Suggestion`]))
  );
  return { result, comment, suggestion };
};

// dropdown mappers
const mapSingleToOptionValue = (raw, options = []) => {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  const hit =
    options.find(o => o?.value === s) ||
    options.find(o => o?.label === s) ||
    options.find(o => o?.label?.toLowerCase?.() === s.toLowerCase());
  return hit ? hit.value : s; // fall back to raw (read-only still displays)
};

const mapMultiToOptionValues = (rawList, options = []) => {
  const list = Array.isArray(rawList) ? rawList : [rawList];
  const out = [];
  for (const raw of list) {
    const s = String(raw ?? "").trim();
    if (!s) continue;
    const hit =
      options.find(o => o?.value === s) ||
      options.find(o => o?.label === s) ||
      options.find(o => o?.label?.toLowerCase?.() === s.toLowerCase());
    out.push(hit ? hit.value : s);
  }
  // dedupe, keep original order
  return [...new Set(out)];
};

/* ---------------- main ---------------- */

export function formatHistoryResults(
  records = [],
  { statusOptions = [], countriesOptions = [] } = {}
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
        countriesImpacted: [],
      },
      initialEval: {},
    };
  }

  // Build raw initialValues via "last non-empty wins"
  const initialValuesRaw = {
    incidentNumber:   lastNonEmpty(arr, "incidentNumber") || "",
    title:            lastNonEmpty(arr, "title") || "",
    summary:          lastNonEmpty(arr, "summary") || "",
    whatDoesThisMean: lastNonEmpty(arr, "whatDoesThisMean") || "",
    knownRootCause:   lastNonEmpty(arr, "knownRootCause") || "",
    latestUpdate:     lastNonEmpty(arr, "latestUpdate") || "",
    status:           lastNonEmpty(arr, "status") || "",
    countriesImpacted: parseCountries(lastNonEmpty(arr, "knownCountries")),
  };

  // initialEval: use last-non-empty for result/comment; aggregate suggestions
  const initialEval = {
    title:             collect(arr, "title"),
    summary:           collect(arr, "summary"),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean"),
    knownRootCause:    collect(arr, "knownRootCause"),
    latestUpdate:      collect(arr, "latestUpdate"),
    countriesImpacted: {
      result:    lastNonEmpty(arr, "knownCountriesResult")  || "",
      comment:   lastNonEmpty(arr, "knownCountriesComment") || "",
      suggestion: dedupe(
        arr.flatMap(r => toArray(r?.knownCountriesSuggestion ?? r?.knownCountries))
      ),
    },
  };

  // ----- HYDRATE dropdowns here -----
  const initialValues = {
    ...initialValuesRaw,
    status: mapSingleToOptionValue(initialValuesRaw.status, statusOptions), // string
    countriesImpacted: mapMultiToOptionValues(initialValuesRaw.countriesImpacted, countriesOptions), // array
  };

  return { initialValues, initialEval };
}
