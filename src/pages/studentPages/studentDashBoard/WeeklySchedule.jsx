import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { decodeToken } from "@/utils/tokenUtility";
import { enrollmentBatchApi } from "@/api/enrollment-batch-controller";

export function WeeklySchedule() {
  const studentId = decodeToken()?.userId || null;

  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ["studentWeeklySchedule", studentId],
    queryFn: async () => {
      const res = await enrollmentBatchApi.getStudentWeeklySchedule(studentId);
      return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    },
    enabled: Boolean(studentId),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-2xl shadow-sm">

      <CardContent className="flex min-h-0 flex-1 flex-col p-4">

        <div className="flex items-center justify-between pb-4">

          <h3 className="text-base font-semibold">
            Weekly Schedule
          </h3>

          <CalendarDays className="h-5 w-5 text-[#155DFC]" />

        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Loading schedule...
            </div>
          ) : schedule.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              No classes scheduled this week
            </div>
          ) : (
            schedule.map((day) => (
              <div key={day.day} className="space-y-2">

                <h4 className="text-sm font-semibold">
                  {day.day}
                </h4>

                {(day.items || []).map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="rounded-xl border border-[#BEDBFF] bg-[#EFF6FF] p-3"
                  >

                    <div className="text-sm font-semibold">
                      {item.title}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {item.time}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.instructor}
                    </div>

                  </div>
                ))}

              </div>
            ))
          )}

        </div>

      </CardContent>

    </Card>
  );
}
