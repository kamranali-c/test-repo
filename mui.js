// utils/formatHistoryResults.js

/* ---------- helpers ---------- */

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(s => s.trim()).filter(Boolean);
  const s = String(v).trim();
  if (!s) return [];
  // keep paragraph blocks intact
  return /\n{2,}/.test(s) ? [s] : [s];
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
  const result   = lastNonEmpty(records, `${base}Result`)   || "";
  const comment  = lastNonEmpty(records, `${base}Comment`)  || "";
  const suggestion = dedupe(
    records.flatMap(r => toArray(r?.[`${base}Suggestion`]))
  );
  return { result, comment, suggestion };
};

// map countries to option values (array)
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
  return [...new Set(out)];
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
        countriesImpacted: [],
      },
      initialEval: {},
    };
  }

  // last non-empty wins (raw values)
  const initialValuesRaw = {
    incidentNumber:   lastNonEmpty(arr, "incidentNumber") || "",
    title:            lastNonEmpty(arr, "title") || "",
    summary:          lastNonEmpty(arr, "summary") || "",
    whatDoesThisMean: lastNonEmpty(arr, "whatDoesThisMean") || "",
    knownRootCause:   lastNonEmpty(arr, "knownRootCause") || "",
    latestUpdate:     lastNonEmpty(arr, "latestUpdate") || "",
    status:           (lastNonEmpty(arr, "status") || "").trim(), // leave as string
    countriesImpacted: parseCountries(lastNonEmpty(arr, "knownCountries")),
  };

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

  // hydrate only countries; status stays string
  const initialValues = {
    ...initialValuesRaw,
    countriesImpacted: mapMultiToOptionValues(
      initialValuesRaw.countriesImpacted,
      countriesOptions
    ),
  };

  return { initialValues, initialEval };
}
