// util — safe formatter
const toLocalDateTime = (v) => {
  if (!v) return "";
  // backend sometimes sends ISO string; sometimes Date/number
  const iso = typeof v === "string" ? v.slice(0, 16) : v;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-GB", { hour12: false });
};

// Submitted Time
{
  field: "submittedTime",
  headerName: "Submitted Time",
  flex: 0.5,
  // SAFER: don't destructure params; guard for undefined
  valueGetter: (params = {}) => {
    const r = params.row ?? {};
    // support old/new backend field names
    return r.submittedTime ?? r.submitted_time ?? r.timestamp ?? null;
  },
  renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
  filterable: false,
},

// Completed Time
{
  field: "completedTime",
  headerName: "Completed Time",
  flex: 0.5,
  valueGetter: (params = {}) => {
    const r = params.row ?? {};
    return (
      r.completedTime ??
      r.completed_time ??
      r.completedTimestamp ??
      null
    );
  },
  renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
  filterable: false,
}
