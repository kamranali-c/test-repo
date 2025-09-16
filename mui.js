
const toItems = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(toText).filter(Boolean);
  const s = toText(v);
  return s ? [s] : [];
};

const dedupe = (arr = []) =>
  [...new Set(arr.map((s) => String(s).trim()))].filter(Boolean);
