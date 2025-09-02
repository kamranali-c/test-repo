const mapReviewResultToInitialValues = (res) => ({
  incidentNumber   : res?.incidentNumber ?? "",
  title            : res?.title ?? "",
  status           : res?.status ?? "",
  countriesImpacted: Array.isArray(res?.knownCountries)
                       ? res.knownCountries
                       : (res?.knownCountries || "").split(",").map(s => s.trim()).filter(Boolean),
  whatDoesThisMean : res?.whatDoesThisMean ?? "",
  latestUpdate     : res?.latestUpdate ?? "",
  knownRootCause   : res?.knownRootCause ?? "",
  summary          : res?.summary ?? "",
});
const mapReviewResultToEvalLatest = (res) => res?.evalLatest || {};
