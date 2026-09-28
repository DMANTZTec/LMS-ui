import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  ArrowLeftRight,
  Loader2,
  CalendarDays,
  CalendarRange,
  Layers,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/api/CourseMgtController";
import { enrollmentBatchApi } from "@/api/enrollment-batch-controller";
import { cAdminControllerApi } from "@/api/class-admin-controller";

const getBatchStatus = (batch) => {
  const now = new Date();
  const start = batch?.startDate ? new Date(batch.startDate) : null;
  const end = batch?.endDate ? new Date(batch.endDate) : null;
  if (!start || !end) return "UNKNOWN";
  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ONGOING";
  return "COMPLETED";
};

const BATCH_META = {
  UPCOMING: {
    label: "Upcoming",
    chip: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ONGOING: {
    label: "Ongoing",
    chip: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    chip: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  UNKNOWN: {
    label: "N/A",
    chip: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-300",
  },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAssignedDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SwitchBatchDialog = ({ student, open, onOpenChange, onSwitched }) => {
  const queryClient = useQueryClient();
  const [targetBatchId, setTargetBatchId] = useState({});
  const [switchingId, setSwitchingId] = useState(null);
  const [pendingSwitch, setPendingSwitch] = useState(null);

  const { data: enrolledBatches = [], isLoading: batchesLoading } = useQuery({
    queryKey: ["switchBatches", student?.studentId],
    queryFn: async () => {
      const res = await enrollmentBatchApi.getEnrolledBatchesByStudentId(student.studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 15 * 1000,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["switchCourses"],
    queryFn: async () => {
      const res = await api.viewAllCourses();
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 2 * 60 * 1000,
  });

  const courseTitleMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.courseId] = c.courseTitle;
    });
    return map;
  }, [courses]);

  const assignedCourseIds = useMemo(
    () => new Set(enrolledBatches.map((eb) => eb?.courseId).filter(Boolean)),
    [enrolledBatches]
  );

  const courseBatchesQuery = useQuery({
    queryKey: ["switchBatchOptions", Array.from(assignedCourseIds).sort().join(",")],
    queryFn: async () => {
      const results = {};
      await Promise.all(
        Array.from(assignedCourseIds).map(async (courseId) => {
          try {
            const res = await cAdminControllerApi.getClassesByCourse(courseId);
            results[courseId] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          } catch (err) {
            console.error(err);
            results[courseId] = [];
          }
        })
      );
      return results;
    },
    enabled: open && assignedCourseIds.size > 0,
    staleTime: 2 * 60 * 1000,
  });

  const alumniOfCourse = (courseId) =>
    new Set(
      enrolledBatches
        .filter((eb) => eb?.courseId === courseId && eb?.batchId)
        .map((eb) => eb.batchId)
    );

  const batchesByCourse = (courseId) => courseBatchesQuery.data?.[courseId] ?? [];

  const switchableOptions = (courseId) =>
    batchesByCourse(courseId)
      .filter((b) => getBatchStatus(b) !== "COMPLETED")
      .filter((b) => !alumniOfCourse(courseId).has(b.batchId));

  const currentBatchInfo = (eb) =>
    batchesByCourse(eb.courseId).find((b) => b.batchId === eb.batchId);

  const handleClose = () => {
    setTargetBatchId({});
    setSwitchingId(null);
    setPendingSwitch(null);
    onOpenChange(false);
  };

  const requestSwitch = (enrollmentBatch) => {
    const toBatchId = targetBatchId[enrollmentBatch.id];
    if (!toBatchId) {
      toast.error("Select a new batch first");
      return;
    }
    const target = (courseBatchesQuery.data?.[enrollmentBatch.courseId] ?? []).find(
      (b) => b.batchId === Number(toBatchId)
    );
    setPendingSwitch({ enrollmentBatch, toBatchId, target });
  };

  const cancelSwitch = () => {
    setPendingSwitch(null);
  };

  const confirmSwitch = async () => {
    if (!pendingSwitch) return;
    const { enrollmentBatch, toBatchId } = pendingSwitch;
    setSwitchingId(enrollmentBatch.id);
    try {
      await enrollmentBatchApi.switchStudentBatch({
        enrollmentId: enrollmentBatch.enrollmentId,
        fromBatchId: enrollmentBatch.batchId,
        toBatchId: Number(toBatchId),
      });
      setTargetBatchId((prev) => ({ ...prev, [enrollmentBatch.id]: null }));
      setPendingSwitch(null);
      await queryClient.invalidateQueries({ queryKey: ["switchBatches", student?.studentId] });
      toast.success("Student moved to the new batch successfully");
      onSwitched?.();
    } catch (err) {
      console.error("[SwitchBatchDialog] API error", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data || err ||
        "Failed to switch batch";
      toast.error(typeof msg === "string" ? msg : "Failed to switch batch");
    } finally {
      setSwitchingId(null);
    }
  };

  if (!student || !open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="md:max-w-[820px] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
            Switch Batch
          </DialogTitle>
          <DialogDescription>
            Move{" "}
            <span className="font-medium text-slate-800">
              {student.firstNm} {student.lastNm}
            </span>{" "}
            ({student.studentId}) from one batch to another
          </DialogDescription>
        </DialogHeader>

        {batchesLoading || coursesLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading batches…</span>
          </div>
        ) : enrolledBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Layers className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">
              No batch assignments for this student yet.
            </p>
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            {pendingSwitch && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1 text-sm text-slate-700">
                    <p className="font-medium text-slate-800">Confirm batch switch</p>
                    <p className="mt-1">
                      Move{" "}
                      <span className="font-medium text-slate-900">
                        {student.firstNm} {student.lastNm}
                      </span>{" "}
                      from{" "}
                      <span className="font-medium text-slate-900">
                        Batch #{pendingSwitch.enrollmentBatch.batchId}
                        {pendingSwitch.enrollmentBatch.batchName
                          ? ` (${pendingSwitch.enrollmentBatch.batchName})`
                          : ""}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-slate-900">
                        Batch #{pendingSwitch.target?.batchId ?? pendingSwitch.toBatchId}
                        {pendingSwitch.target?.batchName
                          ? ` (${pendingSwitch.target.batchName})`
                          : ""}
                      </span>
                      ?
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!!switchingId}
                    onClick={confirmSwitch}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {switchingId ? (
                      <>
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        Switching…
                      </>
                    ) : (
                      "Confirm switch"
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!!switchingId}
                    onClick={cancelSwitch}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          <div className="mt-1 max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {enrolledBatches.map((eb) => {
              const options = switchableOptions(eb.courseId);
              const current = currentBatchInfo(eb);
              const currentStatus = current ? getBatchStatus(current) : null;
              const currentMeta = currentStatus ? BATCH_META[currentStatus] : null;
              const selected = targetBatchId[eb.id];
              const switching = switchingId === eb.id;
              return (
                <div
                  key={eb.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-xs text-slate-500">
                        {courseTitleMap[eb.courseId] || eb.courseId}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">
                          Batch #{eb.batchId}
                        </span>
                        {eb.batchName && (
                          <span className="text-sm text-slate-500">
                            {eb.batchName}
                          </span>
                        )}
                        {currentMeta && (
                          <Badge
                            variant="outline"
                            className={`rounded-full border px-2 py-0.5 text-xs ${currentMeta.chip}`}
                          >
                            <span
                              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${currentMeta.dot}`}
                            />
                            {currentMeta.label}
                          </Badge>
                        )}
                        {/* <Badge
                          variant="outline"
                          className="rounded-full border bg-blue-50 px-2 py-0.5 text-xs text-blue-600 border-blue-200"
                        >
                          <CheckCircle2 className="mr-0.5 h-3 w-3" /> Current
                        </Badge> */}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Assigned {formatAssignedDate(eb.assignedDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      {options.length === 0 ? (
                        <span className="text-xs text-slate-400">
                          No other batches available
                        </span>
                      ) : (
                        <>
                          <select
                            value={selected ?? ""}
                            onChange={(e) =>
                              setTargetBatchId((prev) => ({
                                ...prev,
                                [eb.id]: e.target.value,
                              }))
                            }
                            disabled={switching}
                            className="h-9 w-full min-w-52 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 sm:w-60"
                          >
                            <option value="" disabled>
                              Select new batch…
                            </option>
                            {options.map((b) => (
                                <option key={b.batchId} value={b.batchId}>
                                  Batch #{b.batchId}
                                  {b.batchName ? ` - ${b.batchName}` : ""} ·{" "}
                                  {formatDate(b.startDate)} →{" "}
                                  {formatDate(b.endDate)}
                                </option>
                              ))}
                          </select>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => requestSwitch(eb)}
                            className="w-full sm:w-auto"
                          >
                            {switching ? (
                              <>
                                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                Switching…
                              </>
                            ) : (
                              <>
                                <ArrowLeftRight className="mr-1 h-3.5 w-3.5" />
                                Switch batch
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {current ? (
                        <span className="flex items-center gap-1">
                          <CalendarRange className="h-3.5 w-3.5" />
                          Batch duration: {formatDate(current.startDate)} —{" "}
                          {formatDate(current.endDate)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CalendarRange className="h-3.5 w-3.5" />
                          Batch duration not available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchBatchDialog;