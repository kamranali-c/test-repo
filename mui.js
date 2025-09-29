// inside your component file

// 1) Click handler — no blobs, no header parsing.
//    Browser will use server's Content-Disposition filename.
const handleExportIM001 = () => {
  const taskId =
    incidentReviewResponse?.taskId ||
    values?.task_id ||
    values?.taskId ||
    values?.id;

  if (!taskId) {
    alert("Missing taskId");
    return;
  }

  // Use relative path if the app is same-origin/cookie-based auth.
  // If you already use API_URL elsewhere, swap it in.
  const url = `/api/v1/im001/review-results/export/${taskId}`;

  // Let the browser navigate and download using server-provided filename.
  // (_self keeps you in the same tab; change to _blank if you prefer a new tab)
  window.open(url, "_self");
};

// 2) Simple button — only usable when readonly.
<button
  type="button"
  onClick={handleExportIM001}
  disabled={!readonly}
  className="btn btn-primary" // or whatever class your app uses
>
  Export .xlsx
</button>
