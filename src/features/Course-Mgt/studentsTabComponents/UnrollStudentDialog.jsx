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
  Loader2,
  BookOpen,
  LayoutGrid,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  CheckCircle2,
  UserMinus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { enrollmentApi } from "@/api/enrollment-controller";
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
    border: "border-emerald-300",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  ONGOING: {
    label: "Ongoing",
    chip: "bg-blue-50 text-blue-600 border-blue-200",
    border: "border-blue-300",
    iconBg: "bg-blue-100 text-blue-600",
  },
  COMPLETED: {
    label: "Completed",
    chip: "bg-red-50 text-red-600 border-red-200",
    border: "border-red-200",
    iconBg: "bg-red-100 text-red-500",
  },
  UNKNOWN: {
    label: "N/A",
    chip: "bg-slate-100 text-slate-500 border-slate-200",
    border: "border-slate-200",
    iconBg: "bg-slate-100 text-slate-500",
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

function formatEnrollDate(dateStr) {
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

const UnrollStudentDialog = ({ student, open, onOpenChange, onUnenrolled }) => {
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["unrollEnrollments", student?.studentId],
    queryFn: async () => {
      const res = await enrollmentApi.getEnrollmentsByStudent(student.studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 15 * 1000,
  });

  const { data: enrolledBatches = [] } = useQuery({
    queryKey: ["unrollBatches", student?.studentId],
    queryFn: async () => {
      const res = await enrollmentBatchApi.getEnrolledBatchesByStudentId(student.studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 15 * 1000,
  });

  const {
    data: programGroups = [],
    isLoading: programGroupsLoading,
  } = useQuery({
    queryKey: ["unrollProgramBatches", selectedProgram?.id],
    queryFn: async () => {
      const courseList = selectedProgram?.courses ?? [];
      const results = await Promise.all(
        courseList.map(async (course) => {
          const id = course?.courseId;
          if (!id) return { courseId: id, courseTitle: course?.courseTitle, batches: [] };
          try {
            const res = await cAdminControllerApi.getClassesByCourse(id);
            const batches = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
            return { courseId: id, courseTitle: course?.courseTitle, batches };
          } catch (err) {
            console.error(err);
            return { courseId: id, courseTitle: course?.courseTitle, batches: [] };
          }
        })
      );
      return results;
    },
    enabled: open && Boolean(selectedProgram?.id),
    staleTime: 2 * 60 * 1000,
  });

  const viewableProgramGroups = useMemo(
    () =>
      programGroups
        .map((group) => ({
          ...group,
          batches: (group.batches || []).filter((b) => getBatchStatus(b) !== "COMPLETED"),
        }))
        .filter((group) => group.batches.length > 0),
    [programGroups]
  );

  const assignedMap = useMemo(() => {
    const map = {};
    enrolledBatches.forEach((eb) => {
      if (!map[eb.courseId]) map[eb.courseId] = [];
      map[eb.courseId].push(eb);
    });
    return map;
  }, [enrolledBatches]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["unrollEnrollments", student?.studentId] });
    await queryClient.invalidateQueries({ queryKey: ["unrollBatches", student?.studentId] });
  };

  const confirmPrompt = (title, text) =>
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, unenroll",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg font-medium px-4 py-2",
        cancelButton: "rounded-lg font-medium px-4 py-2",
      },
    });

  function hasEnrollments(list) {
    return (list ?? []).length > 0;
  }

  const handleClose = () => {
    setSelectedProgram(null);
    onOpenChange(false);
  };

  const handleUnenrollCourse = async (enrollment) => {
    const result = await confirmPrompt(
      "Unenroll student?",
      `Remove ${student.firstNm} ${student.lastNm} from the course "${enrollment.courseTitle}"? This cannot be undone.`
    );
    if (!result.isConfirmed) return;
    try {
      await enrollmentApi.deleteEnrollment(enrollment.id);
      toast.success("Student unenrolled from course");
      await refresh();
      if (!hasEnrollments(enrollments.filter((e) => e.id !== enrollment.id))) {
        handleClose();
      }
      onUnenrolled?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Unenroll failed");
    }
  };

  const handleUnenrollProgram = async (enrollment) => {
    const result = await confirmPrompt(
      "Unenroll from program?",
      `Remove ${student.firstNm} ${student.lastNm} from the program "${enrollment.programName}"? All of its batch enrollments will also be removed.`
    );
    if (!result.isConfirmed) return;
    try {
      await enrollmentApi.deleteEnrollment(enrollment.id);
      toast.success("Student unenrolled from program");
      setSelectedProgram(null);
      await refresh();
      if (!hasEnrollments(enrollments.filter((e) => e.id !== enrollment.id))) {
        handleClose();
      }
      onUnenrolled?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Unenroll failed");
    }
  };

  const handleRemoveFromBatch = async (enrollmentBatchId, batchInfo) => {
    const result = await confirmPrompt(
      "Remove from batch?",
      `Remove ${student.firstNm} ${student.lastNm} from the batch "${batchInfo}"?`
    );
    if (!result.isConfirmed) return;
    try {
      await enrollmentBatchApi.removeStudentFromBatch(enrollmentBatchId);
      toast.success("Student removed from batch");
      await queryClient.invalidateQueries({ queryKey: ["unrollBatches", student?.studentId] });
      onUnenrolled?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to remove student from batch");
    }
  };

  if (!student || !open) {
    return null;
  }

  const isProgramView = Boolean(selectedProgram);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-red-600" />
            {isProgramView ? "Program Batch Enrollments" : "Unroll Student"}
          </DialogTitle>
          <DialogDescription>
            {isProgramView ? (
              <>
                Batches for the program{" "}
                <span className="font-medium text-slate-800">{selectedProgram.programName}</span>
              </>
            ) : (
              <>
                Remove{" "}
                <span className="font-medium text-slate-800">
                  {student.firstNm} {student.lastNm}
                </span>{" "}
                ({student.studentId}) from enrollments
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isProgramView ? (
          <ProgramBatchesView
            program={selectedProgram}
            groups={viewableProgramGroups}
            loading={programGroupsLoading}
            assignedMap={assignedMap}
            onRemoveFromBatch={handleRemoveFromBatch}
            onUnenrollProgram={handleUnenrollProgram}
            onBack={() => setSelectedProgram(null)}
            onClose={handleClose}
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading enrollments…</span>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-sm text-slate-500">No enrollments for this student</p>
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="mt-1 space-y-2">
            {enrollments.map((enrollment) =>
              enrollment.enrollmentType === "PROGRAM" ? (
                <ProgramEnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onViewBatches={() => setSelectedProgram(enrollment)}
                  onUnroll={handleUnenrollProgram}
                />
              ) : (
                <CourseEnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onUnroll={handleUnenrollCourse}
                />
              )
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function CourseEnrollmentCard({ enrollment, onUnroll }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <BookOpen className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-slate-900">
          {enrollment.courseTitle || "Course"}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{enrollment.courseId}</span>
          <Badge
            variant="outline"
            className="rounded-full border bg-blue-50 px-2 py-0.5 text-xs text-blue-600 border-blue-200"
          >
            Course
          </Badge>
          <span>Enrolled {formatEnrollDate(enrollment.enrollmentDate)}</span>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onUnroll(enrollment)}
        className="shrink-0 border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" /> Unenroll
      </Button>
    </div>
  );
}

function ProgramEnrollmentCard({ enrollment, onViewBatches, onUnroll }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
        <LayoutGrid className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-slate-900">
          {enrollment.programName || "Program"}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{enrollment.programId}</span>
          <Badge
            variant="outline"
            className="rounded-full border bg-violet-50 px-2 py-0.5 text-xs text-violet-600 border-violet-200"
          >
            Program
          </Badge>
          <span>{enrollment.courses?.length || 0} courses · Enrolled{" "}
            {formatEnrollDate(enrollment.enrollmentDate)}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onViewBatches(enrollment)}
          className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <CalendarDays className="mr-1 h-3.5 w-3.5" /> View batches
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onUnroll(enrollment)}
          className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" /> Unenroll
        </Button>
      </div>
    </div>
  );
}

function ProgramBatchesView({
  program,
  groups,
  loading,
  assignedMap,
  onRemoveFromBatch,
  onUnenrollProgram,
  onBack,
  onClose,
}) {
  return (
    <div className="mt-1">
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-slate-500 hover:bg-slate-100"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <span className="font-medium text-slate-800">{program.programName}</span>
        <span className="flex items-center gap-1 text-xs">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Upcoming
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading batches…</span>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <CalendarDays className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">No batches available for this program</p>
        </div>
      ) : (
        <div className="max-h-[380px] space-y-4 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.courseId} className="space-y-2">
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {group.courseTitle || group.courseId}
              </div>
              {group.batches.map((batch) => {
                const status = getBatchStatus(batch);
                const meta = BATCH_META[status];
                const assigned = (assignedMap[group.courseId] || []).find(
                  (eb) => eb.batchId === batch.batchId
                );
                return (
                  <div
                    key={batch.batchId}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      assigned ? "border-emerald-300 bg-emerald-50/50" : meta.border
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.iconBg}`}
                    >
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">
                          Batch #{batch.batchId}
                        </span>
                        {batch.batchName && (
                          <span className="text-sm text-slate-500">{batch.batchName}</span>
                        )}
                        <Badge
                          variant="outline"
                          className={`rounded-full border px-2 py-0.5 text-xs ${meta.chip}`}
                        >
                          {meta.label}
                        </Badge>
                        {assigned && (
                          <Badge
                            variant="outline"
                            className="rounded-full border bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 border-emerald-200"
                          >
                            <CheckCircle2 className="mr-0.5 h-3 w-3" /> Assigned
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarRange className="h-3.5 w-3.5" />
                          {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
                        </span>
                        <span>{batch.totalSchedulesGenerated ?? 0} schedules</span>
                      </div>
                    </div>

                    {assigned ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onRemoveFromBatch(assigned.id, `#${batch.batchId} ${batch.batchName || ""}`)
                        }
                        className="shrink-0 border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                      </Button>
                    ) : (
                      <span className="shrink-0 text-xs text-slate-400">Not enrolled</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onUnenrollProgram(program)}
          className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" /> Unenroll from program
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default UnrollStudentDialog;