// services/im001.js
export const fetchReviewResultsByTaskId = async (taskId) => {
  const { data } = await axios.get(
    `${API_URL}/api/v1/im001/review-result/${taskId}`,
    { withCredentials: true }
  );
  return data; // just return what the API gives you
};

// utils/reviewResults.js
export const normalizeReviewResults = (data) => {
  const rows = Array.isArray(data) ? data : [data];
  // optional: newest last (or flip the comparator if you prefer newest first)
  rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return rows;
};

// where you use it (module/page)
import { fetchReviewResultsByTaskId } from "@/services/im001";
import { normalizeReviewResults } from "@/utils/reviewResults";
import { formatHistoryResults } from "@/modules/im001/formatters";

const data = await fetchReviewResultsByTaskId(taskId);
const rows = normalizeReviewResults(data);           // <- outside the async fetch
const { initialValues, initialEval } = formatHistoryResults(rows);

// services/im001.js
import { normalizeReviewResults } from "@/utils/reviewResults";

export const getReviewResultsByTaskId = async (taskId) => {
  const data = await fetchReviewResultsByTaskId(taskId);
  return normalizeReviewResults(data);
};
