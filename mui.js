const handleRowClick = async ({ row }) => {
  const taskId = row?.taskId;
  if (!taskId) return;

  setSelectedTaskId(taskId);
  setIsLoadingDetails(true);
  setDetailsInitials(null);
  setDetailsEval({});

  try {
    // 1) fetch rows
    const data = await getReviewResultByTaskId(taskId);
    const rows = Array.isArray(data) ? data : [data];

    // 2) collapse history -> strings for fields + eval for carousel
    const { initialValues, initialEval } = formatHistoryResults(rows);

    // 3) paint (NO OPTION MAPPING NEEDED)
    setDetailsInitials(initialValues);  // e.g. { status: "New", countriesImpacted: "Hong Kong", ... }
    setDetailsEval(initialEval);
  } finally {
    setIsLoadingDetails(false);
  }
};
