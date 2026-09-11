import { useState } from "react";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import toast from "react-hot-toast";

export const ScheduleMessageModal = ({
  isOpen,
  onClose,
  scheduleId,
  course,
  date,
  time,
}) => {
  const [edited, setEdited] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["scheduleMessage", scheduleId],
    queryFn: async () => {
      const res = await cAdminControllerApi.getScheduleMessage(scheduleId);
      return res?.data || {};
    },
    enabled: Boolean(scheduleId) && isOpen,
  });

  const message = edited !== null ? edited : data?.message ?? "";

  const saveMutation = useMutation({
    mutationFn: (text) =>
      cAdminControllerApi.addScheduleMessage(scheduleId, { message: text }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduleMessage", scheduleId],
      });
      toast.success("Message sent to students");
      onClose();
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Please enter a message");
      return;
    }
    saveMutation.mutate(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Message Students
          </h2>
          {course && (
            <p className="mt-1 text-xs font-medium text-slate-400">
              {course}
              {date && time ? ` • ${date} • ${time}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-1.5 px-6 py-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Message
          </label>
          {isLoading ? (
            <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 text-sm text-slate-400">
              Loading existing message...
            </div>
          ) : (
            <textarea
              value={message}
              onChange={(e) => setEdited(e.target.value)}
              placeholder="Dear Students, ..."
              className="w-full min-h-[120px] resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          )}
          <p className="text-[11px] text-slate-400">
            This message is sent to students in this class schedule.
          </p>
        </div>

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
            disabled={saveMutation.isPending || isLoading}
            className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {saveMutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMessageModal;