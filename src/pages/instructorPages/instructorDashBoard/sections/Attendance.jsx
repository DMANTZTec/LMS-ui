import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleDashed,
  Clock,
  Loader2,
  Lock,
  Play,
  RotateCcw,
  Search,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import { InstructorAttendanceApi } from "@/api/instructor-attendance-controller";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import { cn } from "@/lib/utils";
import { getStaffId } from "@/utils/tokenUtility";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_STYLES,
} from "../data";
import ScheduleCalendarPopover from "../components/ScheduleCalendarPopover";

const UNMARKED = "UNMARKED";

const FILTER_TABS = [
  { value: "All", label: "All" },
  { value: "PRESENT", label: "Attended" },
  { value: "ABSENT", label: "Absent" },
  { value: UNMARKED, label: "Unmarked" },
];

const STATUS_ICONS = {
  PRESENT: Check,
  ABSENT: UserX,
  [UNMARKED]: CircleDashed,
};

const SELECT_LABELS = {
  PRESENT: "Attended",
  ABSENT: "Absent",
};

const SELECT_ACTIVE_STYLES = {
  PRESENT: "bg-emerald-600 text-white shadow-sm",
  ABSENT: "bg-rose-600 text-white shadow-sm",
};

const SELECT_IDLE_STYLES = {
  PRESENT: "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50",
  ABSENT: "text-slate-500 hover:text-rose-600 hover:bg-rose-50",
};

const ROW_ACCENT = {
  PRESENT: "border-l-emerald-400 bg-emerald-50/30",
  ABSENT: "border-l-rose-400 bg-rose-50/30",
  [UNMARKED]: "border-l-slate-200 bg-white",
};

const DOT_STYLES = {
  PRESENT: "bg-emerald-500",
  ABSENT: "bg-rose-500",
  [UNMARKED]: "bg-slate-300",
};

const toTimeLabel = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
};

const fullName = (s) => `${s.firstNm ?? ""} ${s.lastNm ?? ""}`.trim() || s.studentId;

const getInitials = (s) =>
  `${s.firstNm?.[0] ?? ""}${s.lastNm?.[0] ?? ""}`.toUpperCase().slice(0, 2) || "?";

// Only real marks are stored; an unmarked student is simply absent from the map.
const MARKED_STATUSES = ["PRESENT", "ABSENT"];

const marksFromStudents = (students) =>
  (Array.isArray(students) ? students : []).reduce((acc, student) => {
    if (MARKED_STATUSES.includes(student?.status)) {
      acc[student.studentId] = student.status;
    }
    return acc;
  }, {});

const tally = (marks = {}, totalOverride) => {
  const values = Object.values(marks);
  const present = values.filter((s) => s === "PRESENT").length;
  const absent = values.filter((s) => s === "ABSENT").length;
  const total = totalOverride ?? values.length;
  return {
    present,
    absent,
    total,
    unmarked: Math.max(total - (present + absent), 0),
    attended: present,
    rate: total ? Math.round((present / total) * 100) : 0,
  };
};

/* ─── Attendance summary returned by the API ─── */
const SESSION_NOT_STARTED = "NOT_STARTED";
const SESSION_MARKED = "MARKED";

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

// Both the schedule list and every mark response carry the same summary fields,
// so they normalise through here and the rest of the page reads one shape.
const normalizeSummary = (source, studentCount) => {
  const raw = source ?? {};
  const total = num(raw.totalStudents ?? raw.studentCount ?? studentCount);
  const present = num(raw.presentCount);
  const absent = num(raw.absentCount);
  const rate =
    raw.attendanceRate != null
      ? Math.round(Number(raw.attendanceRate))
      : total
        ? Math.round((present / total) * 100)
        : 0;
  return {
    totalStudents: total,
    presentCount: present,
    absentCount: absent,
    unmarkedCount: Math.max(num(raw.unmarkedCount ?? total - present - absent), 0),
    attendanceRate: rate,
    sessionStatus: raw.sessionStatus ?? SESSION_NOT_STARTED,
    markedAt: raw.markedAt ?? "",
    markedBy: raw.markedBy ?? "",
  };
};

const emptySummary = normalizeSummary(null, 0);

const statsFromSummary = (summary, studentCount) => {
  const s = summary ?? emptySummary;
  return {
    present: s.presentCount,
    absent: s.absentCount,
    total: s.totalStudents || num(studentCount),
    unmarked: s.unmarkedCount,
    attended: s.presentCount,
    rate: s.attendanceRate,
  };
};

// A live session counts what the instructor has tapped so far; every other
// session shows what the server has stored.
const statsForClass = (cls, { marks, summaries, startedClasses }) =>
  startedClasses.includes(cls.id)
    ? tally(marks[cls.id], cls.studentCount || summaries[cls.id]?.totalStudents)
    : statsFromSummary(summaries[cls.id], cls.studentCount);

/* ─── Schedule phases (derived from the clock, classes are all "today") ─── */
const PHASE = {
  upcoming: "upcoming",
  live: "live",
  past: "past",
};

const PHASE_META = {
  [PHASE.upcoming]: {
    label: "Upcoming",
    chip: "bg-slate-100 text-slate-500",
  },
  [PHASE.live]: {
    label: "Live",
    chip: "bg-blue-50 text-blue-600",
  },
  [PHASE.past]: {
    label: "Past",
    chip: "bg-emerald-50 text-emerald-700",
  },
};

// The filter tabs split the whole schedule list around today: "Past" covers
// yesterday and everything before it, "Upcoming" starts tomorrow.
const SCHEDULE_FILTERS = [
  { value: "all", label: "Today" },
  { value: PHASE.past, label: "Past" },
  { value: PHASE.upcoming, label: "Upcoming" },
];

const toMinutes = (time) => {
  const [h, m] = (time || "").split(":").map(Number);
  return Number.isNaN(h) ? NaN : h * 60 + m;
};

const getPhase = (cls, now = new Date()) => {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(cls.startTime);
  const end = toMinutes(cls.endTime);
  if (Number.isNaN(start) || nowMin < start) return PHASE.upcoming;
  if (!Number.isNaN(end) && nowMin > end) return PHASE.past;
  return PHASE.live;
};

const minutesUntil = (cls, now = new Date()) =>
  toMinutes(cls.startTime) - (now.getHours() * 60 + now.getMinutes());

const countdownLabel = (mins) => {
  if (!Number.isFinite(mins) || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
};

/* ─── Schedules API ─── */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * The API returns "Thu, 03 Sep 2026" — strip the weekday so Date parses the
 * rest as local time and the day never shifts with the timezone.
 */
const SCHEDULE_DATE_KEY = /^[A-Za-z]+,?\s+(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/;

const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const TODAY_KEY = toDateKey(new Date());

const parseScheduleDateKey = (value) => {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  const match = SCHEDULE_DATE_KEY.exec(raw);
  if (match) {
    const month = MONTH_NAMES.findIndex(
      (name) => name.toLowerCase() === match[2].slice(0, 3).toLowerCase()
    );
    if (month > -1) {
      return toDateKey(new Date(Number(match[3]), month, Number(match[1])));
    }
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : toDateKey(parsed);
};

/**
 * Schedules arrive as "11:09 am" / "12:09 pm" but the session phases compare
 * against a 24h clock, so normalise both ends to HH:mm.
 */
const to24hTime = (value) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const match =
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(raw) ??
    /^(\d{1,2}):(\d{2})/.exec(raw);
  if (!match) return raw;
  let hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const CANCELLED = "CANCELLED";

// The schedule list already reports the session's attendance state, so cards,
// chips and the metric cards can render before any session is opened.
const SESSION_STATUS_META = {
  NOT_STARTED: { label: "Not started", chip: "bg-slate-100 text-slate-500" },
  IN_PROGRESS: { label: "Live", chip: "bg-blue-50 text-blue-600" },
  MARKED: { label: "Marked", chip: "bg-emerald-50 text-emerald-700" },
};

const sessionStatusMeta = (status) =>
  SESSION_STATUS_META[status] ?? {
    label: String(status ?? SESSION_NOT_STARTED).replace(/_/g, " ").toLowerCase(),
    chip: "bg-slate-100 text-slate-500",
  };

// Maps the API payload onto the shape the schedule strip renders. A schedule
// also carries its attendance summary so the cards need no extra request.
const toSchedule = (item) => ({
  id: String(item.id),
  scheduleId: item.id,
  code: item.courseId ?? "",
  course: item.course ?? "",
  batch: item.batchName ?? "",
  batchId: item.batchId ?? null,
  className: item.className ?? "",
  status: item.status ?? "",
  dateKey: parseScheduleDateKey(item.date),
  startTime: to24hTime(item.time),
  endTime: to24hTime(item.endTime),
  topic: item.className ?? "",
  studentCount: num(item.studentCount ?? item.totalStudents),
  sessionStatus: item.sessionStatus ?? SESSION_NOT_STARTED,
  presentCount: num(item.presentCount),
  absentCount: num(item.absentCount),
  unmarkedCount: num(item.unmarkedCount),
  attendanceRate: item.attendanceRate != null ? Number(item.attendanceRate) : null,
  markedAt: item.markedAt ?? "",
  markedBy: item.markedBy ?? "",
});

const normalizeSchedules = (payload) =>
  (Array.isArray(payload) ? payload : [])
    .map(toSchedule)
    .filter((s) => s.id !== "undefined" && s.dateKey);

// The list response already carries each session's attendance summary, so the
// cards, chips and metric cards can render before a single session is opened.
const summariesFromSchedules = (schedules) =>
  schedules.reduce(
    (acc, cls) => ({ ...acc, [cls.id]: normalizeSummary(cls, cls.studentCount) }),
    {}
  );

/* ─── Selected schedule date ─── */
const SCROLL_X_THRESHOLD = 10;

// Parse as local midnight so the day never shifts with the timezone.
const parseDateKey = (key) => new Date(`${key}T00:00:00`);

const formatDateLong = (key) =>
  parseDateKey(key).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const isTodayKey = (key) => key === TODAY_KEY;

// Compact date for cards, where a bucket can span many days.
const formatDateShort = (key) =>
  parseDateKey(key).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

// Today, everything from yesterday backwards, and everything from tomorrow
// onwards. The date keys are zero-padded ISO, so string order is date order.
const bucketOf = (key) => {
  if (key === TODAY_KEY) return "all";
  return key < TODAY_KEY ? PHASE.past : PHASE.upcoming;
};

// For a past date every class is history; for a future date nothing has begun.
// Only the current day needs the live clock comparison.
const getPhaseForDate = (cls, dateKey) => {
  if (dateKey > TODAY_KEY) return PHASE.upcoming;
  if (dateKey < TODAY_KEY) return PHASE.past;
  return getPhase(cls);
};

/* ─── Progress bar ─── */
function ProgressBar({ rate, className = "" }) {
  return (
    <div
      className={cn("h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-slate-100", className)}
      role="progressbar"
      aria-valuenow={rate}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Attendance progress"
    >
      <div
        className="h-full rounded-full bg-[#155DFC] transition-all duration-500"
        style={{ width: `${rate}%` }}
      />
    </div>
  );
}

/* ─── Metric cards ─── */
function MetricCards({ summaries, classes }) {
  const stats = useMemo(() => {
    const totals = { present: 0, absent: 0, total: 0, marked: 0 };
    classes.forEach((cls) => {
      const s = summaries[cls.id];
      if (!s || s.sessionStatus === SESSION_NOT_STARTED) return;
      totals.present += s.presentCount;
      totals.absent += s.absentCount;
      totals.total += s.totalStudents || cls.studentCount;
      if (s.sessionStatus === SESSION_MARKED) totals.marked += 1;
    });
    return {
      ...totals,
      rate: totals.total ? Math.round((totals.present / totals.total) * 100) : 0,
    };
  }, [summaries, classes]);

  const cards = [
    { label: "Classes", value: classes.length, icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
    { label: "Sessions Marked", value: `${stats.marked}/${classes.length}`, icon: UserCheck, color: "text-violet-600 bg-violet-50" },
    { label: "Attended / Absent", value: `${stats.present} / ${stats.absent}`, icon: Users, color: "text-rose-600 bg-rose-50" },
    { label: "Avg. Attendance", value: `${stats.rate}%`, icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:gap-3 sm:p-4 lg:gap-4"
          >
            <div className={cn("hidden shrink-0 rounded-xl p-2.5 sm:flex", c.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
                {c.value}
              </div>
              <div className="truncate text-[10px] font-medium text-slate-400 sm:text-[11px]">
                {c.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Today's schedule: full-width sticky strip ─── */
function ClassCard({
  cls,
  stats,
  isActive,
  isSaved,
  isStarted,
  phase,
  isToday,
  showDate = false,
  fixedWidth = false,
  onSelect,
}) {
  const meta = PHASE_META[phase];
  const sessionStatus = isSaved ? SESSION_MARKED : cls.sessionStatus;
  const statusMeta = sessionStatusMeta(sessionStatus);
  const startsIn =
    phase === PHASE.upcoming && isToday ? countdownLabel(minutesUntil(cls)) : "";
  const isCancelled = cls.status === CANCELLED;
  const heading = [cls.code, cls.batch].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive}
      className={cn(
        "flex w-full min-w-0 snap-start flex-col gap-1.5 rounded-xl border p-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 sm:p-3",
        fixedWidth && "w-[240px] shrink-0 sm:w-[260px]",
        isCancelled && !isActive && "opacity-70",
        isActive
          ? "border-blue-200 bg-blue-50/80 ring-1 ring-blue-200"
          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/60"
      )}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span
            className={cn(
              "truncate text-[11px] font-bold sm:text-xs",
              isCancelled ? "text-rose-500 line-through" : "text-slate-800"
            )}
          >
            {toTimeLabel(cls.startTime)}
          </span>
          {/* A bucket spans many days, so the card carries its own date. */}
          {showDate && (
            <span
              className={cn(
                "shrink-0 text-[9px] font-semibold uppercase tracking-wide",
                isCancelled ? "text-rose-400" : "text-slate-400"
              )}
            >
              {formatDateShort(cls.dateKey)}
            </span>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-slate-600">
          {isStarted || phase === PHASE.past ? `${stats.rate}%` : "—"}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isActive ? "text-blue-500" : "text-slate-300")}
          />
        </span>
      </div>

      <h3
        className={cn(
          "w-full min-w-0 truncate text-xs font-semibold",
          isCancelled ? "text-rose-600" : "text-slate-800"
        )}
      >
        {cls.course || "Untitled session"}
      </h3>
      <p className="w-full min-w-0 truncate text-[10px] text-slate-500">
        {heading || "—"}
      </p>

      {isStarted || phase === PHASE.past ? (
        <ProgressBar rate={stats.rate} />
      ) : (
        <div className="h-1.5 w-full shrink-0 rounded-full bg-slate-100" />
      )}

      <div className="flex w-full min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
        {isCancelled ? (
          <span className="inline-flex shrink-0 items-center rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600">
            Cancelled
          </span>
        ) : (
          <>
            {/* Clock-derived phase (Upcoming / Live / Past). */}
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                meta.chip
              )}
            >
              {meta.label}
            </span>
            {/* Server-reported sessionStatus from getSchedulesByInstructor. */}
            {!isSaved && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  statusMeta.chip
                )}
                title={`Session status: ${sessionStatus}`}
              >
                {statusMeta.label}
              </span>
            )}
          </>
        )}

        <span className="truncate text-[10px] text-slate-400">
          {startsIn
            ? `Starts ${startsIn}`
            : isStarted || phase === PHASE.past
              ? `${stats.attended}/${stats.total} attended`
              : `${stats.total} students`}
        </span>
      </div>
    </button>
  );
}

function ClassStrip({
  classes,
  bucketTotal,
  totalClasses,
  bucketCounts,
  schedulesByDate,
  countsByDate,
  loading,
  marks,
  summaries,
  startedClasses,
  activeId,
  filter,
  dateKey,
  onDateChange,
  onFilterChange,
  onSelect,
}) {
  const scrollRef = useRef(null);

  // Each card follows its own date, so a bucket spanning many days still labels
  // every session correctly.
  const phaseOf = (cls) => getPhaseForDate(cls, dateKey ?? cls.dateKey);

  // Browsing a bucket mixes many days, so cards have to show their own date.
  const showDate = !dateKey;

  // The page already scopes `classes` to the active bucket and, when a day is
  // focused, to that single date — so nothing is filtered here.
  const visible = classes;

  // Past the threshold a wrapping grid gets unusable, so switch to a swipeable row.
  const overflows = visible.length > SCROLL_X_THRESHOLD;
  const isToday = (dateKey ?? TODAY_KEY) === TODAY_KEY;

  const filterLabel =
    SCHEDULE_FILTERS.find((f) => f.value === filter)?.label ?? "Today";

  const heading = dateKey
    ? "Schedule"
    : filter === "all"
      ? "Today's Schedule"
      : filter === PHASE.past
        ? "Past Schedules"
        : "Upcoming Schedules";

  const subheading = dateKey
    ? formatDateLong(dateKey)
    : filter === "all"
      ? formatDateLong(TODAY_KEY)
      : filter === PHASE.past
        ? "Everything up to yesterday"
        : "Tomorrow onwards";

  const nudge = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div className="sticky top-0 z-20 -mx-1 bg-slate-50/95 px-1 py-3 backdrop-blur-sm">
      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-800">
                  {heading}
                </h2>
                <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-[11px]">
                  {subheading}
                </p>
              </div>
            </div>

            {/* Date picker */}
            <div className="flex min-w-0 shrink-0 items-center gap-1.5">
              <ScheduleCalendarPopover
                selectedKey={dateKey ?? TODAY_KEY}
                triggerLabel={dateKey ?? filterLabel}
                todayKey={TODAY_KEY}
                countsByDate={countsByDate}
                schedulesByDate={schedulesByDate}
                toDateKey={toDateKey}
                loading={loading}
                onSelectDate={onDateChange}
              />
              {dateKey && (
                <button
                  type="button"
                  onClick={() => onDateChange(TODAY_KEY)}
                  className="h-8 shrink-0 rounded-lg bg-slate-100 px-2 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            {/* Schedule filters — single row, swipeable when space is tight */}
            <div className="hide-scrollbar flex min-w-0 max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
              {SCHEDULE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => onFilterChange(f.value)}
                  className={cn(
                    "flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold transition-all",
                    filter === f.value
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] font-bold",
                      filter === f.value
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-200/80 text-slate-500"
                    )}
                  >
                    {bucketCounts[f.value] ?? 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {overflows && (
                <>
                  <button
                    type="button"
                    onClick={() => nudge(-1)}
                    aria-label="Scroll classes left"
                    className="hidden h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 sm:flex"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="hidden text-[10px] font-semibold text-slate-400 sm:inline">
                    Swipe for more
                  </span>
                  <button
                    type="button"
                    onClick={() => nudge(1)}
                    aria-label="Scroll classes right"
                    className="hidden h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 sm:flex"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                {visible.length}/{dateKey ? totalClasses : bucketTotal}
              </span>
            </div>
          </div>
        </header>

        {loading ? (
          <p className="flex items-center justify-center gap-2 px-4 py-8 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading schedule…
          </p>
        ) : visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-slate-400">
            {totalClasses === 0
              ? "No schedules have been assigned yet."
              : dateKey
                ? `No classes on ${formatDateLong(dateKey)}.`
                : `No ${filterLabel.toLowerCase()} sessions.`}
          </p>
        ) : overflows ? (
          <div
            ref={scrollRef}
            role="radiogroup"
            aria-label="Scheduled classes"
            className="hide-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto p-2.5 sm:p-3"
          >
            {visible.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                stats={statsForClass(cls, { marks, summaries, startedClasses })}
                isActive={cls.id === activeId}
                isSaved={summaries[cls.id]?.sessionStatus === SESSION_MARKED}
                isStarted={summaries[cls.id]?.sessionStatus === SESSION_MARKED || startedClasses.includes(cls.id)}
                phase={phaseOf(cls)}
                isToday={isToday}
                showDate={showDate}
                fixedWidth
                onSelect={() => onSelect(cls.id)}
              />
            ))}
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label="Scheduled classes"
            className="grid grid-cols-1 gap-2 p-2.5 min-[420px]:grid-cols-2 min-[720px]:grid-cols-3 lg:grid-cols-4 sm:p-3"
          >
            {visible.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                stats={statsForClass(cls, { marks, summaries, startedClasses })}
                isActive={cls.id === activeId}
                isSaved={summaries[cls.id]?.sessionStatus === SESSION_MARKED}
                isStarted={summaries[cls.id]?.sessionStatus === SESSION_MARKED || startedClasses.includes(cls.id)}
                phase={phaseOf(cls)}
                isToday={isToday}
                showDate={showDate}
                onSelect={() => onSelect(cls.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Class hero banner ─── */
function ClassHero({ cls, studentCount, showDate = false }) {
  const meta = [
    ...(showDate
      ? [
          {
            icon: CalendarDays,
            label: "Date",
            value: formatDateLong(cls.dateKey),
          },
        ]
      : []),
    {
      icon: Clock,
      label: "Time",
      value:
        cls.startTime && cls.endTime
          ? `${toTimeLabel(cls.startTime)} – ${toTimeLabel(cls.endTime)}`
          : "—",
    },
  ];

  const subheading = [cls.code, cls.batch].filter(Boolean).join(" · ");

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#155DFC] to-indigo-700 p-3.5 text-white sm:p-4 lg:p-5">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        {/* Left side: Main text + Date/Time cards side by side */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:gap-6">
          {/* Class Title Info */}
          <div className="min-w-0 flex-1 basis-48">
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-white/60">
              {subheading || "Session"}
            </p>
            <h2 className="mt-1 break-words text-sm font-bold sm:text-base lg:text-lg">
              {cls.course || "Untitled session"}
            </h2>
            <p className="mt-0.5 break-words text-[11px] text-white/70 sm:text-xs">
              {cls.className || cls.topic || "No session name"}
            </p>
          </div>

          {/* Date & Time Badges placed horizontally next to title info */}
          <div className="flex flex-wrap items-center gap-2">
            {meta.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-white/70" />
                  <div className="min-w-0">
                    <dt className="text-[9px] font-semibold uppercase tracking-wider text-white/50">
                      {item.label}
                    </dt>
                    <dd className="truncate text-[11px] font-semibold">
                      {item.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side badge */}
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
          {studentCount} students
        </span>
      </div>
    </div>
  );
}

/* ─── Session toolbar ─── */
function SessionToolbar({
  stats,
  phase,
  isStarted,
  isSaved,
  saving,
  onStart,
  onMarkAll,
  onReset,
  isToday,
  isPastDate,
}) {
  const isUpcoming = phase === PHASE.upcoming;
  const isEnded = isPastDate;
  // Only a session on an earlier date is history. Everything scheduled for
  // today stays editable for the whole day, before or after its start time.
  const isLocked = isEnded || (isUpcoming && !isToday);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        {/* Legend + rate */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: UserCheck, label: "Attended", cls: "text-emerald-600 bg-emerald-50" },
              { icon: UserX, label: "Absent", cls: "text-rose-500 bg-rose-50" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={cn("rounded-lg p-1.5", item.cls)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden text-[11px] font-medium text-slate-500 sm:inline">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {isStarted && (
            <>
              <div className="hidden h-7 w-px shrink-0 bg-slate-200 sm:block" />

              <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                <span className="text-2xl font-bold text-slate-800">{stats.rate}%</span>
                <span className="text-[11px] text-slate-400">
                  {stats.attended} of {stats.total} attended
                  {stats.unmarked > 0 && ` · ${stats.unmarked} unmarked`}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {!isStarted ? (
          isLocked ? (
            <button
              type="button"
              onClick={onStart}
              disabled
              aria-disabled="true"
              className="flex h-9 w-full min-w-0 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-200 px-5 text-xs font-semibold text-slate-500 min-[420px]:w-auto"
            >
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {isEnded ? "Session has ended" : "Not started yet"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="flex h-9 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-[#155DFC] px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1149c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 min-[420px]:w-auto"
            >
              <Play className="h-3.5 w-3.5 shrink-0 fill-current" />
              <span className="truncate">Start attendance</span>
            </button>
          )
        ) : isEnded ? (
          <span className="flex h-9 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-slate-200 px-5 text-xs font-semibold text-slate-500 min-[420px]:w-auto">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Session has ended</span>
          </span>
        ) : (
          <div className="flex w-full min-w-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200/80 min-[420px]:w-auto">
            <button
              type="button"
              onClick={onMarkAll}
              disabled={saving}
              className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 min-[420px]:flex-none min-[420px]:justify-start min-[420px]:px-3 min-[420px]:text-xs"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="truncate">All attended</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={saving}
              className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 min-[420px]:flex-none min-[420px]:justify-start min-[420px]:px-3 min-[420px]:text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Clear</span>
            </button>
          </div>
        )}
      </div>

      {isStarted && <ProgressBar rate={stats.rate} className="mt-3 h-2" />}

      {isStarted && (stats.unmarked > 0 || stats.absent > 0) && (
        <div className="mt-3 flex flex-col gap-2">
          {stats.unmarked > 0 && (
            <div className="flex min-w-0 items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[11px] text-amber-700">
              <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="min-w-0 break-words">
                {stats.unmarked} student{stats.unmarked > 1 ? "s are" : " is"}{" "}
                not yet marked.
              </span>
            </div>
          )}
          {stats.absent > 0 && (
            <div className="flex min-w-0 items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[11px] text-rose-600">
              <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
              <span className="min-w-0 break-words">
                {stats.absent} student{stats.absent > 1 ? "s" : ""} marked
                absent.
              </span>
            </div>
          )}
        </div>
      )}

      {isSaved && !isStarted && (
        <p className="mt-3 text-[11px] text-slate-400">
          Attendance for this session is already marked.{" "}
          {isEnded ? (
            "Past sessions are read-only, so the record below is final."
          ) : (
            <>
              Press{" "}
              <span className="font-semibold text-slate-500">Start attendance</span>{" "}
              to re-mark students.
            </>
          )}
        </p>
      )}
    </section>
  );
}

/* ─── Status selector ─── */
// Each tap posts immediately, so a row is locked while its request is in
// flight to keep a double click from marking the student twice.
function StatusSelector({ studentName, status, readOnly = false, pending = false, onChange }) {
  const locked = readOnly || pending;

  return (
    <div
      role="group"
      aria-label={`Attendance for ${studentName}`}
      aria-readonly={readOnly || undefined}
      className="flex w-full min-w-0 rounded-full bg-slate-100 p-1 sm:w-auto"
    >
      {ATTENDANCE_STATUS.map((opt) => {
        const Icon = STATUS_ICONS[opt];
        const isActive = status === opt;
        return (
          <button
            key={opt}
            type="button"
            disabled={locked}
            aria-pressed={isActive}
            aria-busy={pending || undefined}
            onClick={() => onChange(opt)}
            className={cn(
              "flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold transition-all sm:flex-none sm:px-3 sm:text-xs",
              locked && "cursor-not-allowed opacity-70",
              !locked && (isActive ? SELECT_ACTIVE_STYLES[opt] : cn("bg-transparent", SELECT_IDLE_STYLES[opt]))
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden min-[400px]:inline">{SELECT_LABELS[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Student row ─── */
function StudentRow({ student, status, pending = false, readOnly = false, onMark }) {
  const isInactive = student.enabled !== "Y";

  return (
    <li
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-2xl border border-l-4 p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-3.5 lg:p-4",
        ROW_ACCENT[status] ?? ROW_ACCENT[UNMARKED]
      )}
    >
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
            {student.profileImg ? (
              <img
                src={student.profileImg}
                alt={fullName(student)}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                {getInitials(student)}
              </div>
            )}
          </div>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white",
              DOT_STYLES[status] ?? DOT_STYLES[UNMARKED]
            )}
          >
            {status !== UNMARKED && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
              {fullName(student)}
            </span>
            {isInactive && (
              <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                Inactive
              </span>
            )}
            {/* Status badge — always visible so mobile never hides state */}
            {status !== UNMARKED && (
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  ATTENDANCE_STATUS_STYLES[status]
                )}
              >
                {ATTENDANCE_STATUS_LABELS[status]}
              </span>
            )}
            {pending && (
              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving
              </span>
            )}
          </div>

          <p className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1 text-[11px] text-slate-400">
            <span className="font-medium text-slate-500">{student.studentId}</span>
            <span className="text-slate-300" aria-hidden>·</span>
            <span className="truncate">{student.mobileNum}</span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden>·</span>
            <span className="hidden min-w-0 truncate sm:inline">{student.emailId}</span>
          </p>
        </div>
      </div>

      {/* Controls — full width on mobile, hugs content from sm up */}
      <div className="w-full shrink-0 sm:w-auto">
        <StatusSelector
          studentName={fullName(student)}
          status={status}
          readOnly={readOnly}
          pending={pending}
          onChange={(next) => onMark(student.studentId, next)}
        />
      </div>
    </li>
  );
}

/* ─── Roster ─── */
function NotStartedState({ cls, studentCount, phase, isToday, onStart }) {
  const isUpcoming = phase === PHASE.upcoming;
  const startsIn =
    isUpcoming && isToday ? countdownLabel(minutesUntil(cls)) : "";

  return (
    <div className="flex min-w-0 flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center sm:py-14">
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
          isUpcoming ? "bg-slate-100" : "bg-blue-50"
        )}
      >
        {isUpcoming ? (
          <Lock className="h-6 w-6 text-slate-400" />
        ) : (
          <Play className="h-6 w-6 fill-blue-600 text-blue-600" />
        )}
      </div>

      <div className="min-w-0 max-w-sm">
        <h3 className="text-sm font-bold text-slate-700">
          {isUpcoming
            ? "This class has not started yet"
            : phase === PHASE.past
              ? "Attendance for this session"
              : "Attendance not started"}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {isUpcoming ? (
            isToday ? (
              <>
                {cls.course} starts at{" "}
                <span className="font-semibold text-slate-500">
                  {toTimeLabel(cls.startTime)}
                </span>{" "}
                ({startsIn}). You can mark attendance once the class begins.
              </>
            ) : (
              <>
                This class is scheduled for a future date. You can mark
                attendance once the class begins.
              </>
            )
          ) : phase === PHASE.past ? (
            <>
              This session ended at {toTimeLabel(cls.endTime)}.{" "}
              {studentCount} student{studentCount === 1 ? "" : "s"} on record.
            </>
          ) : (
            <>
              {studentCount} student{studentCount === 1 ? " is" : "s are"}{" "}
              enrolled in this batch. Press{" "}
              <span className="font-semibold text-slate-500">
                Start attendance
              </span>{" "}
              to open the roster and begin marking.
            </>
          )}
        </p>
      </div>

      {isUpcoming && (
        <button
          type="button"
          onClick={onStart}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-50"
        >
          Why can't I start?
        </button>
      )}
    </div>
  );
}

function Roster({
  students,
  marks,
  search,
  filter,
  loading = false,
  error = false,
  readOnly = false,
  pendingStudents,
  onStatusChange,
  onSearchChange,
  onFilterChange,
}) {
  const counts = useMemo(() => {
    const c = { [UNMARKED]: 0 };
    for (const s of students) {
      const k = marks[s.studentId] || UNMARKED;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [students, marks]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (filter !== "All" && (marks[s.studentId] || UNMARKED) !== filter) return false;
      if (!q) return true;
      return (
        fullName(s).toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        (s.emailId || "").toLowerCase().includes(q) ||
        (s.mobileNum || "").includes(q)
      );
    });
  }, [students, marks, filter, search]);

  const tabCount = (v) => (v === "All" ? students.length : (counts[v] ?? 0));

  const resetFilters = () => {
    onSearchChange("");
    onFilterChange("All");
  };

  return (
    <section className="flex min-w-0 flex-col gap-3">
      {/* Header */}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-800">Student Roster</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {readOnly
              ? "Past session — marks are read-only."
              : "Every change is saved as you mark it."}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {visible.length} / {students.length}
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex h-9 w-full min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 sm:max-w-xs">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, ID, email…"
            aria-label="Search students"
            className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="shrink-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap gap-1 rounded-full bg-slate-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={filter === tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-all",
                filter === tab.value
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold",
                  filter === tab.value
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-200/80 text-slate-500"
                )}
              >
                {tabCount(tab.value)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-xs text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading roster…
        </div>
      ) : students.length === 0 ? (
        <div className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
            {error ? (
              <CircleAlert className="h-5 w-5 text-slate-400" />
            ) : (
              <Users className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-600">
              {error ? "Roster unavailable" : "No students enrolled"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {error
                ? "We could not load this session's roster. Try again shortly."
                : "This batch has no students yet."}
            </p>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-600">No students found</p>
            <p className="mt-0.5 text-xs text-slate-400">No match for your search or filter.</p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="flex min-w-0 flex-col gap-2">
          {visible.map((student) => (
            <StudentRow
              key={student.studentId}
              student={student}
              status={marks[student.studentId] || UNMARKED}
              pending={Boolean(pendingStudents?.[student.studentId])}
              readOnly={readOnly}
              onMark={onStatusChange}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── Page ─── */
export default function Attendance() {
  const [staffId] = useState(getStaffId);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getStaffId()));
  const [scheduleError, setScheduleError] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  // { [scheduleId]: { [studentId]: "PRESENT" | "ABSENT" } }
  const [marks, setMarks] = useState({});
  // { [scheduleId]: normalized summary the API returns with every mark.
  const [summaries, setSummaries] = useState({});
  // { [scheduleId]: { students, loaded, error } } — loading is derived from
  // `loaded` so switching sessions never needs an effect of its own.
  const [sessions, setSessions] = useState({});
  // The attendance endpoints do not exist on the backend yet, so the page runs
  // on the bundled dummy roster until one of them answers successfully.
  const [apiAvailable, setApiAvailable] = useState(false);
  // Students with a mark request in flight, keyed by studentId.
  const [pendingStudents, setPendingStudents] = useState({});
  const [bulkSaving, setBulkSaving] = useState(false);
  const [startedClasses, setStartedClasses] = useState([]);
  // null = browse the whole active bucket; a key = focus one specific day.
  const [dateKey, setDateKey] = useState(null);
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Mirrors pendingStudents so a double tap can be rejected inside the handler
  // before the next render lands.
  const pendingRef = useRef({});

  const startPending = useCallback((studentId) => {
    if (pendingRef.current[studentId]) return false;
    pendingRef.current = { ...pendingRef.current, [studentId]: true };
    setPendingStudents(pendingRef.current);
    return true;
  }, []);

  const endPending = useCallback((studentId) => {
    const next = { ...pendingRef.current };
    delete next[studentId];
    pendingRef.current = next;
    setPendingStudents(next);
  }, []);

  const resetPending = useCallback(() => {
    pendingRef.current = {};
    setPendingStudents({});
  }, []);

  const mergeSummary = useCallback((scheduleId, payload, studentCount) => {
    setSummaries((prev) => ({
      ...prev,
      [scheduleId]: normalizeSummary(
        { ...prev[scheduleId], ...payload },
        studentCount ?? prev[scheduleId]?.totalStudents
      ),
    }));
  }, []);

  useEffect(() => {
    if (!staffId) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setScheduleError(false);
      try {
        const res = await cAdminControllerApi.getSchedulesByInstructor(
          staffId,
          "ALL"
        );
        if (cancelled) return;
        const next = normalizeSchedules(res?.data);
        setSchedules(next);
        // Each schedule carries its own attendance summary, so the cards and
        // metric cards are populated without opening a session.
        setSummaries(summariesFromSchedules(next));
      } catch (err) {
        console.error("Failed to fetch instructor schedules", err);
        if (cancelled) return;
        setSchedules([]);
        setScheduleError(true);
        toast.error("Could not load your schedule. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [staffId]);

  // Group by day so the calendar can mark scheduled dates and focus a day.
  const schedulesByDate = useMemo(
    () =>
      schedules.reduce((acc, cls) => {
        if (!cls.dateKey) return acc;
        (acc[cls.dateKey] ??= []).push(cls);
        return acc;
      }, {}),
    [schedules]
  );

  const countsByDate = useMemo(
    () =>
      Object.entries(schedulesByDate).reduce(
        (acc, [key, list]) => ({ ...acc, [key]: list.length }),
        {}
      ),
    [schedulesByDate]
  );

  // Tab counts always cover the whole bucket so they do not shrink once a
  // single day is focused.
  const bucketCounts = useMemo(
    () =>
      schedules.reduce(
        (acc, s) => {
          const b = bucketOf(s.dateKey);
          acc[b] = (acc[b] ?? 0) + 1;
          return acc;
        },
        { all: 0, [PHASE.past]: 0, [PHASE.upcoming]: 0 }
      ),
    [schedules]
  );

  const byStartTime = (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime);

  const bucketClasses = useMemo(
    () => {
      const filtered = schedules
        .filter((s) => bucketOf(s.dateKey) === scheduleFilter)
        .slice();
      filtered.sort((a, b) => {
        const dateCmp = a.dateKey.localeCompare(b.dateKey);
        if (dateCmp !== 0)
          return scheduleFilter === PHASE.past ? -dateCmp : dateCmp;
        return byStartTime(a, b);
      });
      return filtered;
    },
    [schedules, scheduleFilter]
  );

  // Focusing a day narrows the active bucket to that one date.
  const dateClasses = useMemo(
    () =>
      dateKey
        ? bucketClasses.filter((s) => s.dateKey === dateKey)
        : bucketClasses,
    [bucketClasses, dateKey]
  );

  // A cancelled or empty day has nothing to mark, so fall back to the first
  // session that does.
  const selectableClasses = useMemo(
    () =>
      dateClasses.length > 0
        ? dateClasses
        : schedules.filter((s) => s.status !== CANCELLED).slice(0, 1),
    [dateClasses, schedules]
  );

  // Derived so a date change can never leave a stale selection behind.
  const activeClass = useMemo(
    () =>
      selectableClasses.find((c) => c.id === selectedClassId) ??
      selectableClasses[0] ??
      null,
    [selectableClasses, selectedClassId]
  );
  // Roster + stored marks for a session. State lands only after the await, so
  // the effect below never sets state synchronously.
  const loadSession = useCallback(
    async (scheduleId) => {
      if (!scheduleId) return;
      try {
        const res = await InstructorAttendanceApi.getScheduleAttendance(Number(scheduleId));
        const payload = res?.data ?? {};
        const students = Array.isArray(payload.students) ? payload.students : [];
        setApiAvailable(true);
        setSessions((prev) => ({
          ...prev,
          [scheduleId]: { students, loaded: true, error: false },
        }));
        setMarks((prev) => ({ ...prev, [scheduleId]: marksFromStudents(students) }));
        mergeSummary(scheduleId, payload, students.length);
      } catch (err) {
        console.warn(
          "Attendance API unavailable, using the demo roster for this session",
          err
        );
        setSessions((prev) => ({
          ...prev,
          [scheduleId]: { students: [], loaded: true, error: true },
        }));
        setApiAvailable(true);
      }
    },
    [mergeSummary]
  );

  const activeScheduleId = activeClass?.id ?? null;
  const activeSession = activeScheduleId ? sessions[activeScheduleId] : undefined;
  // Real roster when the API answers, demo roster while it is unavailable.
  const roster = useMemo(() => {
    if (activeSession?.students?.length) return activeSession.students;
    if (!activeClass) return [];
    return [];
  }, [activeSession, activeClass]);
  const rosterLoading = apiAvailable && Boolean(activeScheduleId) && !activeSession?.loaded;
  const rosterError = Boolean(activeSession?.error);

  useEffect(() => {
    if (!activeScheduleId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSession(activeScheduleId);
  }, [activeScheduleId, loadSession]);

  // While browsing a bucket the session's own date decides its phase.
  const phase = activeClass
    ? getPhaseForDate(activeClass, dateKey ?? activeClass.dateKey)
    : PHASE.upcoming;
  const isMarked = summaries[activeScheduleId]?.sessionStatus === SESSION_MARKED;
  const isStarted = activeClass
    ? isMarked || startedClasses.includes(activeClass.id)
    : false;
  const isTodaySession = Boolean(activeClass) && isTodayKey(activeClass.dateKey);
  // Date keys are zero-padded ISO, so string order is date order. Only an
  // earlier date is history — today's session stays editable all day.
  const isPastDate = Boolean(activeClass) && activeClass.dateKey < TODAY_KEY;
  const showRoster = isStarted || isTodaySession || isPastDate;

  // Marks stay hidden until the session is started, so the rate reflects a real
  // session instead of another day's data. Past sessions are history, so their
  // stored record is shown as-is.
  const classMarks = useMemo(
    () =>
      !activeClass
        ? {}
        : showRoster
          ? marks[activeClass.id] ?? {}
          : {},
    [marks, activeClass, showRoster]
  );
  const stats = isStarted
    ? tally(classMarks, roster.length)
    : statsFromSummary(summaries[activeScheduleId], roster.length || activeClass?.studentCount);
  // The server decides when a session is complete; without the API the local
  // roster decides it, so the card still reflects a fully marked session.
  const isSaved = isMarked;

  const setLocalMark = useCallback(
    (scheduleId, studentId, status) =>
      setMarks((prev) => {
        const rows = { ...(prev[scheduleId] ?? {}) };
        if (status == null) delete rows[studentId];
        else rows[studentId] = status;
        return { ...prev, [scheduleId]: rows };
      }),
    []
  );

  // One tap = one POST. The mark lands optimistically and is rolled back if the
  // request fails; the response carries the fresh counts.
  const markStatus = useCallback(
    async (studentId, status) => {
      const scheduleId = activeScheduleId;
      if (!scheduleId) return;

      if (!apiAvailable) {
        return;
      }

      if (!startPending(studentId)) return;

      const previous = marks[scheduleId]?.[studentId];
      setLocalMark(scheduleId, studentId, status);
      try {
        const res = await InstructorAttendanceApi.markAttendancePost(Number(scheduleId), {
          studentId,
          status,
          staffId,
        });
        mergeSummary(scheduleId, res?.data ?? {});
      } catch (err) {
        console.error("Failed to save attendance", err);
        setLocalMark(scheduleId, studentId, previous);
        toast.error(`Could not save attendance for ${studentId}.`);
      } finally {
        endPending(studentId);
      }
    },
    [
      activeScheduleId,
      apiAvailable,
      endPending,
      marks,
      mergeSummary,
      setLocalMark,
      staffId,
      startPending,
    ]
  );

  // "All attended" and "Clear" update every touched row in one PUT. A single row
  // tap goes through markStatus as a one-student POST.
  const bulkMark = useCallback(
    async (status) => {
      const scheduleId = activeScheduleId;
      if (!scheduleId || roster.length === 0 || bulkSaving) return;

      const targets =
        status === "PRESENT"
          ? roster.filter((s) => marks[scheduleId]?.[s.studentId] !== "PRESENT")
          : roster.filter((s) => marks[scheduleId]?.[s.studentId]);
      if (targets.length === 0) return;

      setBulkSaving(true);
      targets.forEach((s) =>
        setLocalMark(scheduleId, s.studentId, status === "PRESENT" ? status : null)
      );

      if (!apiAvailable) {
        setBulkSaving(false);
        return;
      }

      try {
        const res = await InstructorAttendanceApi.markAttendancePut(Number(scheduleId), {
          staffId,
          entries: targets.map((student) => ({
            studentId: student.studentId,
            status,
          })),
        });
        mergeSummary(scheduleId, res?.data ?? {});
        toast.success(
          status === "PRESENT"
            ? `Marked ${targets.length} student${targets.length > 1 ? "s" : ""} as attended.`
            : `Cleared ${targets.length} mark${targets.length > 1 ? "s" : ""}.`
        );
      } catch (err) {
        console.error("Failed to save attendance", err);
        // A partial bulk write leaves the counts uncertain, so re-read and let
        // the server state win.
        await loadSession(scheduleId);
        toast.error("Could not save attendance for this session.");
      } finally {
        setBulkSaving(false);
      }
    },
    [
      activeScheduleId,
      apiAvailable,
      bulkSaving,
      loadSession,
      marks,
      mergeSummary,
      roster,
      setLocalMark,
      staffId,
    ]
  );

  const handleMarkAll = () => bulkMark("PRESENT");
  const handleReset = () => bulkMark("UNMARKED");

  const handleClassChange = useCallback(
    (id) => {
      setSelectedClassId(id);
      setSearch("");
      setFilter("All");
      resetPending();
    },
    [resetPending]
  );

  // A tab always returns to browsing the whole bucket.
  const handleScheduleFilter = (value) => {
    setScheduleFilter(value);
    setDateKey(null);
    setSelectedClassId(null);
    setSearch("");
    setFilter("All");
    resetPending();
  };

  // Selecting a calendar date focuses that day and syncs the tab to the
  // bucket it belongs to.
  const handleDateChange = (next) => {
    setDateKey(next || null);
    if (next) setScheduleFilter(bucketOf(next));
    setSelectedClassId(null);
    setSearch("");
    setFilter("All");
    resetPending();
  };

  const handleStart = () => {
    if (isPastDate) {
      toast.error(
        `${activeClass.code} ran on ${formatDateLong(
          activeClass.dateKey
        )} — attendance for a past session is read-only.`,
        { icon: "🔒" }
      );
      return;
    }
    if (phase === PHASE.upcoming && !isTodaySession) {
      toast.error(
        `${activeClass.code} is scheduled for ${formatDateLong(
          activeClass.dateKey
        )} at ${toTimeLabel(
          activeClass.startTime
        )} — attendance cannot be marked before the class day.`,
        { icon: "🔒" }
      );
      return;
    }
    setStartedClasses((prev) =>
      prev.includes(activeClass.id) ? prev : [...prev, activeClass.id]
    );
    setSearch("");
    setFilter("All");
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 pb-6 sm:gap-4 lg:min-h-0 lg:flex-1 lg:gap-4 lg:overflow-y-auto lg:pb-2 lg:pr-1">
      <MetricCards summaries={summaries} classes={schedules} />

      <ClassStrip
        classes={dateClasses}
        bucketTotal={bucketCounts[scheduleFilter] ?? 0}
        totalClasses={schedules.length}
        bucketCounts={bucketCounts}
        schedulesByDate={schedulesByDate}
        countsByDate={countsByDate}
        loading={loading}
        marks={marks}
        summaries={summaries}
        startedClasses={startedClasses}
        activeId={activeClass?.id}
        filter={scheduleFilter}
        dateKey={dateKey}
        onDateChange={handleDateChange}
        onFilterChange={handleScheduleFilter}
        onSelect={handleClassChange}
      />

      <div className="min-w-0 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex min-w-0 flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-5 lg:p-5 xl:p-6">
          {scheduleError || (!activeClass && !loading) ? (
            <div className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <CalendarDays className="h-6 w-6 text-slate-400" />
              </div>
              <div className="min-w-0 max-w-sm">
                <h3 className="text-sm font-bold text-slate-700">
                  {scheduleError ? "Schedule unavailable" : "No session selected"}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {scheduleError
                    ? "We could not load your scheduled classes. Refresh the page to try again."
                    : "Pick a date on the calendar above to view the sessions scheduled for that day."}
                </p>
              </div>
            </div>
          ) : activeClass ? (
            <>
              <ClassHero
                cls={activeClass}
                studentCount={roster.length || activeClass.studentCount}
                showDate={!dateKey}
              />

              <SessionToolbar
                stats={stats}
                phase={phase}
                isStarted={isStarted}
                isSaved={isSaved}
                saving={bulkSaving}
                onStart={handleStart}
                onMarkAll={handleMarkAll}
                onReset={handleReset}
                isToday={isTodaySession}
                isPastDate={isPastDate}
              />

              {showRoster ? (
                <Roster
                  students={roster}
                  marks={classMarks}
                  search={search}
                  filter={filter}
                  loading={rosterLoading}
                  error={rosterError}
                  readOnly={!isStarted || isPastDate}
                  pendingStudents={pendingStudents}
                  onStatusChange={markStatus}
                  onSearchChange={setSearch}
                  onFilterChange={setFilter}
                />
              ) : (
                <NotStartedState
                  cls={activeClass}
                  studentCount={roster.length || activeClass.studentCount}
                  phase={phase}
                  isToday={isTodaySession}
                  onStart={handleStart}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}