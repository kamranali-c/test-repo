export default function IM001HistoricalSubmissions() {
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState(null);
  const [initialEval, setInitialEval] = React.useState({});
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  const handleRowClick = async (params) => {
    const taskId = params?.row?.taskId || params?.row?.taskID || params?.id;
    if (!taskId) return;

    setSelectedTaskId(taskId);
    setIsLoadingDetails(true);
    setInitialValues(null);          // clear immediately
    setInitialEval({});

    try {
      const rec = await getReviewResult(taskId);     // API call
      setInitialValues(toInitialValues(rec));        // map for form
      setInitialEval(toInitialEval(rec));            // map eval badges
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <>
      {/* Your grid — just wire the click */}
      {/* <DataGrid ... onRowClick={handleRowClick} /> */}

      {isLoadingDetails && <LinearProgress />}

      <Box mt={3}>
        {initialValues ? (
          <IM001Form
            initialValues={initialValues}
            initialEvalLatest={initialEval}
            readOnly
            isLoadingDetails={isLoadingDetails}
          />
        ) : isLoadingDetails ? (
          <Skeleton variant="rectangular" height={360} />
        ) : null}
      </Box>
    </>
  );
}
