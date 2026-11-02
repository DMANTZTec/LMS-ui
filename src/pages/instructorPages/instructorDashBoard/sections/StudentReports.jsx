import { useState } from "react";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { Download, Search, Send, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DEFAULT_STUDENT_REPORT_FILTERS,
  studentReportsFiltersAtom,
  studentReportsSelectedIdAtom,
} from "@/store/atoms/studentReportsAtoms";
import {
  PREVIOUS_AVG_SCORE,
  REPORT_ATTENTION_STYLES,
  REPORT_BATCHES,
  REPORT_PAGE_SIZE,
  REPORT_PERIODS,
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_ORDER,
  REPORT_STATUS_TABS,
  REPORT_STUDENTS,
  SCORE_BUCKETS,
  formatLastActive,
  getBatchCourses,
  getInitials,
} from "../reportsData";
import {
  ProgressBar,
  StatusBadge,
  StudentReportCard,
  StudentReportTableRow,
} from "../components/StudentReportRow";

const average = (values) =>
  values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0;

const TABLE_COLUMNS = [
  { label: "Student", className: "pl-5 pr-3" },
  { label: "Course progress", className: "px-3" },
  { label: "Tasks", className: "px-3" },
  { label: "Avg score", className: "px-3" },
  { label: "Attendance", className: "px-3" },
  { label: "Last active", className: "px-3" },
  { label: "Status", className: "px-3" },
  { label: "", className: "pr-4" },
];

function downloadCsv(rows, filename) {
  const header = [
    "Student ID",
    "Name",
    "Batch",
    "Course",
    "Progress %",
    "Tasks",
    "Avg score %",
    "Attendance %",
    "Last active",
    "Status",
  ];
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [
    header,
    ...rows.map((st) => [
      st.id,
      st.name,
      st.batch,
      st.course,
      st.progress,
      `${st.tasksDone}/${st.tasksTotal}`,
      st.avgScore ?? "",
      st.attendance,
      formatLastActive(st.lastActiveDays),
      REPORT_STATUS_LABELS[st.status],
    ]),
  ].map((line) => line.map(escape).join(","));

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function FilterSelect({ label, value, onChange, options, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "w-full rounded-lg border-slate-200 bg-white text-sm text-slate-700 sm:w-auto",
          className
        )}
      >
        {label && <span className="text-slate-500">{label}:</span>}
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatCard({ label, value, hint, hintClassName, tone = "default", children }) {
  const danger = tone === "danger";
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-2xl border p-4 sm:p-5",
        danger ? "border-rose-200 bg-rose-50/60" : "border-slate-200 bg-white"
      )}
    >
      <p className={cn("truncate text-xs sm:text-sm", danger ? "text-rose-700" : "text-slate-500")}>
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-bold sm:text-3xl",
          danger ? "text-rose-600" : "text-slate-900"
        )}
      >
        {value}
      </p>
      {children}
      {hint && <p className={cn("mt-auto pt-2 text-xs", hintClassName)}>{hint}</p>}
    </div>
  );
}

const SEND_CHANNELS = [
  { value: "in-app", label: "In-app" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

// Adds or removes a channel, keeping SEND_CHANNELS order.
const toggleChannel = (selected, value, checked) =>
  SEND_CHANNELS.map((c) => c.value).filter((v) =>
    v === value ? checked : selected.includes(v)
  );

// ["in-app", "email", "sms"] -> "In-app, Email and SMS"
const formatChannels = (selected) => {
  const labels = SEND_CHANNELS.filter((c) => selected.includes(c.value)).map((c) => c.label);
  return labels.length > 1
    ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
    : labels.join("");
};

// Lives inside DialogContent, which unmounts on close, so every open starts with all students ticked.
function ReminderForm({ students, onClose }) {
  const [selectedIds, setSelectedIds] = useState(() => students.map((st) => st.id));
  const [messages, setMessages] = useState({});
  const [channels, setChannels] = useState([SEND_CHANNELS[0].value]);
  const allSelected = selectedIds.length === students.length;

  const toggle = (id, checked) =>
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const handleSend = () => {
    toast.success(
      `Reminder sent to ${selectedIds.length} student${selectedIds.length === 1 ? "" : "s"} via ${formatChannels(channels)}`
    );
    onClose();
  };

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3 sm:px-6">
        <span className="text-xs text-slate-500">
          {selectedIds.length} of {students.length} selected
        </span>
        <button
          type="button"
          onClick={() => setSelectedIds(allSelected ? [] : students.map((st) => st.id))}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>

      {/* Students and "Send via" scroll together; the header row and footer buttons stay fixed. */}
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6">
        <ul className="space-y-2">
          {students.map((st) => {
            const styles = REPORT_ATTENTION_STYLES[st.status];
            const checkboxId = `remind-${st.id}`;
            const selected = selectedIds.includes(st.id);
            return (
              <li key={st.id} className="py-2.5">
                <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    id={checkboxId}
                    checked={selected}
                    onCheckedChange={(checked) => toggle(st.id, checked === true)}
                    className="mt-0.5 border-slate-300 bg-white data-checked:border-blue-600 data-checked:bg-blue-600"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <span className="shrink-0 text-sm font-medium text-slate-800">{st.name}</span>
                    <span className={cn("min-w-0 break-words text-xs", styles?.note)}>
                      {st.attentionNote}
                    </span>
                  </span>
                </label>
                {/* Outside the label so typing/clicking here never toggles the checkbox. Indented to line up with the name. */}
                <Textarea
                  value={messages[st.id] ?? ""}
                  onChange={(e) => setMessages((prev) => ({ ...prev, [st.id]: e.target.value }))}
                  disabled={!selected}
                  aria-label={`Message to ${st.name}`}
                  placeholder={`Write a message to ${st.name.split(" ")[0]}…`}
                  className="mt-2 ml-7 min-h-20 w-[calc(100%-1.75rem)] resize-y border-slate-200 bg-white text-sm"
                />
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-3">
          <span id="reminder-send-via" className="shrink-0 text-sm font-medium text-slate-700">
            Send via:
          </span>
          <div role="group" aria-labelledby="reminder-send-via" className="flex flex-wrap gap-2">
            {SEND_CHANNELS.map((c) => (
              <label
                key={c.value}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-blue-200",
                  channels.includes(c.value)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <input
                  type="checkbox"
                  name="reminder-send-via"
                  value={c.value}
                  checked={channels.includes(c.value)}
                  onChange={(e) =>
                    setChannels((prev) => toggleChannel(prev, c.value, e.target.checked))
                  }
                  className="h-3.5 w-3.5 accent-blue-600"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] min-[360px]:flex-row min-[360px]:justify-end sm:px-6 sm:pb-4">
        <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg px-4">
          Cancel
        </Button>
        <Button
          type="button"
          disabled={selectedIds.length === 0 || channels.length === 0}
          onClick={handleSend}
          className="h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          Send reminder ({selectedIds.length})
        </Button>
      </div>
    </>
  );
}

function SendReminderDialog({ open, students, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      {/* Same layout as the student report: bottom sheet on phones, centred modal on sm+. */}
      <DialogContent
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          "top-auto bottom-0 left-0 w-full max-w-full translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none",
          "max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh]",
          "sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl",
          "sm:max-h-[85vh] sm:supports-[height:100dvh]:max-h-[85dvh]"
        )}
      >
        <DialogHeader className="shrink-0 border-b border-slate-100 px-4 py-3 pr-12 text-left sm:px-6 sm:py-4 sm:pr-12">
          <DialogTitle>Send reminder</DialogTitle>
          <DialogDescription>Students who need your attention</DialogDescription>
        </DialogHeader>
        <ReminderForm students={students} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function NeedsAttention({ students, onOpen }) {
  const [reminderOpen, setReminderOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-slate-800">Needs your attention</h3>
      <p className="mt-0.5 text-xs text-slate-500">Reach out before they fall further behind</p>

      {students.length === 0 ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          Everyone in this view is on track.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {students.map((st) => {
            const styles = REPORT_ATTENTION_STYLES[st.status];
            return (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => onOpen(st.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-opacity hover:opacity-80",
                    styles.card
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      styles.avatar
                    )}
                  >
                    {getInitials(st.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {st.name}
                    </span>
                    <span className={cn("block truncate text-xs", styles.note)}>
                      {st.attentionNote}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Button
        variant="outline"
        disabled={students.length === 0}
        onClick={() => setReminderOpen(true)}
        className="mt-4 h-10 w-full rounded-lg border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
      >
        <Send className="h-4 w-4" />
        Send reminder to all {students.length}
      </Button>

      <SendReminderDialog
        open={reminderOpen}
        students={students}
        onClose={() => setReminderOpen(false)}
      />
    </section>
  );
}

function ScoreSpread({ students }) {
  const buckets = SCORE_BUCKETS.map((bucket) => ({
    ...bucket,
    count: students.filter(
      (st) => st.avgScore != null && st.avgScore >= bucket.min && st.avgScore <= bucket.max
    ).length,
  }));
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-slate-800">Score spread</h3>
      <p className="mt-0.5 text-xs text-slate-500">Students by average score</p>

      <div className="mt-6 grid h-40 grid-cols-4 items-end gap-3">
        {buckets.map((b) => (
          <div key={b.label} className="flex h-full flex-col items-center justify-end gap-1.5">
            <span className="text-xs font-medium text-slate-700">{b.count}</span>
            <div
              className={cn("w-full rounded-t-md transition-all", b.color)}
              style={{ height: b.count ? `${(b.count / max) * 100}%` : "2px" }}
              title={`${b.count} student${b.count === 1 ? "" : "s"} scored ${b.label}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-3 border-t border-slate-100 pt-2">
        {buckets.map((b) => (
          <span key={b.label} className="text-center text-xs text-slate-500">
            {b.label}
          </span>
        ))}
      </div>
    </section>
  );
}

const MAX_RATING = 5;

// The criteria column may arrive as a parsed array or a raw JSON string.
function parseCriteria(raw) {
  if (!raw) return [];
  try {
    const list = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(list)
      ? list.filter((c) => c?.criterion && Number.isFinite(Number(c.rating)))
          .map((c) => ({ criterion: c.criterion, rating: Number(c.rating) }))
      : [];
  } catch {
    return [];
  }
}

function EvaluationCriteriaChart({ criteria: rawCriteria }) {
  const criteria = parseCriteria(rawCriteria);

  if (!criteria.length) {
    return (
      <section>
        <h4 className="text-sm font-semibold text-slate-800">Evaluation criteria</h4>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
          No reviewed tasks yet.
        </p>
      </section>
    );
  }

  const overall = criteria.reduce((sum, c) => sum + c.rating, 0) / criteria.length;

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h4 className="text-sm font-semibold text-slate-800">Evaluation criteria</h4>
        <span className="text-xs text-slate-500">
          Overall{" "}
          <span className="font-semibold text-slate-800">{overall.toFixed(1)}</span> / {MAX_RATING}
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {criteria.map((c, i) => (
          <li key={`${c.criterion}-${i}`}>
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="min-w-0 break-words text-slate-600">{c.criterion}</span>
              <span className="shrink-0 font-semibold text-slate-800">{c.rating.toFixed(1)}</span>
            </div>
            <div
              className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
              role="meter"
              aria-label={c.criterion}
              aria-valuemin={0}
              aria-valuemax={MAX_RATING}
              aria-valuenow={c.rating}
            >
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${Math.min(100, Math.max(0, (c.rating / MAX_RATING) * 100))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StudentOutreachForm({ student, onCancel }) {
  const [channels, setChannels] = useState([SEND_CHANNELS[0].value]);
  const [message, setMessage] = useState("");
  const styles = REPORT_ATTENTION_STYLES[student.status];
  const channelLabelId = `send-via-${student.id}`;
  const messageId = `message-${student.id}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || channels.length === 0) return;
    toast.success(`Message sent to ${student.name} via ${formatChannels(channels)}`);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 pt-4">
      <p className="flex items-start gap-2.5 text-sm text-slate-700">
        <span
          className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", styles?.dot)}
          aria-hidden="true"
        />
        <span className="min-w-0 break-words">{student.attentionNote}</span>
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span id={channelLabelId} className="shrink-0 text-sm font-medium text-slate-700">
          Send via:
        </span>
        <div role="group" aria-labelledby={channelLabelId} className="flex flex-wrap gap-2">
          {SEND_CHANNELS.map((c) => (
            <label
              key={c.value}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-blue-200",
                channels.includes(c.value)
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <input
                type="checkbox"
                name={channelLabelId}
                value={c.value}
                checked={channels.includes(c.value)}
                onChange={(e) =>
                  setChannels((prev) => toggleChannel(prev, c.value, e.target.checked))
                }
                className="h-3.5 w-3.5 accent-blue-600"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={messageId} className="text-slate-700">
          Message
        </Label>
        <Textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write a message to ${student.name.split(" ")[0]}…`}
          className="min-h-24 resize-y border-slate-200 bg-white text-sm"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 min-[360px]:flex-row min-[360px]:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="h-10 rounded-lg px-4">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!message.trim() || channels.length === 0}
          className="h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>
    </form>
  );
}

function StudentReportDialog({ student, onClose }) {
  return (
    <Dialog open={Boolean(student)} onOpenChange={(open) => !open && onClose()}>
      {/* Phones: full-width bottom sheet. sm+: centred modal. Header is fixed, body scrolls. */}
      <DialogContent
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          "top-auto bottom-0 left-0 w-full max-w-full translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none",
          "max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh]",
          "sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl",
          "sm:max-h-[85vh] sm:supports-[height:100dvh]:max-h-[85dvh]"
        )}
      >
        {student && (
          <>
            <DialogHeader className="shrink-0 border-b border-slate-100 px-4 py-3 pr-12 sm:px-6 sm:py-4 sm:pr-12">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 sm:h-11 sm:w-11">
                  {getInitials(student.name)}
                </span>
                <div className="min-w-0 text-left">
                  <DialogTitle className="break-words">{student.name}</DialogTitle>
                  <DialogDescription className="break-words">
                    {student.batch} · {student.course}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="hide-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 break-all text-xs text-slate-400">{student.id}</span>
              <StatusBadge status={student.status} />
            </div>

            <div>
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>Course progress</span>
                <span className="font-medium text-slate-700">{student.progress}%</span>
              </div>
              <ProgressBar value={student.progress} status={student.status} />
            </div>

            <dl className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
              {[
                ["Tasks completed", `${student.tasksDone}/${student.tasksTotal}`],
                ["Average score", student.avgScore == null ? "—" : `${student.avgScore}%`],
                ["Attendance", `${student.attendance}%`],
                ["Last active", formatLastActive(student.lastActiveDays)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5">
                  <dt className="break-words text-xs text-slate-500">{label}</dt>
                  <dd className="mt-0.5 break-words text-base font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>

            <EvaluationCriteriaChart criteria={student.criteria} />

            {student.attentionNote && (
              <StudentOutreachForm key={student.id} student={student} onCancel={onClose} />
            )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function StudentReports({ onNavigate }) {
  const [storedFilters, setFilters] = useAtom(studentReportsFiltersAtom);
  const [selectedId, setSelectedId] = useAtom(studentReportsSelectedIdAtom);

  // Merge with defaults so stale/partial values in storage never break the page.
  const filters = { ...DEFAULT_STUDENT_REPORT_FILTERS, ...storedFilters };
  const batch = REPORT_BATCHES.includes(filters.batch) ? filters.batch : REPORT_BATCHES[0];
  const batchCourses = getBatchCourses(batch);
  const course = batchCourses.includes(filters.course) ? filters.course : "all";

  // Any filter change sends the table back to page 1.
  const updateFilters = (patch) =>
    setFilters((prev) => ({ ...DEFAULT_STUDENT_REPORT_FILTERS, ...prev, ...patch, page: 1 }));

  // Students in the selected batch/course — drives the summary cards and side panels.++++++++++++++++++
  const scopedStudents = REPORT_STUDENTS.filter(
    (st) => st.batch === batch && (course === "all" || st.course === course)
  );

  // Status tab + search narrow down the table only.
  const query = filters.search.trim().toLowerCase();
  const tableStudents = scopedStudents
    .filter((st) => filters.status === "all" || st.status === filters.status)
    .filter(
      (st) =>
        !query || st.name.toLowerCase().includes(query) || st.id.toLowerCase().includes(query)
    )
    .sort((a, b) => REPORT_STATUS_ORDER[a.status] - REPORT_STATUS_ORDER[b.status]);

  const totalPages = Math.max(1, Math.ceil(tableStudents.length / REPORT_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(filters.page) || 1), totalPages);
  const pageStart = (page - 1) * REPORT_PAGE_SIZE;
  const pageStudents = tableStudents.slice(pageStart, pageStart + REPORT_PAGE_SIZE);

  const periodDays = Number(filters.period) || 30;
  const periodLabel = REPORT_PERIODS.find((p) => p.value === filters.period)?.label ?? "Last 30 days";
  const joinedCount = scopedStudents.filter((st) => st.joinedDaysAgo <= periodDays).length;
  const avgProgress = average(scopedStudents.map((st) => st.progress));
  const scored = scopedStudents.filter((st) => st.avgScore != null).map((st) => st.avgScore);
  const avgScore = average(scored);
  const scoreDelta = avgScore - (PREVIOUS_AVG_SCORE[batch] ?? avgScore);
  const attentionStudents = scopedStudents
    .filter((st) => st.status !== REPORT_STATUS.ON_TRACK)
    .sort((a, b) => REPORT_STATUS_ORDER[a.status] - REPORT_STATUS_ORDER[b.status]);
  const atRiskCount = attentionStudents.filter((st) => st.status === REPORT_STATUS.AT_RISK).length;
  const watchCount = attentionStudents.filter((st) => st.status === REPORT_STATUS.WATCH).length;

  const selectedStudent = REPORT_STUDENTS.find((st) => st.id === selectedId) ?? null;

  const setPage = (next) => setFilters((prev) => ({ ...prev, page: next }));

  const handleExport = () => {
    if (!tableStudents.length) {
      toast.error("No students to export for the current filters.");
      return;
    }
    const slug = batch.toLowerCase().replace(/\s+/g, "-");
    downloadCsv(tableStudents, `student-report-${slug}.csv`);
    toast.success(`Exported ${tableStudents.length} students`);
  };

  return (
    <div className="hide-scrollbar flex min-w-0 flex-col gap-4 pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-2 lg:pr-1">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Student reports</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            See how every student is doing across your batches
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search students"
            aria-label="Search students"
            className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <FilterSelect
          label="Course"
          value={course}
          onChange={(value) => updateFilters({ course: value })}
          options={[
            { value: "all", label: "All courses" },
            ...batchCourses.map((c) => ({ value: c, label: c })),
          ]}
        />
        <FilterSelect
          label="Batch"
          value={batch}
          onChange={(value) => updateFilters({ batch: value, course: "all" })}
          options={REPORT_BATCHES.map((b) => ({ value: b, label: b }))}
        />
        <FilterSelect
          value={filters.period}
          onChange={(value) => updateFilters({ period: value })}
          options={REPORT_PERIODS}
          className="col-span-2"
        />

        <Tabs
          value={filters.status}
          onValueChange={(value) => updateFilters({ status: value })}
          className="col-span-2 min-w-0"
        >
          <TabsList className="h-10! w-full rounded-lg bg-slate-100 p-1 sm:w-auto">
            {REPORT_STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-8 px-3 text-xs data-active:text-slate-900 sm:text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button
          onClick={handleExport}
          className="col-span-2 h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 sm:ml-auto"
        >
          <Download className="h-4 w-4" />
          Export report
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Students"
          value={scopedStudents.length}
          hint={`+${joinedCount} joined · ${periodLabel.toLowerCase()}`}
          hintClassName="text-emerald-600"
        />
        <StatCard label="Average course progress" value={`${avgProgress}%`}>
          <ProgressBar
            value={avgProgress}
            status={REPORT_STATUS.ON_TRACK}
            className="mt-auto h-1.5 w-full"
          />
        </StatCard>
        <StatCard
          label="Average score"
          value={scored.length ? `${avgScore}%` : "—"}
          hint={
            scoreDelta === 0
              ? "Same as last month"
              : `${scoreDelta > 0 ? "Up" : "Down"} ${Math.abs(scoreDelta)}% from last month`
          }
          hintClassName={scoreDelta < 0 ? "text-rose-600" : "text-emerald-600"}
        />
        <StatCard
          label="Need attention"
          value={attentionStudents.length}
          hint="Low scores or missed tasks"
          hintClassName="text-rose-600"
          tone="danger"
        >
          <p className="mt-1 text-xs font-medium">
            <span className="text-rose-600">{atRiskCount} at risk</span>
            <span className="text-slate-400"> · </span>
            <span className="text-amber-700">{watchCount} to watch</span>
          </p>
        </StatCard>
      </div>

      {/* Main content */}
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-1 px-4 pb-4 pt-5 sm:flex-row sm:items-start sm:justify-between sm:px-5">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-800">All students</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {pageStudents.length} student{pageStudents.length === 1 ? "" : "s"} shown · click a
                row to open their report
              </p>
            </div>
            <span className="text-xs text-slate-500">Sorted by status</span>
          </div>

          {tableStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 border-t border-slate-100 px-4 py-14 text-center">
              <Users className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No students match these filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ status: "all", search: "" })}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Tablet & desktop: table */}
              <div className="hide-scrollbar hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50 text-left">
                      {TABLE_COLUMNS.map((col, i) => (
                        <th
                          key={col.label || i}
                          className={cn(
                            "py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500",
                            col.className
                          )}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageStudents.map((st) => (
                      <StudentReportTableRow key={st.id} student={st} onOpen={setSelectedId} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phones: cards */}
              <div className="border-t border-slate-100 md:hidden">
                {pageStudents.map((st) => (
                  <StudentReportCard key={st.id} student={st} onOpen={setSelectedId} />
                ))}
              </div>
            </>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:px-5">
            <span className="text-xs text-slate-500 sm:text-sm">
              {tableStudents.length
                ? `Showing ${pageStart + 1}–${pageStart + pageStudents.length} of ${tableStudents.length}`
                : "Showing 0 of 0"}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-4 md:grid md:grid-cols-2 xl:flex xl:flex-col">
          <NeedsAttention students={attentionStudents} onOpen={setSelectedId} />
          <ScoreSpread students={scopedStudents} />
          <p className="text-xs leading-relaxed text-slate-500 md:col-span-2">
            Attendance here is a summary only. To mark or edit it, open{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("attendance")}
              className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              Attendance
            </button>
            .
          </p>
        </aside>
      </div>

      <StudentReportDialog student={selectedStudent} onClose={() => setSelectedId(null)} />
    </div>
  );
}
