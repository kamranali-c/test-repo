// src/services/im001.js
export async function getReviewResult(taskId) {
  const { data } = await api.get(`/api/v1/im001/review-result/${taskId}`);
  // API returns an array with one record
  return Array.isArray(data) ? data[0] : data;
}

// src/modules/im001/mapReviewResult.js
const buildEval = (result, comment, suggestion) => ({
  result: (result || '').toLowerCase() === 'pass' ? 'Pass' : 'Fail',
  comment: comment || '',
  suggestion: suggestion ? [suggestion] : [],
});

export function toInitialValues(r) {
  return {
    incidentNumber: r?.incidentNumber ?? '',
    title: r?.title ?? '',
    summary: r?.summary ?? '',
    status: r?.status ?? '',
    latestUpdate: r?.latestUpdate ?? '',
    knownRootCause: r?.knownRootCause ?? '',
    whatDoesThisMean: r?.whatDoesThisMean ?? '',
    countriesImpacted: (r?.knownCountries || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  };
}

export function toInitialEval(r) {
  return {
    title: buildEval(r?.titleResult, r?.titleComment, r?.titleSuggestion),
    summary: buildEval(r?.summaryResult, r?.summaryComment, r?.summarySuggestion),
    whatDoesThisMean: buildEval(
      r?.whatDoesThisMeanResult,
      r?.whatDoesThisMeanComment,
      r?.whatDoesThisMeanSuggestion
    ),
    knownRootCause: buildEval(
      r?.knownRootCauseResult,
      r?.knownRootCauseComment,
      r?.knownRootCauseSuggestion
    ),
    latestUpdate: buildEval(
      r?.latestUpdateResult,
      r?.latestUpdateComment,
      r?.latestUpdateSuggestion
    ),
    knownCountries: buildEval(
      r?.knownCountriesResult,
      r?.knownCountriesComment,
      r?.knownCountriesSuggestion
    ),
    // add status if your API returns *_Result/Comment/Suggestion for it
  };
}


// src/modules/im001/IM001HistoricalSubmissions.js
import React from 'react';
import IM001Form from '../IM001Form';
import { getReviewResult } from '../../services/im001';
import { toInitialValues, toInitialEval } from './mapReviewResult';

export default function IM001HistoricalSubmissions() {
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState(null);
  const [initialEval, setInitialEval] = React.useState({});
  const [loadingDetails, setLoadingDetails] = React.useState(false);

  const handleRowClick = async (params) => {
    const taskId = params?.row?.taskId || params?.row?.taskID || params?.id;
    if (!taskId) return;
    // Don’t clear current form until new details arrive
    setSelectedTaskId(taskId);
    setLoadingDetails(true);
    try {
      const rec = await getReviewResult(taskId);
      setInitialValues(toInitialValues(rec));
      setInitialEval(toInitialEval(rec));
    } finally {
      setLoadingDetails(false);
    }
  };

  // ... your grid/table setup; use handleRowClick on row click

  return (
    <>
      {/* your table component … onRowClick={handleRowClick} */}
      <div style={{ marginTop: 24 }}>
        {initialValues && (
          <IM001Form
            initialValues={initialValues}
            initialEvalLatest={initialEval}
            readOnly
            isLoadingDetails={loadingDetails}
          />
        )}
      </div>
    </>
  );
}
