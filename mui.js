// Adjust this import to your project’s HTTP client
import { apiClient } from "./client";

/**
 * GET /api/v1/{ns}/taskStatus/resume?taskId=...
 * ns: "im003" | "ce001" (or "im001" if applicable)
 */
export const resumeTaskStatus = async ({ taskId, taskType }) => {
  const ns = String(taskType).toLowerCase(); // "im003" | "ce001" | "im001"
  return apiClient.get(`/api/v1/${ns}/taskStatus/resume`, { params: { taskId } });
};

import React from "react";
import { Tooltip, Button } from "@mui/material";
import { resumeTaskStatus } from "@/api/taskStatus";

/**
 * Enhance a COLUMNS array so the "status" column:
 *  - shows "Paused" when isPaused is true
 *  - displays tooltip "Click to resume"
 *  - resumes on click, then refreshes the page + selected row
 *
 * deps = {
 *   taskType: "IM003" | "CE001" | "IM001",
 *   showLoading, hideLoading, emailAlert,
 *   setPaginationModel,                 // from useServerSidePagination
 *   selectedTask,                       // current selected task (optional)
 *   getTaskStatus,                      // (taskId) => Promise<taskStatus>
 *   updatedTaskData                     // (taskStatus) => void
 * }
 */
export function withPauseResumeStatusColumn(COLUMNS, deps) {
  const {
    taskType,
    showLoading, hideLoading, emailAlert,
    setPaginationModel,
    selectedTask, getTaskStatus, updatedTaskData,
  } = deps;

  const isRowPaused = (row) =>
    !!(row?.isPaused ?? row?.taskStatus?.isPaused ?? row?.status?.isPaused);

  const getDisplayStatus = (row) => {
    if (isRowPaused(row)) return "Paused";
    return row?.status ?? row?.taskStatus?.status ?? row?.task_state ?? "";
  };

  const getRowTaskId = (row) => row?.taskId ?? row?.id ?? row?.task_id;

  const handleResumeTask = async (row) => {
    try {
      showLoading();
      const taskId = getRowTaskId(row);
      await resumeTaskStatus({ taskId, taskType });
      emailAlert({ type: "success", message: "Task resumed." });

      // Refresh selected row immediately if it’s the one we resumed
      if (selectedTask?.taskId && taskId === selectedTask.taskId && getTaskStatus && updatedTaskData) {
        const fresh = await getTaskStatus(taskId);
        if (fresh) updatedTaskData(fresh);
      }

      // Nudge server-side pagination to refetch current page
      setPaginationModel((pm) => ({ ...pm }));
    } catch (err) {
      emailAlert({ type: "error", message: "Failed to resume task: " + (err?.message || err) });
    } finally {
      hideLoading();
    }
  };

  return COLUMNS.map((col) => {
    if (col.field !== "status") return col;

    return {
      ...col,
      // ensure filtering/sorting sees the derived status
      valueGetter: (params) => getDisplayStatus(params.row),
      renderCell: (params) => {
        const text = getDisplayStatus(params.row);
        if (text === "Paused") {
          return (
            <Tooltip title="Click to resume">
              <Button
                size="small"
                variant="text"
                onClick={(e) => {
                  e.stopPropagation(); // don’t trigger row selection
                  handleResumeTask(params.row);
                }}
              >
                Paused
              </Button>
            </Tooltip>
          );
        }
        return <span>{text || params.value}</span>;
      },
    };
  });
}


const columnsWithPauseResume = React.useMemo(
  () =>
    withPauseResumeStatusColumn(COLUMNS, {
      taskType: "IM003",
      showLoading,
      hideLoading,
      emailAlert,
      setPaginationModel,
      selectedTask,
      getTaskStatus,   // your function defined in the file
      updatedTaskData, // sets selectedTask
    }),
  [
    COLUMNS,
    showLoading,
    hideLoading,
    emailAlert,
    setPaginationModel,
    selectedTask,
    getTaskStatus,
    updatedTaskData,
  ]
);


<TaskTable
  data={data.rows}
  rowCount={data.rowCount}
  columns={columnsWithPauseResume}   // 👈 swap from COLUMNS
  paginationModel={data.paginationModel}
  onPaginationModelChange={data.setPaginationModel}
  gridRef={taskDataGridApiRef}
  onRowClick={handleRowClick}
  jobIdPrefix="IM"
  showCautionCount={false}
  requestTypeHeader="Incident Requests"
  filterModel={filterModelIR}
  onFilterModelChange={onFilterModelIR}
  sortModel={sortModelIR}
  setSortModel={setSortModelIR}
/>


    const columnsWithPauseResume = React.useMemo(
  () =>
    withPauseResumeStatusColumn(COLUMNS, {
      taskType: "CE001",
      showLoading,
      hideLoading,
      emailAlert,
      setPaginationModel,
      selectedTask,
      getTaskStatus,
      updatedTaskData,
    }),
  [/* same deps */]
);
