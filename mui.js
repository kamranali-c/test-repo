export const formatMINData = (prevState = {}, newRecords = {}) => {
  // API key -> UI key
  const FIELD_MAP = {
    title: 'title',
    summary: 'summary',
    latestUpdate: 'latestUpdate',
    knownRootCause: 'knownRootCause',
    whatDoesThisMean: 'whatDoesThisMean',
    knownCountries: 'countriesImpacted', // <-- map to UI field
  };

  const out = { ...prevState };

  Object.entries(FIELD_MAP).forEach(([base, uiKey]) => {
    const result = toText(newRecords[`${base}Result`]);
    const comment = toText(newRecords[`${base}Comment`]);
    const suggestion =
      base === 'knownCountries' ? [] : toItems(newRecords[`${base}Suggestion`]);

    if (!out[uiKey]) {
      out[uiKey] = { result, comment, suggestion: dedupe(suggestion) };
      return;
    }
    if (result) out[uiKey].result = result;
    if (comment) out[uiKey].comment = comment;
    if (suggestion.length) {
      out[uiKey].suggestion = dedupe([...(out[uiKey].suggestion || []), ...suggestion]);
    }
  });

  return out;
};
