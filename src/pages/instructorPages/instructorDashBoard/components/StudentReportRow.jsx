import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  REPORT_PROGRESS_STYLES,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_STYLES,
  formatLastActive,
  getInitials,
} from "../reportsData";

function ProgressBar({ value, status, className }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full", REPORT_PROGRESS_STYLES[status])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge className={cn("rounded-full px-2.5", REPORT_STATUS_STYLES[status])}>
      {REPORT_STATUS_LABELS[status]}
    </Badge>
  );
}

function StudentIdentity({ student }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
        {getInitials(student.name)}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight text-slate-800">{student.name}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{student.batch}</p>
      </div>
    </div>
  );
}

const scoreText = (score) => (score == null ? "—" : `${score}%`);

/** Desktop / tablet table row. */
export function StudentReportTableRow({ student, onOpen }) {
  return (
    <tr
      tabIndex={0}
      onClick={() => onOpen(student.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(student.id);
        }
      }}
      className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
    >
      <td className="py-3.5 pl-5 pr-3">
        <StudentIdentity student={student} />
      </td>
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2.5">
          <ProgressBar value={student.progress} status={student.status} className="w-16" />
          <span className="text-xs text-slate-500">{student.progress}%</span>
        </div>
      </td>
      <td className="px-3 py-3.5 text-sm text-slate-600">
        {student.tasksDone}/{student.tasksTotal}
      </td>
      <td className="px-3 py-3.5 text-sm font-semibold text-slate-800">
        {scoreText(student.avgScore)}
      </td>
      <td className="px-3 py-3.5 text-sm text-slate-600">{student.attendance}%</td>
      <td className="whitespace-nowrap px-3 py-3.5 text-sm text-slate-500">
        {formatLastActive(student.lastActiveDays)}
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={student.status} />
      </td>
      <td className="py-3.5 pl-1 pr-4 text-slate-300">
        <ChevronRight className="h-4 w-4" />
      </td>
    </tr>
  );
}

/** Phone layout: one card per student. */
export function StudentReportCard({ student, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(student.id)}
      className="flex w-full flex-col gap-3 border-b border-slate-100 px-4 py-4 text-left transition-colors last:border-0 hover:bg-slate-50"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <StudentIdentity student={student} />
        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={student.status} />
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </div>
      </div>

      <div className="flex w-full items-center gap-2.5">
        <ProgressBar value={student.progress} status={student.status} className="flex-1" />
        <span className="text-xs text-slate-500">{student.progress}%</span>
      </div>

      <dl className="grid w-full grid-cols-4 gap-2 text-center">
        {[
          ["Tasks", `${student.tasksDone}/${student.tasksTotal}`],
          ["Score", scoreText(student.avgScore)],
          ["Attend.", `${student.attendance}%`],
          ["Active", formatLastActive(student.lastActiveDays)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 px-1 py-1.5">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-0.5 truncate text-xs font-semibold text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </button>
  );
}

export { ProgressBar, StatusBadge };
