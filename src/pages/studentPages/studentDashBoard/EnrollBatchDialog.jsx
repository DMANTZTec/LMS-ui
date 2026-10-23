import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Layers,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import { enrollmentBatchApi } from "@/api/enrollment-batch-controller";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EnrollBatchDialog({ course, open, onOpenChange, onEnrolled }) {
  const queryClient = useQueryClient();
  const [enrolledBatchId, setEnrolledBatchId] = useState(null);

  const courseId = course?.courseId;
  const enrollmentId = course?.enrollmentId;
  const courseName = course?.courseName || courseId;

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["courseUpcomingBatches", courseId],
    queryFn: async () => {
      const res = await cAdminControllerApi.getBatchSummariesByCourse(courseId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(courseId),
    staleTime: 2 * 60 * 1000,
  });

  const upcomingBatches = useMemo(() => {
    const now = new Date();
    return batches
      .filter((batch) => batch?.status !== "CANCELLED")
      .filter((batch) => batch?.startDate && new Date(batch.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [batches]);

  const mutation = useMutation({
    mutationFn: (batchId) =>
      enrollmentBatchApi.assignStudentToBatch({ enrollmentId, batchId }),
    onSuccess: async (_res, batchId) => {
      setEnrolledBatchId(batchId);
      toast.success("Enrolled in batch successfully");
      await queryClient.invalidateQueries({ queryKey: ["myCourses"] });
      onEnrolled?.();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Enrollment failed. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Enrollment failed. Please try again.");
    },
  });

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#155DFC]" />
            Enroll in a Batch
          </DialogTitle>
          <DialogDescription>
            Choose an upcoming batch to start{" "}
            <span className="font-medium text-foreground">{courseName}</span>.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading batches…</span>
          </div>
        ) : upcomingBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <CalendarClock className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-foreground">No upcoming batches</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              There are no upcoming batches for this course right now. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {upcomingBatches.map((batch) => {
              const isEnrolled = enrolledBatchId === batch.batchId;
              const isThisPending =
                mutation.isPending && mutation.variables === batch.batchId;

              return (
                <div
                  key={batch.batchId}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
                    isEnrolled
                      ? "border-emerald-300 bg-emerald-50/50"
                      : "hover:border-[#155DFC]/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <CalendarDays className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {batch.batchName || `Batch #${batch.batchId}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Batch #{batch.batchId}
                        </p>
                      </div>
                    </div>

                    <Badge className="border-0 bg-emerald-100 text-[10px] text-emerald-700">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarRange className="h-3.5 w-3.5" />
                      {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      {batch.scheduleCount ?? 0} sessions
                    </span>
                  </div>

                  <Button
                    size="sm"
                    disabled={isEnrolled || isThisPending || !enrollmentId}
                    onClick={() => mutation.mutate(batch.batchId)}
                    variant={isEnrolled ? "outline" : "default"}
                    className={`mt-auto h-8 w-full text-xs shadow-none ${
                      isEnrolled
                        ? ""
                        : "bg-[#155DFC] hover:bg-[#1149c8]"
                    }`}
                  >
                    {isThisPending ? (
                      <>
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Enrolling…
                      </>
                    ) : isEnrolled ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Enrolled
                      </>
                    ) : (
                      "Enroll"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            {enrolledBatchId ? "Done" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
