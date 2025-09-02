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

/**
 * Pick the most recent record that actually has data for a given base key.
 * We consider any of: base, baseResult, baseComment, baseSuggestion as “has data”.
 */
const pickLatestWithField = (records, base) => {
  const byTs = orderByTimeAsc(records);
  for (let i = byTs.length - 1; i >= 0; i--) {
    const r = byTs[i];
    if (
      r?.[base] != null ||
      r?.[`${base}Result`] != null ||
      r?.[`${base}Comment`] != null ||
      r?.[`${base}Suggestion`] != null
    ) {
      return r;
    }
  }
  // nothing had data – return the newest anyway
  return byTs[byTs.length - 1] || {};
};

const collect = (records, base) => {
  const best = pickLatestWithField(records, base);
  return {
    // take the best non-empty/latest values for result & comment
    result: best?.[`${base}Result`] ?? "",
    comment: best?.[`${base}Comment`] ?? "",
    // keep suggestions aggregated across *all* records
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

  const initialValues = {
    incidentNumber: latest?.incidentNumber ?? "",
    title: latest?.title ?? "",
    summary: latest?.summary ?? "",
    whatDoesThisMean: latest?.whatDoesThisMean ?? "",
    knownRootCause: latest?.knownRootCause ?? "",
    latestUpdate: latest?.latestUpdate ?? "",
    status: latest?.status ?? "",
    countriesImpacted: parseCountries(latest?.knownCountries),
  };

  const initialEval = {
    title:             collect(arr, "title"),
    summary:           collect(arr, "summary"),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean"),
    knownRootCause:    collect(arr, "knownRootCause"),
    latestUpdate:      collect(arr, "latestUpdate"),
    countriesImpacted: (() => {
      const best = pickLatestWithField(arr, "knownCountries");
      return {
        result: best?.knownCountriesResult ?? "",
        comment: best?.knownCountriesComment ?? "",
        suggestion: dedupe(
          arr.flatMap(r => toArray(r?.knownCountriesSuggestion ?? r?.knownCountries))
        ),
      };
    })(),
  };

  return { initialValues, initialEval };
}
