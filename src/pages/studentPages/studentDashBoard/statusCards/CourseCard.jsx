import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { decodeToken } from "@/utils/tokenUtility";
import { dashboardApi } from "@/api/student-dashboard-controller";

const STATUSES = [
  { key: "ACTIVE", label: "Active", path: "active" },
  { key: "PLANNED", label: "Planned", path: "planned" },
  { key: "COMPLETED", label: "Completed", path: "completed" },
];

export default function CourseCard() {
  const navigate = useNavigate();
  const studentId = decodeToken()?.userId || null;

  const [counts, setCounts] = useState({
    ACTIVE: null,
    PLANNED: null,
    COMPLETED: null,
  });
  const [loading, setLoading] = useState(Boolean(studentId));

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

  return (
    <Card className="h-[122px]">
      <CardContent className="p-1 pl-5">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-foreground">Courses</h3>

          <BookOpen className="h-[15px] w-[15px] text-blue-600" />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {STATUSES.map(({ key, label, path }) => (
            <Stat
              key={key}
              value={counts[key]}
              label={label}
              loading={loading}
              onClick={() => navigate(`/student-dashboard/courses/${path}`)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
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