// Prefer evalLatest → provided → Formik value
const getCurrentValueForKey = (key, provided) => {
  const hasProvided =
    provided !== undefined && provided !== null && String(provided).length > 0;
  if (hasProvided) return provided;

  // ① try model output first
  const fromEval =
    evalLatest?.[key]?.value ??
    evalLatest?.[key]?.suggestion?.[0] ?? // common shape in your EvalMessage
    "";

  if (fromEval) return fromEval;

  // ② fall back to form field
  const formKey = FIELD_KEY_MAP[key] || key;
  const fromForm = formikValuesRef.current?.[formKey];
  return Array.isArray(fromForm) ? fromForm : (fromForm ?? "");
};

<EvalMessage
  latest={evalLatest?.whatDoesThisMean}
  onRetry={() =>
    onHandleRetry(
      "whatDoesThisMean",
      // use model output; fallback handled by getCurrentValueForKey
      evalLatest?.whatDoesThisMean?.value ??
        evalLatest?.whatDoesThisMean?.suggestion?.[0] ??
        ""
    )
  }
/>


<EvalMessage
  latest={evalLatest?.title}
  onRetry={() => onHandleRetry("title", evalLatest?.title?.suggestion?.[0] ?? "")}
/>

<EvalMessage
  latest={evalLatest?.knownRootCause}
  onRetry={() =>
    onHandleRetry("knownRootCause", evalLatest?.knownRootCause?.suggestion?.[0] ?? "")
  }
/>
    
