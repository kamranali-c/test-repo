// utils/formatHistoryResults.js

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  return String(v).split("\n").map(s => s.trim()).filter(Boolean);
};

const dedupe = (arr) => [...new Set(arr.map(s => s.trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  return String(v).split(",").map(s => s.trim()).filter(Boolean);
};

const orderByTimeAsc = (list) =>
  [...list].sort((a, b) => {
    const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
    const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
    if (ta !== tb) return ta - tb;
    return (a?.id ?? 0) - (b?.id ?? 0);
  });

const pickLatest = (list) => {
  if (!Array.isArray(list) || list.length === 0) return {};
  const byTs = orderByTimeAsc(list);
  return byTs[byTs.length - 1] || {};
};

// “Has usable value?” (rejects null/undefined/empty/whitespace)
const hasValue = (v) =>
  v != null && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== "");

/**
 * Return the most recent record that actually has *any* data
 * for the field group `base` (raw/base, baseResult, baseComment, baseSuggestion).
 */
const pickLatestWithField = (records, base) => {
  const byTs = orderByTimeAsc(records);
  for (let i = byTs.length - 1; i >= 0; i--) {
    const r = byTs[i];
    if (
      hasValue(r?.[base]) ||
      hasValue(r?.[`${base}Result`]) ||
      hasValue(r?.[`${base}Comment`]) ||
      hasValue(r?.[`${base}Suggestion`])
    ) {
      return r;
    }
  }
  return byTs[byTs.length - 1] || {};
};

/**
 * Pick the most recent record having a non-empty *raw* field.
 * (Used for initialValues, e.g., title/summary/latestUpdate/etc.)
 */
const latestWithRaw = (records, key) => {
  const byTs = orderByTimeAsc(records);
  for (let i = byTs.length - 1; i >= 0; i--) {
    const r = byTs[i];
    if (hasValue(r?.[key])) return r;
  }
  return byTs[byTs.length - 1] || {};
};

const collect = (records, base) => {
  const best = pickLatestWithField(records, base);
  return {
    result: best?.[`${base}Result`] ?? "",
    comment: best?.[`${base}Comment`] ?? "",
    suggestion: dedupe(records.flatMap(r => toArray(r?.[`${base}Suggestion`]))),
  };
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

  const latest = pickLatest(arr);

  // For each field, take the newest non-empty value; fall back to newest record if none present.
  const initialValues = {
    incidentNumber: latest?.incidentNumber ?? "",

    title:            (latestWithRaw(arr, "title")?.title ?? "").trim(),
    summary:          (latestWithRaw(arr, "summary")?.summary ?? "").trim(),
    whatDoesThisMean: (latestWithRaw(arr, "whatDoesThisMean")?.whatDoesThisMean ?? "").trim(),
    knownRootCause:   (latestWithRaw(arr, "knownRootCause")?.knownRootCause ?? "").trim(),
    latestUpdate:     (latestWithRaw(arr, "latestUpdate")?.latestUpdate ?? "").trim(),
    status:           (latestWithRaw(arr, "status")?.status ?? "").trim(),

    // API uses "knownCountries" → our form uses "countriesImpacted"
    countriesImpacted: parseCountries(latestWithRaw(arr, "knownCountries")?.knownCountries),
  };

  const initialEval = {
    title:             collect(arr, "title"),
    summary:           collect(arr, "summary"),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean"),
    knownRootCause:    collect(arr, "knownRootCause"),
    latestUpdate:      collect(arr, "latestUpdate"),

    // Countries use the knownCountries* keys
    countriesImpacted: (() => {
      const best = pickLatestWithField(arr, "knownCountries");
      return {
        result:   best?.knownCountriesResult ?? "",
        comment:  best?.knownCountriesComment ?? "",
        suggestion: dedupe(
          arr.flatMap(r => toArray(r?.knownCountriesSuggestion ?? r?.knownCountries))
        ),
      };
    })(),
  };

  return { initialValues, initialEval };
}
