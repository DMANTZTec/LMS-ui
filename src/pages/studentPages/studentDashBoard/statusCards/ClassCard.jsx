import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { decodeToken } from "@/utils/tokenUtility";
import { dashboardApi } from "@/api/student-dashboard-controller";

const EMPTY = { attended: 0, skipped: 0, monthAttended: 0, monthSkipped: 0 };

export default function ClassCard() {
  const studentId = decodeToken()?.userId || null;

  const [stats, setStats] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(studentId));

  useEffect(() => {
    let isMounted = true;
    if (!studentId) return;

    dashboardApi
      .getClassesAttendanceSummary(studentId)
      .then((res) => {
        if (!isMounted) return;
        setStats(res?.data?.classes || EMPTY);
      })
      .catch(() => {
        // 404 when the student has no attendance records yet
        if (isMounted) setStats(EMPTY);
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
          <h3 className="text-sm font-semibold text-foreground">
            Classes (Attended/Skipped)
          </h3>

          <Calendar className="h-[15px] w-[15px] text-green-600" />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <div className="text-3xl font-bold text-foreground">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
              ) : (
                <>
                  {stats.attended}

                  <span className="text-3xl font-bold text-foreground">/</span>

                  <span className="text-red-600">
                    {stats.skipped}
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Total
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
              ) : (
                <>
                  {stats.monthAttended}

                  <span className="text-3xl font-bold text-foreground">/</span>

                  <span className="text-red-600">
                    {stats.monthSkipped}
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              This Month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
