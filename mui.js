// Turn an array of review results into:
//   { initialValues, initialEval }  -> for the form + EvalMessage.
// Notes:
// - We pick the *latest non-empty* value across records for each field.
// - Suggestions are deduped and paragraph blocks are kept together
//   (we don't split single suggestions into multiple items).

const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);

  const s = String(v).trim();
  if (!s) return [];

  // Keep multi-paragraph suggestions together; only split on blank-line blocks.
  return /\n{2,}/.test(s) ? s.split(/\n{2,}/).map(t => t.trim()).filter(Boolean) : [s];
};

const dedupe = (arr) =>
  [...new Set(arr.map(s => String(s).trim()).filter(Boolean))];

const parseCountries = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  return String(v)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
};

// get the *last* record that has a non-empty value for a given key
const lastNonEmpty = (records, key) => {
  for (let i = records.length - 1; i >= 0; i -= 1) {
    const val = records[i]?.[key];
    if (
      (Array.isArray(val) && val.length > 0) ||
      (typeof val === "string" && val.trim() !== "") ||
      (val && typeof val !== "string" && typeof val !== "object")
    ) {
      return val;
    }
  }
  return "";
};

// get latest record by timestamp (fallback to id)
const pickLatest = (records) => {
  if (!Array.isArray(records) || records.length === 0) return {};
  const sorted = [...records].sort((a, b) => {
    const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
    const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
    if (ta !== tb) return ta - tb;
    return (a?.id ?? 0) - (b?.id ?? 0);
  });
  return sorted[sorted.length - 1] || {};
};

// collect result/comment from the *last non-empty* entry; suggestions from all
const collect = (records, base) => {
  const result = lastNonEmpty(records, `${base}Result`) || "";
  const comment = lastNonEmpty(records, `${base}Comment`) || "";

  const suggestion = dedupe(
    records.flatMap(r => toArray(r?.[`${base}Suggestion`]))
  );

  return { result, comment, suggestion };
};

export function formatHistoryResults(records = []) {
  const arr = Array.isArray(records) ? records.filter(Boolean) : [records].filter(Boolean);

  if (arr.length === 0) {
    return {
      initialValues: {
        incidentNumber: "",
        title: "",
        summary: "",
        whatDoesThisMean: "",
        knownRootCause: "",
        latestUpdate: "",
        status: "",
        countriesImpacted: [],
      },
      initialEval: {},
    };
  }

  // Build initialValues from the *last non-empty* value across the list.
  const initialValues = {
    incidentNumber: lastNonEmpty(arr, "incidentNumber") || "",
    title:          lastNonEmpty(arr, "title") || "",
    summary:        lastNonEmpty(arr, "summary") || "",
    whatDoesThisMean: lastNonEmpty(arr, "whatDoesThisMean") || "",
    knownRootCause: lastNonEmpty(arr, "knownRootCause") || "",
    latestUpdate:   lastNonEmpty(arr, "latestUpdate") || "",
    status:         lastNonEmpty(arr, "status") || "",
    // API uses "knownCountries" -> our form field is "countriesImpacted"
    countriesImpacted: parseCountries(lastNonEmpty(arr, "knownCountries")),
  };

  // Build initialEval; use robust "last non-empty" logic so we never overwrite
  // a good result/comment with a blank one from a later record.
  const initialEval = {
    title:             collect(arr, "title"),
    summary:           collect(arr, "summary"),
    whatDoesThisMean:  collect(arr, "whatDoesThisMean"),
    knownRootCause:    collect(arr, "knownRootCause"),
    latestUpdate:      collect(arr, "latestUpdate"),

    // Countries: we generally don't show GenAI Output rows under this field.
    // Keep the object present but empty "suggestion" so the UI can choose to hide.
    countriesImpacted: {
      result:   lastNonEmpty(arr, "knownCountriesResult")   || "",
      comment:  lastNonEmpty(arr, "knownCountriesComment")  || "",
      // You can make this [] to hide the carousel for countries.
      suggestion: [],
    },
  };

  return { initialValues, initialEval };
}




// Helpers to turn raw strings from history into dropdown values.
// Options are assumed like: [{ value: 'New', label: 'New' }, ...]

// single-select -> return the option.value (or "" if not found)
export const mapSingleToOptionValue = (raw, options = []) => {
  const s = (raw ?? "").toString().trim();
  if (!s) return "";
  const hit =
    options.find(o => o.value === s) ||
    options.find(o => o.label === s) ||
    options.find(o => o.label?.toLowerCase() === s.toLowerCase());
  return hit ? hit.value : "";
};

// multi-select -> return an array of option.value
export const mapMultiToOptionValues = (rawList = [], options = []) => {
  const list = Array.isArray(rawList) ? rawList : [rawList];
  const out = [];
  for (const raw of list) {
    const s = (raw ?? "").toString().trim();
    if (!s) continue;
    const hit =
      options.find(o => o.value === s) ||
      options.find(o => o.label === s) ||
      options.find(o => o.label?.toLowerCase() === s.toLowerCase());
    if (hit) out.push(hit.value);
  }
  // dedupe while preserving order
  return [...new Set(out)];
};




// In your form module
import { formatHistoryResults } from "../utils/formatHistoryResults";
import { mapMultiToOptionValues, mapSingleToOptionValue } from "../utils/mapToOptions";

// Suppose you already fetched the historical records array as `historyRows`
const { initialValues, initialEval } = formatHistoryResults(historyRows);

// Convert the text values into what your <Dropdown> expects
const hydratedInitialValues = React.useMemo(() => ({
  ...initialValues,
  countriesImpacted: mapMultiToOptionValues(initialValues.countriesImpacted, countriesOptions),
  status:            mapSingleToOptionValue(initialValues.status, statusOptions),
}), [initialValues, countriesOptions, statusOptions]);

// Then pass to Formik
<Formik
  initialValues={hydratedInitialValues}
  // ...
>
  {({ values, setFieldValue, /* ... */ }) => (
    <>
      {/* Countries multiselect */}
      <Dropdown
        multiple
        name="countriesImpacted"
        label="Known countries/entities impacted"
        value={values.countriesImpacted}
        options={countriesOptions}
        onChange={(v) => setFieldValue("countriesImpacted", v)}
        // readOnly={isReadOnly}
      />

      {/* Status single-select */}
      <Dropdown
        name="status"
        label="Status"
        value={values.status}
        options={statusOptions}
        onChange={(v) => setFieldValue("status", v || "")}
        // readOnly={isReadOnly}
      />

      {/* ...other fields... */}

      {/* EvalMessage components use `initialEval` */}
      {/* Example: */}
      {/* <EvalMessage latest={initialEval.whatDoesThisMean} onRetry={...} /> */}
    </>
  )}
</Formik>
