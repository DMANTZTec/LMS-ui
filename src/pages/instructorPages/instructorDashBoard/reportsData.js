// Dummy data for the Student Reports section.
// Replace with the backend API once a student-reports endpoint is available.

export const REPORT_STATUS = {
  AT_RISK: "AT_RISK",
  WATCH: "WATCH",
  ON_TRACK: "ON_TRACK",
};

export const REPORT_STATUS_TABS = [
  { value: "all", label: "All" },
  { value: REPORT_STATUS.ON_TRACK, label: "On track" },
  { value: REPORT_STATUS.WATCH, label: "Watch" },
  { value: REPORT_STATUS.AT_RISK, label: "At risk" },
];

export const REPORT_STATUS_LABELS = {
  [REPORT_STATUS.AT_RISK]: "At risk",
  [REPORT_STATUS.WATCH]: "Watch",
  [REPORT_STATUS.ON_TRACK]: "On track",
};

export const REPORT_STATUS_STYLES = {
  [REPORT_STATUS.AT_RISK]: "bg-rose-100 text-rose-600 border-0",
  [REPORT_STATUS.WATCH]: "bg-amber-100 text-amber-700 border-0",
  [REPORT_STATUS.ON_TRACK]: "bg-emerald-100 text-emerald-700 border-0",
};

export const REPORT_PROGRESS_STYLES = {
  [REPORT_STATUS.AT_RISK]: "bg-rose-500",
  [REPORT_STATUS.WATCH]: "bg-amber-500",
  [REPORT_STATUS.ON_TRACK]: "bg-blue-600",
};

export const REPORT_ATTENTION_STYLES = {
  [REPORT_STATUS.AT_RISK]: {
    card: "bg-rose-50",
    avatar: "bg-rose-100 text-rose-600",
    note: "text-rose-600",
    dot: "bg-rose-500",
  },
  [REPORT_STATUS.WATCH]: {
    card: "bg-amber-50",
    avatar: "bg-amber-100 text-amber-700",
    note: "text-amber-700",
    dot: "bg-amber-500",
  },
};

// Sort order used for "Sorted by status".
export const REPORT_STATUS_ORDER = {
  [REPORT_STATUS.AT_RISK]: 0,
  [REPORT_STATUS.WATCH]: 1,
  [REPORT_STATUS.ON_TRACK]: 2,
};

export const REPORT_PERIODS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export const REPORT_PAGE_SIZE = 8;

export const SCORE_BUCKETS = [
  { label: "0–40", min: 0, max: 40, color: "bg-rose-200" },
  { label: "41–60", min: 41, max: 60, color: "bg-amber-200" },
  { label: "61–80", min: 61, max: 80, color: "bg-blue-300" },
  { label: "81–100", min: 81, max: 100, color: "bg-blue-600" },
];

// Previous-period average score per batch, used for the "Up x% from last month" hint.
export const PREVIOUS_AVG_SCORE = {
  "React batch A": 67,
  "React batch B": 70,
};

// Mock of the `criteria` JSON column saved with each task review.
const EVALUATION_CRITERIA = [
  ["Task Completion", 0.3],
  ["Technical Correctness", 0.1],
  ["Code Quality", -0.3],
  ["Problem Solving", 0.2],
  ["Understanding", -0.1],
];

const mockCriteria = (id, avgScore) => {
  if (avgScore == null) return null;
  const seed = Number(id.slice(-1)) || 0;
  return EVALUATION_CRITERIA.map(([criterion, offset], i) => ({
    criterion,
    rating: Math.min(5, Math.max(1, Math.round((avgScore / 20 + offset + (((seed + i) % 3) - 1) * 0.2) * 10) / 10)),
  }));
};

const s = (
  id,
  name,
  batch,
  course,
  progress,
  tasksDone,
  tasksTotal,
  avgScore,
  attendance,
  lastActiveDays,
  joinedDaysAgo,
  status,
  attentionNote = null
) => ({
  id,
  name,
  batch,
  course,
  progress,
  tasksDone,
  tasksTotal,
  avgScore,
  attendance,
  lastActiveDays,
  joinedDaysAgo,
  status,
  attentionNote,
  criteria: mockCriteria(id, avgScore),
});

const { AT_RISK, WATCH, ON_TRACK } = REPORT_STATUS;
const RF = "React Fundamentals";
const AR = "Advanced React";

export const REPORT_STUDENTS = [
  s("STU-1001", "Arjun Kumar", "React batch A", RF, 25, 0, 4, null, 40, 9, 70, AT_RISK, "4 tasks overdue · inactive 9 days"),
  s("STU-1002", "Sneha Rao", "React batch A", RF, 50, 2, 4, 61, 68, 1, 70, WATCH, "Score dropped from 74% to 61%"),
  s("STU-1003", "Kiran Patel", "React batch A", RF, 55, 3, 4, 64, 75, 2, 70, WATCH, "2 tasks submitted late"),
  s("STU-1004", "Shashikanth Reddy", "React batch A", RF, 75, 4, 4, 82, 90, 0, 70, ON_TRACK),
  s("STU-1005", "Divya Menon", "React batch A", RF, 83, 4, 4, 88, 95, 0, 70, ON_TRACK),
  s("STU-1006", "Rahul Verma", "React batch A", RF, 67, 4, 4, 76, 85, 0, 70, ON_TRACK),
  s("STU-1007", "Priya Nair", "React batch A", RF, 92, 4, 4, 91, 100, 0, 70, ON_TRACK),
  s("STU-1008", "Mohammed Irfan", "React batch A", RF, 58, 3, 4, 72, 80, 3, 70, ON_TRACK),
  s("STU-1009", "Ananya Iyer", "React batch A", RF, 64, 4, 4, 74, 88, 1, 70, ON_TRACK),
  s("STU-1010", "Vikram Singh", "React batch A", RF, 48, 3, 4, 58, 82, 2, 70, ON_TRACK),
  s("STU-1011", "Meera Pillai", "React batch A", RF, 71, 4, 4, 79, 92, 0, 70, ON_TRACK),
  s("STU-1012", "Rohan Das", "React batch A", RF, 39, 2, 4, 38, 78, 1, 60, ON_TRACK),
  s("STU-1013", "Kavya Reddy", "React batch A", RF, 80, 4, 4, 86, 94, 0, 70, ON_TRACK),
  s("STU-1014", "Aditya Sharma", "React batch A", RF, 60, 3, 4, 68, 84, 1, 70, ON_TRACK),
  s("STU-1015", "Neha Gupta", "React batch A", RF, 52, 3, 4, 55, 81, 2, 60, ON_TRACK),
  s("STU-1016", "Arvind Rao", "React batch A", RF, 66, 4, 4, 71, 86, 0, 70, ON_TRACK),
  s("STU-1017", "Pooja Menon", "React batch A", RF, 88, 4, 4, 93, 98, 0, 70, ON_TRACK),
  s("STU-1018", "Sanjay Kulkarni", "React batch A", RF, 45, 3, 4, 36, 80, 3, 60, ON_TRACK),
  s("STU-1019", "Lakshmi Narayan", "React batch A", RF, 62, 3, 4, 70, 83, 1, 70, ON_TRACK),
  s("STU-1020", "Farhan Ali", "React batch A", RF, 50, 3, 4, 59, 79, 2, 70, ON_TRACK),
  s("STU-1021", "Deepa Joshi", "React batch A", RF, 69, 4, 4, 77, 90, 0, 70, ON_TRACK),
  s("STU-1022", "Nikhil Bhat", "React batch A", RF, 73, 4, 4, 80, 87, 0, 70, ON_TRACK),
  s("STU-1023", "Isha Kapoor", "React batch A", RF, 30, 1, 4, 66, 76, 1, 12, ON_TRACK),
  s("STU-1024", "Varun Nair", "React batch A", RF, 28, 1, 4, 69, 80, 0, 8, ON_TRACK),

  s("STU-2001", "Harsha Vardhan", "React batch B", AR, 20, 1, 6, 42, 52, 6, 80, AT_RISK, "Missed 3 classes in a row"),
  s("STU-2002", "Swathi Krishnan", "React batch B", AR, 47, 3, 6, 63, 70, 2, 80, WATCH, "1 task overdue"),
  s("STU-2003", "Gautam Shetty", "React batch B", AR, 78, 5, 6, 84, 92, 0, 80, ON_TRACK),
  s("STU-2004", "Ritika Bose", "React batch B", AR, 85, 6, 6, 89, 96, 0, 80, ON_TRACK),
  s("STU-2005", "Manoj Hegde", "React batch B", AR, 62, 4, 6, 73, 85, 1, 80, ON_TRACK),
  s("STU-2006", "Tanvi Desai", "React batch B", AR, 70, 5, 6, 78, 88, 0, 20, ON_TRACK),
  s("STU-2007", "Karthik Raman", "React batch B", AR, 56, 4, 6, 67, 81, 1, 80, ON_TRACK),
  s("STU-2008", "Aisha Khan", "React batch B", AR, 90, 6, 6, 94, 99, 0, 80, ON_TRACK),
];

export const REPORT_BATCHES = [...new Set(REPORT_STUDENTS.map((st) => st.batch))];

export const getBatchCourses = (batch) => [
  ...new Set(REPORT_STUDENTS.filter((st) => st.batch === batch).map((st) => st.course)),
];

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const formatLastActive = (days) => {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};
