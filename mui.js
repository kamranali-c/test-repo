const handleRowClick = async (params) => {
  const taskId = params?.row?.taskId || params?.id || params?.rowId; // tolerate different grid shapes
  if (!taskId) return;

  setSelectedTaskId(taskId);
  setLoadingDetails(true);
  setDetailsError(null);

  try {
    const res = await getReviewResultByTaskId(taskId);
    setDetails({
      raw: res,
      initialValues: mapReviewResultToInitialValues(res),
      initialEval  : mapReviewResultToEvalLatest(res),
    });
  } catch (e) {
    setDetailsError(e?.message || "Failed to load submission details");
  } finally {
    setLoadingDetails(false);
  }
};

{selectedTaskId && (
  <Box mt={3}>
    <Paper variant="outlined">
      <Box px={3} py={2} display="flex" alignItems="center" gap={2}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Selected submission: <strong>{selectedTaskId}</strong>
        </Typography>
        {loadingDetails && <CircularProgress size={20} />}
        {detailsError && (
          <Typography color="error" variant="body2">{detailsError}</Typography>
        )}
      </Box>
      <Divider />
      <Box p={3}>
        {details && (
          <IM001Form
            readOnly
            hideActions
            // reusing your existing options from the module
            statusOptions={STATUS_OPTIONS}
            countriesOptions={COUNTRIES_OPTIONS}
            validationSchema={null}            // not needed in read-only
            initialValues={details.initialValues}
            initialEvalLatest={details.initialEval}
          />
        )}
      </Box>
    </Paper>
  </Box>
)}
