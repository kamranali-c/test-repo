// TaskTable.jsx
import React, { useMemo } from "react";
// ...other imports

export default function TaskTable(props) {
  const data = props.data;
  const filterOperators = getGridStringOperators()
    ?.filter(({ value }) => ["contains"].includes(value));

  // ---- DEFAULT columns the table can fall back to ----
  const defaultColumns = useMemo(() => ([
    // your other columns …

    // Submitted time
    {
      field: "submittedTime",
      headerName: "Submitted Time",
      flex: 0.5,
      valueGetter: ({ row } = {}) =>
        row?.submittedTime ?? row?.submitted_time ?? row?.timestamp ?? null,
      renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
      filterable: false,
    },

    // Completed time
    {
      field: "completedTime",
      headerName: "Completed Time",
      flex: 0.5,
      valueGetter: ({ row } = {}) =>
        row?.completedTime ?? row?.completed_time ?? row?.completedTimestamp ?? null,
      renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
      filterable: false,
    },
  ]), [/* deps for any local columns, e.g. filterOperators if used */]);

  // ---- RESOLVED columns: use the ones provided by the caller if present ----
  const resolvedColumns =
    Array.isArray(props.columns) && props.columns.length
      ? props.columns
      : defaultColumns;

  const handleFilterChange = (filterModel) => {
    props.onFilterModelChange?.(filterModel);
  };

  return (
    <Box className="hi" sx={{ width: "100%" }}>
      <DataGrid
        data-testid="data-grid"
        apiRef={props.apiRef}
        rows={data}
        columns={resolvedColumns}         {/* <— use resolvedColumns */}
        filterMode="server"
        paginationMode="server"
        rowCount={props.rowCount}
        onPaginationModelChange={props.onPaginationModelChange}
        pageSizeOptions={[props.paginationModel?.pageSize || 5]}
        onFilterModelChange={handleFilterChange}
        onSortModelChange={(model) => props.setSortModel(model)}
        sortingMode="server"
        getRowId={(row) => row.taskId}
        onRowClick={(row) => props.onRowClick?.(row)}
      />
    </Box>
  );
}
