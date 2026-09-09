import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, PlayCircle, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { decodeToken } from "@/utils/tokenUtility";
import { dashboardApi } from "@/api/student-dashboard-controller";

const STATUSES = [
  { key: "ACTIVE", label: "Active" },
  { key: "PLANNED", label: "Planned" },
  { key: "COMPLETED", label: "Completed" },
];

const STATUS_BADGE_STYLES = {
  ACTIVE: "bg-blue-100 text-[#155DFC] border-0",
  PLANNED: "bg-orange-100 text-[#F54900] border-0",
  COMPLETED: "bg-green-100 text-[#00A63E] border-0",
};

export default function CourseCard() {
  const navigate = useNavigate();
  const studentId = decodeToken()?.userId || null;

  const [counts, setCounts] = useState({
    ACTIVE: null,
    PLANNED: null,
    COMPLETED: null,
  });
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(Boolean(studentId));
  const [openStatus, setOpenStatus] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!studentId) return;

    dashboardApi
      .getMyCourses(studentId)
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || {};

        setCounts({
          ACTIVE: data.ongoing ?? 0,
          PLANNED: data.planned ?? 0,
          COMPLETED: data.completed ?? 0,
        });
        setCoursesList(Array.isArray(data.courses) ? data.courses : []);
      })
      .catch(() => {
        // 404 when the student has no enrolled courses yet
        if (isMounted) setCounts({ ACTIVE: 0, PLANNED: 0, COMPLETED: 0 });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const filteredCourses = openStatus
    ? coursesList.filter((c) => c.status === openStatus)
    : [];

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <>
      <Card className="h-[122px]">
        <CardContent className="p-1 pl-5">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-foreground">Courses</h3>

            <BookOpen className="h-[15px] w-[15px] text-blue-600" />
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {STATUSES.map(({ key, label }) => (
              <Stat
                key={key}
                value={counts[key]}
                label={label}
                loading={loading && !studentId}
                onClick={() => setOpenStatus(key)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openStatus !== null} onOpenChange={(open) => !open && setOpenStatus(null)}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {openStatus ? STATUSES.find((s) => s.key === openStatus)?.label : ""} Courses
            </DialogTitle>
            <DialogDescription>
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} in this status
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="flex items-center justify-between gap-3 rounded-xl border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {course.courseName || course.courseId}
                      </span>
                      <Badge className={`text-[10px] ${STATUS_BADGE_STYLES[course.status]}`}>
                        {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          course.status === "COMPLETED" ? "bg-emerald-500" : "bg-[#155DFC]"
                        }`}
                        style={{ width: `${Math.round(course.progress || 0)}%` }}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{Math.round(course.progress || 0)}% complete</span>
                      {formatDate(course.startDate) && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(course.startDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {course.status !== "COMPLETED" && (
                    <Button
                      size="sm"
                      className="h-8 shrink-0 bg-[#155DFC] text-xs shadow-none hover:bg-[#1149c8]"
                      onClick={() => navigate(`/course/${course.courseId}`)}
                    >
                      <PlayCircle className="mr-1 h-3.5 w-3.5" />
                      Start Learning
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No courses here yet. Enroll in a course to see it under Planned.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({ value, label, loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left transition-colors"
      title={`View ${label.toLowerCase()} courses`}
    >
      <div className="flex items-center gap-1">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
        ) : (
          <span className="text-3xl font-bold text-foreground group-hover:text-[#155DFC]">
            {value ?? 0}
          </span>
        )}
      </div>

      <div className="text-xs text-muted-foreground underline-offset-2 group-hover:text-[#155DFC] group-hover:underline">
        {label}
      </div>
    </button>
  );
}
