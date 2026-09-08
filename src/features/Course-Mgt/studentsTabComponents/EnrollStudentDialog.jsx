import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  BookOpen,
  LayoutGrid,
  GraduationCap,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/CourseMgtController";
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

const EnrollStudentDialog = ({ student, open, onOpenChange, onEnrolled }) => {
  const queryClient = useQueryClient();
  const [programTitle, setProgramTitle] = useState(null);
  const [search, setSearch] = useState("");

  const [step, setStep] = useState("select");
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [enrollType, setEnrollType] = useState(null);
  const [enrollCourseId, setEnrollCourseId] = useState(null);
  const [programCourses, setProgramCourses] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assigningBatchId, setAssigningBatchId] = useState(null);
  const [assignedBatches, setAssignedBatches] = useState({});

  const { data: existingEnrollments = [] } = useQuery({
    queryKey: ["studentEnrollments", student?.studentId],
    queryFn: async () => {
      const res = await enrollmentApi.getEnrollmentsByStudent(student.studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 30 * 1000,
  });

  const enrolledCourseIds = useMemo(
    () =>
      new Set(
        existingEnrollments
          .filter((e) => e?.enrollmentType === "COURSE" || e?.courseId)
          .map((e) => e.courseId)
          .filter(Boolean)
      ),
    [existingEnrollments]
  );

  const enrolledProgramIds = useMemo(
    () =>
      new Set(
        existingEnrollments
          .filter((e) => e?.enrollmentType === "PROGRAM" && e?.programId)
          .map((e) => e.programId)
          .filter(Boolean)
      ),
    [existingEnrollments]
  );

  const enrolledProgramCourseIds = useMemo(() => {
    const courseSet = new Set(
      existingEnrollments
        .filter((e) => e?.enrollmentType === "PROGRAM")
        .flatMap((e) => (e?.courses || []).map((c) => c?.courseId))
        .filter(Boolean)
    );
    return courseSet;
  }, [existingEnrollments]);

  const isCourseEnrolled = (courseId) =>
    enrolledCourseIds.has(courseId) || enrolledProgramCourseIds.has(courseId);

  const { data: enrolledBatches = [] } = useQuery({
    queryKey: ["studentBatches", student?.studentId],
    queryFn: async () => {
      const res = await enrollmentBatchApi.getEnrolledBatchesByStudentId(student.studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && Boolean(student?.studentId),
    staleTime: 30 * 1000,
  });

  const enrolledBatchIds = useMemo(
    () => new Set(enrolledBatches.map((b) => b?.batchId).filter(Boolean)),
    [enrolledBatches]
  );

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["enrollDialogCourses"],
    queryFn: async () => {
      const res = await api.viewAllCourses();
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && step === "select",
    staleTime: 2 * 60 * 1000,
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ["enrollDialogPrograms"],
    queryFn: async () => {
      const res = await api.getAllPrograms();
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: open && step === "select",
    staleTime: 2 * 60 * 1000,
  });

  const loading = coursesLoading || programsLoading;

  const filteredCourses = courses.filter((c) =>
    (c.courseTitle || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredPrograms = programs.filter((p) =>
    (p.programTitle || "").toLowerCase().includes(search.toLowerCase())
  );

  const batchQuery = useQuery({
    queryKey: ["enrollBatches", enrollCourseId],
    queryFn: async () => {
      const res = await cAdminControllerApi.getClassesByCourse(enrollCourseId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled:
      step === "batches" &&
      enrollType === "COURSE" &&
      Boolean(enrollCourseId),
    staleTime: 2 * 60 * 1000,
  });

  const handleEnrollCourse = async (courseId) => {
    setIsEnrolling(true);
    try {
      const enrollmentResponse = await enrollmentApi.createEnrollment({
        studentId: student.studentId,
        courseId,
        programId: null,
      });
      const data = enrollmentResponse?.data ?? enrollmentResponse;
      const newEnrollmentId = data?.id ?? data?.enrollmentId;
      setEnrollmentId(newEnrollmentId);
      setEnrollCourseId(courseId);
      setEnrollType("COURSE");
      setViewMode(false);
      setStep("batches");
      await queryClient.invalidateQueries({
        queryKey: ["studentEnrollments", student?.studentId],
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Enrollment failed";
      toast.error(typeof msg === "string" ? msg : "Enrollment failed");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnrollProgram = async (programId) => {
    if (!programId) {
      toast.error("Select a program");
      return;
    }
    setIsEnrolling(true);
    try {
      await enrollmentApi.createEnrollment({
        studentId: student.studentId,
        courseId: null,
        programId,
      });
      await queryClient.invalidateQueries({
        queryKey: ["studentEnrollments", student?.studentId],
      });
      toast.success("Program enrolled successfully");
      onEnrolled?.();
      handleClose();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Enrollment failed";
      toast.error(typeof msg === "string" ? msg : "Enrollment failed");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleAssign = async (batchId) => {
    setIsAssigning(true);
    setAssigningBatchId(batchId);
    try {
      await enrollmentBatchApi.assignStudentToBatch({ enrollmentId, batchId });
      setAssignedBatches((prev) => ({ ...prev, [batchId]: true }));
      await queryClient.invalidateQueries({ queryKey: ["studentBatches", student?.studentId] });
      toast.success("Student assigned to batch successfully");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Batch assignment failed";
      toast.error(typeof msg === "string" ? msg : "Batch assignment failed");
    } finally {
      setIsAssigning(false);
      setAssigningBatchId(null);
    }
  };

  const setEnrolledCourse = (courseId) => {
    let existing = existingEnrollments.find(
      (e) => e.enrollmentType === "COURSE" && e.courseId === courseId
    );
    if (!existing) {
      existing = existingEnrollments.find(
        (e) =>
          e.enrollmentType === "PROGRAM" &&
          (e.courses || []).some((c) => c?.courseId === courseId)
      );
    }
    setProgramTitle(null);
    setEnrollmentId(existing?.id ?? null);
    setEnrollType("COURSE");
    setEnrollCourseId(courseId);
    setProgramCourses([]);
    setViewMode(true);
    setStep("batches");
  };

  const allBatches = useMemo(() => {
    let list = [];
    if (enrollType === "COURSE") {
      list = (batchQuery.data ?? []).map((b) => ({
        ...b,
        _courseTitle: courses.find((c) => c.courseId === enrollCourseId)?.courseTitle,
        _courseId: enrollCourseId,
      }));
    } else {
      programCourses.forEach((group) => {
        (group.batches || []).forEach((b) => {
          list.push({
            ...b,
            _courseTitle: group.courseTitle,
            _courseId: group.courseId,
          });
        });
      });
    }
    return list.filter((b) => getBatchStatus(b) !== "COMPLETED");
  }, [enrollType, batchQuery.data, programCourses, courses, enrollCourseId]);

  const loadingBatches =
    (enrollType === "COURSE" && batchQuery.isLoading) ||
    (enrollType === "PROGRAM" &&
      programCourses.some((g) => Array.isArray(g.batches) && g.batches.length === 0) &&
      !programCourses.every((g) => Array.isArray(g.batches)));

  const handleClose = () => {
    setStep("select");
    setEnrollmentId(null);
    setEnrollType(null);
    setEnrollCourseId(null);
    setProgramCourses([]);
    setAssignedBatches({});
    setSearch("");
    setProgramTitle(null);
    setAssigningBatchId(null);
    setViewMode(false);
    onOpenChange(false);
  };

  if (!student || !open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="md:max-w-[820px] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            {step === "select"
              ? "Enroll Student"
              : viewMode
              ? "Course Batches"
              : "Select Batch"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" ? (
              <>
                Select a course or program to enroll{" "}
                <span className="font-medium text-slate-800">
                  {student.firstNm} {student.lastNm}
                </span>{" "}
                ({student.studentId})
              </>
            ) : (
              <>
                {viewMode
                  ? "Choose a batch for the enrolled course"
                  : "Select a batch to assign"}{" "}
                <span className="font-medium text-slate-800">
                  {student.firstNm} {student.lastNm}
                </span>{" "}
                ({student.studentId})
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or programs..."
                className="pl-9"
              />
            </div>

            <Tabs
              defaultValue="courses"
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courses">
                  <BookOpen className="mr-1 h-4 w-4" /> Courses
                </TabsTrigger>
                <TabsTrigger value="programs">
                  <LayoutGrid className="mr-1 h-4 w-4" /> Programs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-3">
                <div className="max-h-[300px] overflow-y-auto rounded-md border">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    filteredCourses.map((course) => {
                      const alreadyEnrolled = isCourseEnrolled(course.courseId);
                      return (
                        <div
                          key={course.courseId}
                          className="flex items-center gap-3 border-b p-3 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{course.courseTitle}</div>
                            <div className="text-xs text-gray-500">
                              {course.courseId}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={alreadyEnrolled ? "outline" : "default"}
                            disabled={isEnrolling}
                            className="shrink-0"
                            onClick={() =>
                              alreadyEnrolled
                                ? setEnrolledCourse(course.courseId)
                                : handleEnrollCourse(course.courseId)
                            }
                          >
                            {isEnrolling && !alreadyEnrolled ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : null}
                            {alreadyEnrolled ? "View batches" : "Enroll"}
                          </Button>
                        </div>
                      );
                    })
                  )}
                  {!loading && filteredCourses.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-400">
                      No courses found
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="programs" className="mt-3">
                <div className="max-h-[300px] overflow-y-auto rounded-md border">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    filteredPrograms.map((program) => {
                      const alreadyEnrolled = enrolledProgramIds.has(program.programId);
                      return (
                        <div
                          key={program.programId}
                          className="flex items-center gap-3 border-b p-3 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{program.programTitle}</div>
                            <div className="text-xs text-gray-500">
                              {program.programId} · {program.coursesList?.length || 0}{" "}
                              courses
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={alreadyEnrolled ? "outline" : "default"}
                            disabled={isEnrolling || alreadyEnrolled}
                            className="shrink-0"
                            onClick={() => handleEnrollProgram(program.programId)}
                          >
                            {isEnrolling && !alreadyEnrolled ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : null}
                            {alreadyEnrolled ? "Enrolled" : "Enroll"}
                          </Button>
                        </div>
                      );
                    })
                  )}
                  {!loading && filteredPrograms.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-400">
                      No programs found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <BatchSelection
            enrollType={enrollType}
            allBatches={allBatches}
            loading={loadingBatches}
            isAssigning={isAssigning}
            assigningBatchId={assigningBatchId}
            assignedBatches={assignedBatches}
            onAssign={handleAssign}
            programName={programTitle}
            enrollmentId={enrollmentId}
            enrolledBatchIds={enrolledBatchIds}
            onBack={() => setStep("select")}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

function BatchSelection({
  enrollType,
  allBatches,
  loading,
  isAssigning,
  assigningBatchId,
  assignedBatches,
  onAssign,
  programName,
  enrollmentId,
  enrolledBatchIds,
  onBack,
  onClose,
}) {
  return (
    <div className="mt-1">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-500 hover:bg-slate-100"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <span className="font-medium text-slate-800">
            {enrollType === "PROGRAM" ? programName : "Course"} batches
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Upcoming
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Ongoing
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading batches…</span>
        </div>
      ) : allBatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <CalendarClock className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">No batches available</p>
        </div>
      ) : (
        <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
          {enrollType === "PROGRAM" ? (
            programName && (
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {programName}
              </div>
            )
          ) : null}
          {allBatches.map((batch) => {
            const status = getBatchStatus(batch);
            const meta = BATCH_META[status];
            const alreadyEnrolledBatch = enrolledBatchIds.has(batch.batchId);
            const isAssigned = assignedBatches[batch.batchId] || alreadyEnrolledBatch;
            const isAssigningThis = isAssigning && assigningBatchId === batch.batchId;

            return (
              <div
                key={batch.batchId}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  isAssigned ? "border-emerald-300 bg-emerald-50/50" : meta.border
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.iconBg}`}
                >
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  {batch._courseTitle && (
                    <div className="truncate text-xs text-slate-500">
                      {batch._courseTitle}
                    </div>
                  )}
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
                    {isAssigned && (
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
                    <span>
                      {batch.totalSchedulesGenerated ?? 0} schedules
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={isAssigned ? "outline" : "default"}
                  disabled={isAssigningThis || isAssigned || !enrollmentId}
                  onClick={() => onAssign(batch.batchId)}
                  className="shrink-0"
                >
                  {isAssigningThis ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : isAssigned ? (
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
        <Button variant="outline" onClick={onClose}>
          <ChevronRight className="mr-1 h-4 w-4" /> Done
        </Button>
      </div>
    </div>
  );
}

export default EnrollStudentDialog;
