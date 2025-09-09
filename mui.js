const API_FIELD_MAP = {
  countriesImpacted: "knownCountries",
};
const toApiField = (k) => API_FIELD_MAP[k] ?? k;

field: toApiField(fieldData.name),  
