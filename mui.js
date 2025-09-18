{
  field: "status",
  headerName: "Status",
  flex: 0.25,
  sortable: false,
  filterOperators,
  valueGetter: (params) => {
    const r = params.row || {};
    const paused = !!(r.isPaused ?? r.taskStatus?.isPaused ?? r.status?.isPaused);
    if (paused) return "Paused";
    return r.status ?? r.taskStatus?.status ?? r.task_state ?? params.value ?? "";
  },
  renderCell: (params) => {
    const r = params.row || {};
    const paused = !!(r.isPaused ?? r.taskStatus?.isPaused ?? r.status?.isPaused);
    if (paused && typeof props.onResumeTask === "function") {
      return (
        <Tooltip title="Click to resume">
          <Button
            size="small"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();      // don’t select the row
              props.onResumeTask(r);    // delegate to screen
            }}
          >
            Paused
          </Button>
        </Tooltip>
      );
    }
    const txt = r.status ?? r.taskStatus?.status ?? r.task_state ?? params.value ?? "";
    return <span>{txt}</span>;
  },
}


--

  import { resumeTaskStatus } from "@/api/taskStatus";

const getRowTaskId = (row) => row?.taskId ?? row?.id ?? row?.task_id;

const handleResumeIM003 = async (row) => {
  try {
    showLoading();
    const id = getRowTaskId(row);
    await resumeTaskStatus(id, "IM003");
    emailAlert({ type: "success", message: "Task resumed." });

    if (selectedTask?.taskId && id === selectedTask.taskId) {
      const fresh = await getTaskStatus(id);   // your existing fn
      if (fresh) updatedTaskData(fresh);       // your existing setter
    }

    setPaginationModel((pm) => ({ ...pm }));   // refetch current page
  } catch (e) {
    emailAlert({ type: "error", message: "Failed to resume task: " + e.message });
  } finally {
    hideLoading();
  }
};


--

  <TaskTable
  data={data.rows}
  rowCount={data.rowCount}
  paginationModel={data.paginationModel}
  onPaginationModelChange={data.setPaginationModel}
  apiRef={taskDataGridApiRef}
  onRowClick={handleRowClick}
  jobIdPrefix="IM"
  showCautionCount={false}
  requestTypeHeader="Incident Requests"
  filterModel={filterModelIR}
  onFilterModelChange={onFilterModelIR}
  sortModel={sortModelIR}
  setSortModel={setSortModelIR}
  onResumeTask={handleResumeIM003}
/>


--

    import { resumeTaskStatus } from "@/api/taskStatus";

const getRowTaskId = (row) => row?.taskId ?? row?.id ?? row?.task_id;

const handleResumeCE001 = async (row) => {
  try {
    showLoading();
    const id = getRowTaskId(row);
    await resumeTaskStatus(id, "CE001");
    emailAlert({ type: "success", message: "Task resumed." });

    if (selectedTask?.taskId && id === selectedTask.taskId) {
      const fresh = await getTaskStatus(id);
      if (fresh) updatedTaskData(fresh);
    }

    setPaginationModel((pm) => ({ ...pm }));
  } catch (e) {
    emailAlert({ type: "error", message: "Failed to resume task: " + e.message });
  } finally {
    hideLoading();
  }
};


--

  


--
const handleResumeIM003 = async (row) => {
  try {
    showLoading();
    const id = row?.taskId ?? row?.id ?? row?.task_id;
    await resumeTaskStatus(id, "IM003");
    emailAlert({ type: "success", message: "Task resumed." });

    if (selectedTask?.taskId && id === selectedTask.taskId) {
      const fresh = await getTaskStatus(id);
      if (fresh) updatedTaskData(fresh);
    }
    setPaginationModel((pm) => ({ ...pm }));
  } catch (e) {
    emailAlert({ type: "error", message: "Failed to resume task: " + (extractApiError ? extractApiError(e) : e.message) });
  } finally {
    hideLoading();
  }
};
