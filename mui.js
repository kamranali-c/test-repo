// Turn on via any of:
// 1) URL:        ?simulatePaused=1
// 2) localStorage.setItem('simulatePaused', '1')
// 3) .env:       VITE_SIMULATE_PAUSED=true
export function simulatePausedEnabled() {
  try {
    if (import.meta?.env?.VITE_SIMULATE_PAUSED === "true") return true;
  } catch {}
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("simulatePaused") === "1") return true;
  } catch {}
  try {
    if (typeof localStorage !== "undefined" && localStorage.getItem("simulatePaused") === "1") {
      return true;
    }
  } catch {}
  return false;
}

// Apply to a list response (e.g., getTasksByUserId)
export function simulatePauseOnRows(rows) {
  if (!simulatePausedEnabled() || !Array.isArray(rows)) return rows;
  // mark the first Processing item (or the first row) as paused for visibility
  let marked = false;
  return rows.map((r, idx) => {
    if (!marked && (r?.status === "Processing" || idx === 0)) {
      marked = true;
      return { ...r, isPaused: true };
    }
    return r;
  });
}

// Apply to a single status object (e.g., getTaskStatusByTaskId)
export function simulatePauseOnStatus(statusObj) {
  if (!simulatePausedEnabled() || !statusObj) return statusObj;
  return { ...statusObj, isPaused: true };
}


----

  const fetchIncidentRequests = useCallback(
  async (paginationModel, filterColumn, sortModel) => {
    const result = await getTasksByUserId(
      buildFilterPayload(paginationModel, filterColumn, sortModel, dateRange),
      isUserTasks ? "all-tasks" : "current-user-tasks"
    );

    const rows = simulatePauseOnRows(result.data ?? []);
    return {
      rows,
      metadata: result.metadata ?? {},
    };
  },
  [isUserTasks, dateRange]
);
