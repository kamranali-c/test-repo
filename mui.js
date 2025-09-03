const handleRowClick = async (params) => {
  const taskId = params?.row?.taskId || params?.id || params?.rowId;
  if (!taskId) return;

  // clear then fetch (your preferred flow)
  setSelectedTaskId(taskId);
  setIsLoadingDetails(true);
  setDetailsInitials(null);
  setDetailsEval({});

  try {
    // 1) fetch history rows for the task
    const data = await fetchReviewResultsByTaskId(taskId);
    const rows = Array.isArray(data) ? data : [data];

    // 2) collapse history -> latest non-empty values + aggregated suggestions
    const { initialValues, initialEval } = formatHistoryResults(rows);

    // 3) HYDRATE form dropdowns to actual option *values*
    const hydratedInitialValues = {
      ...initialValues,
      countriesImpacted: mapMultiToOptionValues(initialValues.countriesImpacted, COUNTRIES_OPTIONS),
      status:            mapSingleToOptionValue(initialValues.status, STATUS_OPTIONS),
    };

    // 4) paint
    setDetailsInitials(hydratedInitialValues);
    setDetailsEval(initialEval);
  } finally {
    setIsLoadingDetails(false);
  }
};
