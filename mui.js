{!readOnly && evalLatest?.[name]?.result && (
  <RetryButton
    onRetry={() => {
      // make a plain string for previousResponse
      const raw = values[name];
      const prev =
        Array.isArray(raw) ? raw.filter(Boolean).join(", ") : (raw ?? "");
      onRetry(name, prev);   // <-- (fieldName, previousResponse:string)
    }}
    list={[]}                // no suggestions for countries dropdown
  />
)}
