const toLocalDateTime = (raw) => {
  if (!raw) return '-';
  const s = String(raw);

  // Try native parse first
  let d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString('en-GB', dateFormatOptionsWithSeconds);
  }

  // Fallback: old API strings without timezone / seconds
  // Keep minutes only and add Z so Date parses as UTC
  const withZ = `${s.replace(' ', 'T').slice(0, 16)}Z`;
  d = new Date(withZ);
  return Number.isNaN(d.getTime())
    ? s
    : d.toLocaleString('en-GB', dateFormatOptionsWithSeconds);
};

{
  field: 'submittedTime',
  headerName: 'Submitted Time',
  flex: 0.5,
  // Make sure the grid has a value even if the backend key changed
  valueGetter: ({ row }) =>
    row.submittedTime ?? row.submitted_time ?? row.timestamp ?? null,
  renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
  filterable: false,
}

{
  field: 'completedTime',
  headerName: 'Completed Time',
  flex: 0.5,
  valueGetter: ({ row }) =>
    row.completedTime ?? row.completed_time ?? row.completedTimestamp ?? null,
  renderCell: (params) => <span>{toLocalDateTime(params.value)}</span>,
  filterable: false,
}
