import { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import toast from "react-hot-toast";

export const RescheduleModal = ({
  isOpen,
  onClose,
  scheduleId,
  className: defaultClassName,
  currentDate,
  currentTime,
  onRescheduled,
}) => {
  const [className, setClassName] = useState(defaultClassName || "");
  const [classDate, setClassDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const rescheduleMutation = useMutation({
    mutationFn: (payload) =>
      cAdminControllerApi.rescheduleClass(scheduleId, payload),
    onSuccess: () => {
      toast.success("Class rescheduled successfully");
      setClassName("");
      setClassDate("");
      setStartTime("");
      setEndTime("");
      onRescheduled?.();
      onClose();
    },
    onError: () => {
      toast.error("Failed to reschedule class");
    },
  });

  if (!isOpen) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return `${timeStr}:00`;
  };

  const handleSave = () => {
    if (!className.trim()) {
      toast.error("Class name is required");
      return;
    }
    if (!classDate) {
      toast.error("Please select a date");
      return;
    }
    if (!startTime) {
      toast.error("Please select a start time");
      return;
    }
    if (!endTime) {
      toast.error("Please select an end time");
      return;
    }

    const payload = {
      className: className.trim(),
      classDate,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
    };

    rescheduleMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Reschedule Class
          </h2>
          {currentDate && currentTime && (
            <p className="mt-1 text-xs font-medium text-slate-400">
              Current: {currentDate} &bull; {currentTime}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4 px-6 py-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              New Date
            </label>
            <input
              type="date"
              value={classDate}
              min={today}
              onChange={(e) => setClassDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end gap-2 p-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={rescheduleMutation.isPending}
            className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {rescheduleMutation.isPending ? "Rescheduling..." : "Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
