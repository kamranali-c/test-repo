test('empty input -> clean defaults', () => {
  const { initialValues, initialEval } = formatHistoryResults([], { countriesOptions: COUNTRIES });

  expect(initialValues).toEqual({
    incidentNumber: '',
    title: '',
    summary: '',
    whatDoesThisMean: '',
    knownRootCause: '',
    latestUpdate: '',
    status: '',
    countriesImpacted: '',
  });

  // When there are no history rows we return an empty eval object
  expect(initialEval).toEqual({});
});
