// src/modules/im001/pages/HistoricalSubmissions.js
import React from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useServerSidePagination from "../../../hooks/useServerSidePagination";
import { hasAdminRole } from "../../../configurations/RBAC";
import useAuth from "../../../hooks/useAuth";
import { getIncidentReviewResults } from "../../../services/api";

// grid→API sort field map (Title is intentionally not sortable)
const SORT_FIELD_MAP = {
  incidentNumber: "incidentNumber",
  userId: "userId",
  status: "status",
  timestamp: "timestamp",
};

const COLUMNS = [
  { field: "incidentNumber", headerName: "Incident ID", flex: 1, minWidth: 150 },
  { field: "userId", headerName: "User ID", flex: 1, minWidth: 140 },
  { field: "title", headerName: "Title", flex: 1.6, minWidth: 220, sortable: false },
  { field: "status", headerName: "Status", flex: 0.8, minWidth: 120 },
  {
    field: "timestamp",
    headerName: "Submission Time",
    flex: 1,
    minWidth: 190,
    valueFormatter: (v) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : ""),
  },
];

export default function HistoricalSubmissions() {
  // RBAC
  const { roles = [] } = useAuth() || {};
  const isAdmin = hasAdminRole(roles);
  const [viewAll, setViewAll] = React.useState(false);

  // Top-of-table filter UI (we’ll push this into the hook’s debounced filter)
  const [uiFilterColumn, setUiFilterColumn] = React.useState("incidentNumber");
  const [uiFilterValue, setUiFilterValue] = React.useState("");

  // Date range (we’ll pass through the hook dependency list)
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  // Details (row click)
  const [selectedRow, setSelectedRow] = React.useState(null);

  // ---- Server-side pagination hook (shared debounce inside) ----
  const {
    rows,
    rowCount,
    isLoading,
    error,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    onFilterModelChange, // debounced in the hook
    sortModel,
    setSortModel,
  } = useServerSidePagination(
    // fetcher the hook calls with (paginationModel, filterColumn, sortModel)
    React.useCallback(
      async (pModel, filterColumn, sModel) => {
        // sort_by
        let sort_by;
        if (sModel?.length) {
          const { field, sort } = sModel[0] || {};
          const apiField = SORT_FIELD_MAP[field];
          if (apiField && sort) sort_by = `${apiField}:${sort}`;
        }

        // filter_by  =>   column:contains:value
        let filter_by;
        if (filterColumn?.columnField && filterColumn?.value) {
          filter_by = `${filterColumn.columnField}:contains:${filterColumn.value}`;
        }

        // date_range  =>  YYYY-MM-DD:YYYY-MM-DD
        let date_range;
        if (startDate || endDate) {
          const from = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
          const to = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
          date_range = `${from}:${to}`;
        }

        const view = isAdmin && viewAll ? "all-results" : "current-user-results";

        const res = await getIncidentReviewResults({
          page: (pModel?.page ?? 0) + 1, // API is 1-based
          pageSize: pModel?.pageSize ?? 10,
          filterBy: filter_by,
          sortBy: sort_by,
          dateRange: date_range,
          view,
        });

        // The hook expects { rows, metadata } back
        return {
          rows:
            (res?.data || []).map((r) => ({
              id: r.id,
              incidentNumber: r.incidentNumber,
              userId: r.userId,
              title: r.title,
              status: r.status,
              timestamp: r.timestamp,
              _raw: r,
            })) ?? [],
          metadata: res?.metadata ?? {},
        };
      },
      [startDate, endDate, isAdmin, viewAll]
    ),
    // dependencies — when any changes, the hook re-fetches
    [startDate, endDate, isAdmin, viewAll],
    // initial pagination model (optional)
    { page: 0, pageSize: 10 }
  );

  // Wire our simple UI filters into the hook’s debounced filter handler
  React.useEffect(() => {
    const next = {
      items: [
        {
          id: 1,
          field: uiFilterColumn,
          operator: "contains",
          value: uiFilterValue,
        },
      ],
    };
    // keep local model (so DataGrid has controlled model even if hidden)
    setFilterModel(next);
    // trigger the hook’s internal debounced translator (sets filterColumn after delay)
    onFilterModelChange(next);
  }, [uiFilterColumn, uiFilterValue, setFilterModel, onFilterModelChange]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Historical Submissions
        </Typography>

        {isAdmin && (
          <FormControlLabel
            control={
              <Switch
                checked={viewAll}
                onChange={(e) => {
                  setPaginationModel((pm) => ({ ...pm, page: 0 }));
                  setViewAll(e.target.checked);
                }}
              />
            }
            label="Show all results"
          />
        )}
      </Box>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={3} md={2.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter Column"
            value={uiFilterColumn}
            onChange={(e) => {
              setPaginationModel((pm) => ({ ...pm, page: 0 }));
              setUiFilterColumn(e.target.value);
            }}
          >
            <MenuItem value="incidentNumber">Incident ID</MenuItem>
            <MenuItem value="userId">User ID</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Contains..."
            value={uiFilterValue}
            onChange={(e) => {
              setPaginationModel((pm) => ({ ...pm, page: 0 }));
              setUiFilterValue(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={5.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap={2}>
              <DatePicker
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                label="Submission Start"
                value={startDate}
                onChange={(v) => {
                  setPaginationModel((pm) => ({ ...pm, page: 0 }));
                  setStartDate(v);
                  if (endDate && v && dayjs(endDate).isBefore(v, "day")) setEndDate(null);
                }}
                maxDate={endDate || undefined}
              />
              <DatePicker
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                label="Submission End"
                value={endDate}
                onChange={(v) => {
                  setPaginationModel((pm) => ({ ...pm, page: 0 }));
                  setEndDate(v);
                }}
                minDate={startDate || undefined}
              />
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Single table */}
      <div style={{ height: 560, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={COLUMNS}
          loading={isLoading}
          rowCount={rowCount}
          paginationMode="server"
          sortingMode="server"
          // pagination
          pageSizeOptions={[10, 20, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          // sorting
          sortModel={sortModel}
          onSortModelChange={(m) => {
            // Title not sortable; DataGrid won't send it, but guard anyway
            if (m?.[0]?.field === "title") return;
            setPaginationModel((pm) => ({ ...pm, page: 0 }));
            setSortModel(m);
          }}
          // selection
          onRowClick={(params) => setSelectedRow(params.row?._raw || params.row)}
          disableRowSelectionOnClick
          getRowId={(r) => r.id}
        />
      </div>

      {/* Details placeholder (to be implemented later) */}
      {selectedRow && (
        <Box mt={3} p={2} sx={{ border: "1px solid rgba(0,0,0,.12)", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Submission Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Details panel pending.) Selected Incident ID:&nbsp;
            <strong>{selectedRow.incidentNumber}</strong>
          </Typography>
        </Box>
      )}
    </Container>
  );
}
