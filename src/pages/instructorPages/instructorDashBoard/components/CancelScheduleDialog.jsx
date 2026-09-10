import { useState } from "react";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import toast from "react-hot-toast";

export default function CancelScheduleDialog({
  scheduleId,
  course,
  date,
  time,
  batchName,
  onCancelled,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cAdminControllerApi.cancelSchedule(scheduleId);
      toast.success(`Schedule for "${course}" cancelled successfully.`);
      setIsOpen(false);
      if (onCancelled) onCancelled();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel schedule.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button
            size="icon"
            variant="ghost"
            title="Cancel Schedule"
            className="h-6 w-6 rounded-md bg-rose-50 text-rose-500 hover:bg-rose-100"
            aria-label={`Cancel ${course}`}
          >
            <XCircle className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md w-[90vw] p-6 rounded-xl border border-slate-200 bg-white shadow-2xl gap-0 flex flex-col">
        <div className="flex items-start gap-4 pb-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full border border-red-100 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
                Cancel Schedule
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel this schedule? This action cannot
              be undone.
            </p>
          </div>
        </div>

        <div className="my-2 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5 font-sans">
          <div className="flex justify-between">
            <span className="text-slate-400">Course:</span>
            <span className="font-semibold text-slate-800">{course || "N/A"}</span>
          </div>
          {batchName && (
            <div className="flex justify-between">
              <span className="text-slate-400">Batch:</span>
              <span className="font-semibold text-slate-800">{batchName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Date:</span>
            <span className="font-semibold text-slate-800">{date || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time:</span>
            <span className="font-semibold text-slate-800">{time || "N/A"}</span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-2.5">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isCancelling}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium px-4 h-9 shadow-sm"
            >
              Keep Schedule
            </Button>
          </DialogClose>

          <Button
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 h-9 shadow-sm shadow-red-600/10 transition-all flex items-center justify-center min-w-[100px]"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
