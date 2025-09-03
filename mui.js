const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  const s = String(v).trim();
  return s ? [s] : [];
};
