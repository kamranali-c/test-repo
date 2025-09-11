
export const EVALUATED_COLUMNS = [
  "shortDescriptionResult",
  "descriptionResult",
  "businessImpactResult",
  "findingsResult",
];

export const COLUMNS = (params) => [
  { field: "number", headerName: "Number", width: 150 },

  {
    field: "overallResult",
    headerName: "Overall Result",
    width: 125,
    cellClassName: (params) => getCommonClassName(params),
    sortable: false,
  },
  {
    field: "failPercentage",
    headerName: "% Fail",
    width: 80,
    align: "center",
    headerAlign: "center",
    filterable: false,
    sortable: false,
  },

  // ───── Short Description block ──────────────────────────────────────────────
  {
    field: "shortDescriptionResult",
    headerName: "Short Description Result",
    width: 200,
    description: `Guideline version: ${params.shortDescription || "N/A"}`,
    cellClassName: (params) => getCommonClassName(params),
    renderCell: (params) => (
      <Tooltip title={(params?.row?.shortDescriptionComment) } placement="bottom-start" arrow>
        <span>{params?.row?.shortDescriptionResult}</span>
      </Tooltip>
    ),
    sortable: false,
  },
  {
    field: "shortDescriptionComment",
    headerName: "Short Description Comment",
    width: 200,
    filterable: false,
    sortable: false,
  },
  {
    field: "shortDescriptionSuggestion",
    headerName: "Short Description Suggestion",
    width: 260,
    // hidden by default (we’ll also enforce via columnVisibilityModel)
    hide: true,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params?.row?.shortDescriptionSuggestion || ""} placement="bottom-start" arrow>
        <span>{params?.row?.shortDescriptionSuggestion}</span>
      </Tooltip>
    ),
  },

  // ───── Description block ───────────────────────────────────────────────────
  {
    field: "descriptionResult",
    headerName: "Description Result",
    width: 150,
    description: `Guideline version: ${params.description || "N/A"}`,
    cellClassName: (params) => getCommonClassName(params),
    renderCell: (params) => (
      <Tooltip title={(params?.row?.descriptionComment)} placement="bottom-start" arrow>
        <span>{params?.row?.descriptionResult}</span>
      </Tooltip>
    ),
    sortable: false,
  },
  {
    field: "descriptionComment",
    headerName: "Description Comment",
    width: 200,
    filterable: false,
    sortable: false,
  },
  {
    field: "descriptionSuggestion",
    headerName: "Description Suggestion",
    width: 260,
    hide: true,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params?.row?.descriptionSuggestion || ""} placement="bottom-start" arrow>
        <span>{params?.row?.descriptionSuggestion}</span>
      </Tooltip>
    ),
  },

  // ───── Business Impact block ────────────────────────────────────────────────
  {
    field: "businessImpactResult",
    headerName: "Business Impact Result",
    width: 175,
    description: `Guideline version: ${params?.businessImpact || "N/A"}`,
    cellClassName: (params) => getCommonClassName(params),
    renderCell: (params) => (
      <Tooltip title={(params?.row?.businessImpactComment)} placement="bottom-start" arrow>
        <span>{params?.row?.businessImpactResult}</span>
      </Tooltip>
    ),
    sortable: false,
  },
  {
    field: "businessImpactComment",
    headerName: "Business Impact Comment",
    width: 300,
    filterable: false,
    sortable: false,
  },
  {
    field: "businessImpactSuggestion",
    headerName: "Business Impact Suggestion",
    width: 260,
    hide: true,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params?.row?.businessImpactSuggestion || ""} placement="bottom-start" arrow>
        <span>{params?.row?.businessImpactSuggestion}</span>
      </Tooltip>
    ),
  },

  // ───── Findings block ──────────────────────────────────────────────────────
  {
    field: "findingsResult",
    headerName: "Findings Result",
    width: 150,
    description: `Guideline version: ${params?.findings || "N/A"}`,
    cellClassName: (params) => getCommonClassName(params),
    renderCell: (params) => (
      <Tooltip title={(params?.row?.findingsComment)} placement="bottom-start" arrow>
        <span>{params?.row?.findingsResult}</span>
      </Tooltip>
    ),
    sortable: false,
  },
  {
    field: "findingsComment",
    headerName: "Findings Comment",
    width: 300,
    filterable: false,
    sortable: false,
  },
  {
    field: "findingsSuggestion",
    headerName: "Findings Suggestion",
    width: 260,
    hide: true,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params?.row?.findingsSuggestion || ""} placement="bottom-start" arrow>
        <span>{params?.row?.findingsSuggestion}</span>
      </Tooltip>
    ),
  },

  // ───── Keep your remaining columns (e.g., errors) as they are ──────────────
  {
    field: "errors",
    headerName: "Errors",
    width: 200,
    cellClassName: (params) => getAlteredClassName(params),
    sortable: false,
  },
];


const [columnVisibilityModel, setColumnVisibilityModel] = useState({
  // …your existing keys
  shortDescriptionSuggestion: false,
  descriptionSuggestion: false,
  businessImpactSuggestion: false,
  findingsSuggestion: false,
});


<ResultTable
  rows={rows}
  rowCount={rowCount}
  columns={COLUMNS(params)}   // or memoized
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  isLoading={isLoading}
  filterModel={filterModel}
  setFilterModel={setFilterModel}
  onFilterModelChange={onFilterModelChange}
  setSortModel={setSortModel}
  evaluatedColumns={EVALUATED_COLUMNS}
  setColumnVisibilityModel={setColumnVisibilityModel}
  columnVisibilityModel={columnVisibilityModel}
/>
