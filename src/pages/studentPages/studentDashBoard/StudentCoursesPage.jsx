import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  GraduationCap,
  Layers,
  Loader2,
  PlayCircle,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { decodeToken } from "@/utils/tokenUtility";
import { dashboardApi } from "@/api/student-dashboard-controller";
import { enrollmentBatchApi } from "@/api/enrollment-batch-controller";
import { cAdminControllerApi } from "@/api/class-admin-controller";
import EnrollBatchDialog from "./EnrollBatchDialog";
import SwitchBatchDialog from "./SwitchBatchDialog";

const STATUS_CONFIG = {
  active: {
    key: "ACTIVE",
    label: "Active",
    badge: "bg-blue-100 text-[#155DFC] border-0",
    bar: "bg-[#155DFC]",
    action: "Start Learning",
    description: "Courses you are currently learning",
  },
  planned: {
    key: "PLANNED",
    label: "Planned",
    badge: "bg-orange-100 text-[#F54900] border-0",
    bar: "bg-[#F54900]",
    action: "Enroll in Batch",
    batchEnroll: true,
    description: "Upcoming courses waiting to begin",
  },
  completed: {
    key: "COMPLETED",
    label: "Completed",
    badge: "bg-green-100 text-[#00A63E] border-0",
    bar: "bg-[#00A63E]",
    action: "Review Course",
    description: "Courses you have finished",
  },
};

const VALID_STATUSES = ["active", "planned", "completed"];

export default function StudentCoursesPage() {
  const { status } = useParams();
  const navigate = useNavigate();
  const studentId = decodeToken()?.userId || null;

  const config = STATUS_CONFIG[status] || null;

  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(Boolean(studentId));
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [batchDetails, setBatchDetails] = useState({});
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [switchCourse, setSwitchCourse] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!studentId) return;

    dashboardApi
      .getMyCourses(studentId)
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || {};
        setCourses(Array.isArray(data.courses) ? data.courses : []);
        setTotal(data.totalCourses ?? 0);
      })
      .catch(() => {
        if (isMounted) setCourses([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studentId, reloadKey]);

  useEffect(() => {
    if (!studentId || status !== "planned") return;
    let isMounted = true;

    enrollmentBatchApi
      .getEnrolledBatchesByStudentId(studentId)
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setEnrolledBatches(data);
      })
      .catch(() => {
        if (isMounted) setEnrolledBatches([]);
      });

    return () => {
      isMounted = false;
    };
  }, [studentId, status, reloadKey]);

  useEffect(() => {
    const courseIds = [
      ...new Set(enrolledBatches.map((eb) => eb?.courseId).filter(Boolean)),
    ];
    if (courseIds.length === 0) return;
    let isMounted = true;

    Promise.all(
      courseIds.map(async (courseId) => {
        try {
          const res = await cAdminControllerApi.getBatchSummariesByCourse(courseId);
          return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        } catch {
          return [];
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      const map = {};
      results.flat().forEach((batch) => {
        if (batch?.batchId != null) map[batch.batchId] = batch;
      });
      setBatchDetails(map);
    });

    return () => {
      isMounted = false;
    };
  }, [enrolledBatches]);

  const enrolledByEnrollment = useMemo(() => {
    const map = {};
    enrolledBatches.forEach((eb) => {
      if (eb?.enrollmentId != null) map[eb.enrollmentId] = eb;
    });
    return map;
  }, [enrolledBatches]);

  const enrolledByCourse = useMemo(() => {
    const map = {};
    enrolledBatches.forEach((eb) => {
      if (eb?.courseId) map[eb.courseId] = eb;
    });
    return map;
  }, [enrolledBatches]);

  const getEnrolledBatch = (course) => {
    if (!course) return null;
    if (course.enrollmentId != null && enrolledByEnrollment[course.enrollmentId]) {
      return enrolledByEnrollment[course.enrollmentId];
    }
    return enrolledByCourse[course.courseId] || null;
  };

  const filtered = useMemo(
    () => (config ? courses.filter((c) => c.status === config.key) : []),
    [courses, config]
  );

  if (!VALID_STATUSES.includes(status)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <Layers className="h-10 w-10 text-slate-300" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">Invalid status</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This course status does not exist.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="mx-auto flex h-full max-w-full flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-2xl bg-[#DBEAFE]">
              <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6 text-[#155DFC]" />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                {config.label} Courses
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/student-dashboard")}
            className="h-9 self-start md:self-auto"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
          </Button>
        </header>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <strong className="font-semibold text-foreground">
              {filtered.length}
            </strong>{" "}
            {config.label.toLowerCase()} course
            {filtered.length !== 1 ? "s" : ""}
            {total > 0 ? ` of ${total} enrolled course${total !== 1 ? "s" : ""}` : ""}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span className="text-sm">Loading courses…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-white py-24 text-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
            <div>
              <h2 className="text-base font-semibold text-foreground">
                No {config.label.toLowerCase()} courses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You don't have any {config.label.toLowerCase()} courses right now.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/view-courses")}>
              Explore more courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const enrolledBatch = getEnrolledBatch(course);
              const batchDetail =
                enrolledBatch?.batchId != null
                  ? batchDetails[enrolledBatch.batchId] || null
                  : null;
              return (
                <CourseCardRow
                  key={course.courseId}
                  course={course}
                  config={config}
                  enrolledBatch={enrolledBatch}
                  batchDetail={batchDetail}
                  onClick={() => navigate(`/student-course/${course.courseId}`)}
                  onEnroll={() => setEnrollCourse(course)}
                  onSwitch={() => setSwitchCourse({ course, enrolledBatch })}
                />
              );
            })}
          </div>
        )}
      </div>

      {enrollCourse && (
        <EnrollBatchDialog
          course={enrollCourse}
          open
          onOpenChange={(isOpen) => !isOpen && setEnrollCourse(null)}
          onEnrolled={() => setReloadKey((k) => k + 1)}
        />
      )}

      {switchCourse && (
        <SwitchBatchDialog
          course={switchCourse.course}
          enrolledBatch={switchCourse.enrolledBatch}
          open
          onOpenChange={(isOpen) => !isOpen && setSwitchCourse(null)}
          onSwitched={() => setReloadKey((k) => k + 1)}
        />
      )}
    </div>
  );
}

function CourseCardRow({
  course,
  config,
  enrolledBatch,
  batchDetail,
  onClick,
  onEnroll,
  onSwitch,
}) {
  const pct = Math.min(100, Math.max(0, Math.round(course.progress || 0)));
  const isEnrolled = Boolean(enrolledBatch?.batchId);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <Card className="group flex flex-col transition-colors hover:shadow-sm">
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE]">
            <BookOpen className="h-4 w-4 text-[#155DFC]" />
          </div>

          <Badge className={`text-[10px] ${config.badge}`}>{config.label}</Badge>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">
          {course.courseName || course.courseId}
        </h3>

        {config.batchEnroll ? (
          isEnrolled ? (
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium text-foreground">
                  {enrolledBatch.batchName || `Batch #${enrolledBatch.batchId}`}
                </span>
              </div>
              <div className="flex gap-6">
              {formatDate(batchDetail?.startDate) && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Starts{" "}
                  {formatDate(batchDetail.startDate)}
                </span>
              )}
              {formatDate(batchDetail?.endDate) && (
                <span className="flex items-center gap-1.5">
                  <CalendarRange className="h-3.5 w-3.5" /> Ends{" "}
                  {formatDate(batchDetail.endDate)}
                </span>
              )}
              </div>
              {batchDetail?.scheduleCount != null && (
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />{" "}
                  {batchDetail.scheduleCount} sessions
                </span>
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Enroll in an upcoming batch to start this course.
            </p>
          )
        ) : (
          <>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${config.bar}`} style={{ width: `${pct}%` }} />
            </div>

            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% complete</span>
              <span>{pct >= 100 ? "Completed" : "In progress"}</span>
            </div>
          </>
        )}

        {!config.batchEnroll && (
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            {formatDate(course.startDate) && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />  Starts {formatDate(course.startDate)}
              </span>
            )}
            {formatDate(course.endDate) && (
              <span className="flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5" /> Ends {formatDate(course.endDate)}
              </span>
            )}
          </div>
        )}

        {config.batchEnroll && isEnrolled ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onSwitch}
            className="mt-auto h-8 w-full border-[#155DFC] text-xs text-[#155DFC] shadow-none hover:bg-[#DBEAFE]"
          >
            <ArrowLeftRight className="mr-1 h-3.5 w-3.5" />
            Switch Batch
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={config.batchEnroll ? onEnroll : onClick}
            className="mt-auto h-8 w-full bg-[#155DFC] text-xs shadow-none hover:bg-[#1149c8]"
          >
            {config.batchEnroll ? (
              <UserPlus className="mr-1 h-3.5 w-3.5" />
            ) : (
              <PlayCircle className="mr-1 h-3.5 w-3.5" />
            )}
            {config.action}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}