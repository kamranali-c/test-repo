// Single source of truth for model selection + payload helper

export const DEFAULT_MODEL_ID = "mistral-large-latest";

export const MODEL_ID_TO_TYPE = {
  "claude-3-5-sonnet": "Claude",
  "mistral-large-latest": "Mistral",
};

// In-memory app state (good enough for this ticket; no persistence)
let selectedModelId = DEFAULT_MODEL_ID;

export const setSelectedModelId = (id) => {
  selectedModelId = MODEL_ID_TO_TYPE[id] ? id : DEFAULT_MODEL_ID;
};

export const getSelectedModelId = () => selectedModelId;

export const normaliseModelType = (id) => MODEL_ID_TO_TYPE[id] ?? "Mistral";

export const getSelectedModelType = () => normaliseModelType(selectedModelId);

// Attach modelType to any request body
export const withModelType = (payload = {}) => ({
  ...payload,
  modelType: getSelectedModelType(),
});

// (Optional) add as query param for GET fallback paths
export const addModelTypeQuery = (url) => {
  const mt = encodeURIComponent(getSelectedModelType());
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}modelType=${mt}`;
};
