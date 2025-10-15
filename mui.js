// src/utils/modelSelection.js
export const DEFAULT_MODEL_ID = "mistral_large_2402_v1";

const MODEL_ID_TO_UI = {
  anthropic_claude_3_7_sonnet_v1: "Claude",
  mistral_large_2402_v1: "Mistral",
};

let selectedModelId = (typeof window !== "undefined" && localStorage.getItem("model.selected.id")) || DEFAULT_MODEL_ID;

export const setSelectedModelId = (id) => {
  const valid = MODEL_ID_TO_UI[id] ? id : DEFAULT_MODEL_ID;
  selectedModelId = valid;
  try { localStorage.setItem("model.selected.id", valid); } catch {}
};

export const getSelectedModelType = () => MODEL_ID_TO_UI[selectedModelId] ?? "Mistral"; // for UI
const getSelectedModelTypeAPI = () => getSelectedModelType().toUpperCase();            // for API

export const withModelType = (payload = {}) => {
  const mt = getSelectedModelTypeAPI();
  if (typeof FormData !== "undefined" && payload instanceof FormData) {
    payload.set("modelType", mt);
    return payload;
  }
  return { ...payload, modelType: mt };
};

export const addModelTypeQuery = (url) => {
  const mt = encodeURIComponent(getSelectedModelTypeAPI());
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}modelType=${mt}`;
};

export const guidelinePrefix = () => (getSelectedModelType() === "Claude" ? "-" : "#");
