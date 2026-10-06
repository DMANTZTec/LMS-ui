import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthOf = (dateKey) => {
  const base = new Date(`${dateKey}T00:00:00`);
  const safe = Number.isNaN(base.getTime()) ? new Date() : base;
  return new Date(safe.getFullYear(), safe.getMonth(), 1);
};

/**
 * Month grid for the schedule picker. `toDateKey` is shared with the page so a
 * cell and a schedule always resolve to the same day.
 */
function buildMonthCells(viewMonth, toDateKey) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return { key: toDateKey(date), day: i + 1 };
    }),
  ];
}

export default function ScheduleCalendarPopover({
  selectedKey,
  triggerLabel,
  todayKey,
  countsByDate,
  schedulesByDate,
  toDateKey,
  loading,
  disabled,
  onSelectDate,
}) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => monthOf(selectedKey));

  const cells = useMemo(
    () => buildMonthCells(viewMonth, toDateKey),
    [viewMonth, toDateKey]
  );

  // Re-anchor on the selected month each time the calendar opens, so no effect
  // is needed to keep the grid in sync with the selection.
  const handleOpenChange = (next) => {
    setOpen(next);
    if (next) setViewMonth(monthOf(selectedKey));
  };

  const shift = (delta) =>
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );

  const pick = (key) => {
    onSelectDate(key);
    setOpen(false);
  };

  const monthCount = cells.reduce(
    (sum, cell) => sum + (cell ? countsByDate[cell.key] ?? 0 : 0),
    0
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Open schedule calendar"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs"
        >
          <span className="tabular-nums">{triggerLabel ?? selectedKey}</span>
          <span aria-hidden>📅</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="relative w-[17.5rem] gap-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-lg"
      >
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <h4 className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </h4>

          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
          {WEEKDAYS.map((d, i) => (
            <div key={`${d}-${i}`}>{d}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`blank-${i}`} className="h-8" />;

            const { key, day } = cell;
            const daySchedules = schedulesByDate[key] ?? [];
            const hasSchedules = daySchedules.length > 0;
            const isSelected = key === selectedKey;
            // Anything on or before today is history, so it takes the red state.
            const isPast = key <= todayKey;
            const isToday = key === todayKey;
            const showRed = hasSchedules && isPast;
            const showBlue = isSelected || (!showRed && (isToday || (hasSchedules && !isPast)));

            return (
              <button
                key={key}
                type="button"
                onClick={() => pick(key)}
                aria-current={isSelected ? "date" : undefined}
                aria-label={`${day} ${MONTHS[viewMonth.getMonth()]}${
                  hasSchedules ? `, ${daySchedules.length} schedule${
                    daySchedules.length > 1 ? "s" : ""
                  }` : ""
                }`}
                className={cn(
                  "relative flex h-8 flex-col items-center justify-between rounded-lg border p-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
                  showBlue
                    ? "border-[#3B82F6] bg-[#3B82F6] font-bold text-white hover:bg-[#2563EB]"
                    : showRed
                      ? "border-red-200 bg-red-50 font-semibold text-red-700 hover:bg-red-100"
                      : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                <span className="tabular-nums">{day}</span>
                {hasSchedules ? (
                  <span
                    className={cn(
                      "mb-0.5 h-1 w-1 rounded-full",
                      showBlue ? "bg-white" : "bg-red-400"
                    )}
                  />
                ) : (
                  <span className="mb-0.5 h-1 w-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          <span className="truncate text-[10px] font-medium text-slate-400">
            {loading ? (
              "Loading schedules…"
            ) : monthCount > 0
              ? `${monthCount} schedule${monthCount > 1 ? "s" : ""} this month`
              : "No schedules this month"}
          </span>
          {selectedKey !== todayKey && (
            <button
              type="button"
              onClick={() => pick(todayKey)}
              className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
            >
              Today
            </button>
          )}
        </div>

        {loading && (
          <span className="pointer-events-none absolute right-5 top-5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-300" />
          </span>
        )}
      </PopoverContent>
    </Popover>
  );
}