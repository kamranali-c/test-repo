// src/utils/__tests__/formatHistoryResults.test.js
import { formatHistoryResults } from '../formatHistoryResults';

const COUNTRIES = [
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'England',   label: 'England' },
  { value: 'France',    label: 'France' },
];

const rec = (over = {}) => ({
  id: over.id ?? 1,
  taskId: 't-1',
  incidentNumber: over.incidentNumber ?? 'INC-123',
  title: over.title ?? null,
  titleResult: over.titleResult ?? null,
  titleComment: over.titleComment ?? null,
  titleSuggestion: over.titleSuggestion ?? null,
  summary: over.summary ?? null,
  latestUpdate: over.latestUpdate ?? null,
  knownRootCause: over.knownRootCause ?? null,
  whatDoesThisMean: over.whatDoesThisMean ?? null,
  status: over.status ?? null,
  knownCountries: over.knownCountries ?? null,
  knownCountriesResult: over.knownCountriesResult ?? null,
  knownCountriesComment: over.knownCountriesComment ?? null,
  knownCountriesSuggestion: over.knownCountriesSuggestion ?? null,
  timestamp: over.timestamp ?? '2025-09-02T12:00:00Z',
});

describe('formatHistoryResults (simple)', () => {
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
    expect(initialEval.title).toEqual({ result: '', comment: '', suggestion: [] });
  });

  test('last non-empty wins (newest blank does not overwrite older good value)', () => {
    const older = rec({ title: 'Older title', titleResult: 'Pass', titleComment: 'ok', status: 'New' });
    const newerBlank = rec({ id: 2, title: '', titleResult: '', titleComment: '', status: '' });
    const { initialValues, initialEval } = formatHistoryResults([older, newerBlank], { countriesOptions: COUNTRIES });
    expect(initialValues.title).toBe('Older title');
    expect(initialValues.status).toBe('New');
    expect(initialEval.title.result).toBe('Pass');
    expect(initialEval.title.comment).toBe('ok');
  });

  test('aggregates & dedupes suggestions across records (no paragraph splitting)', () => {
    const r1 = rec({ id: 1, titleSuggestion: 'A' });
    const r2 = rec({ id: 2, titleSuggestion: 'A' }); // duplicate
    const r3 = rec({ id: 3, titleSuggestion: 'B' });
    const { initialEval } = formatHistoryResults([r1, r2, r3], { countriesOptions: COUNTRIES });
    expect(initialEval.title.suggestion).toEqual(['A', 'B']);
  });

  test('countriesImpacted -> single, comma-separated string using option labels', () => {
    const r = rec({ knownCountries: ['FRANCE', 'Hong Kong'] });
    const { initialValues } = formatHistoryResults([r], { countriesOptions: COUNTRIES });
    expect(initialValues.countriesImpacted).toBe('France, Hong Kong');
  });

  test('countries eval backfills result/comment from last non-empty', () => {
    const older = rec({ knownCountriesResult: 'Fail', knownCountriesComment: 'select all' });
    const newerBlank = rec({ id: 2, knownCountriesResult: '', knownCountriesComment: '' });
    const { initialEval } = formatHistoryResults([older, newerBlank], { countriesOptions: COUNTRIES });
    expect(initialEval.countriesImpacted.result).toBe('Fail');
    expect(initialEval.countriesImpacted.comment).toBe('select all');
  });
});
