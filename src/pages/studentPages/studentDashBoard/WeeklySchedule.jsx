import { useState } from "react";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { decodeToken } from "@/utils/tokenUtility";
import { enrollmentBatchApi } from "@/api/enrollment-batch-controller";

export function WeeklySchedule() {
  const [expandedMessages, setExpandedMessages] = useState({});
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

  const toggleMessage = (day, idx) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [`${day}:${idx}`]: !prev[`${day}:${idx}`],
    }));
  };

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
                    className={`rounded-xl border p-3 ${
                      item.status === "CANCELLED"
                        ? "border-red-500 bg-red-50"
                        : "border-[#BEDBFF] bg-[#EFF6FF]"
                    }`}
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

                    {item.status === "CANCELLED" && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        {item.status}
                      </span>
                    )}

                    {item.message ? (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => toggleMessage(day.day, idx)}
                          aria-expanded={!!expandedMessages[`${day.day}:${idx}`]}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#155DFC] transition-colors hover:underline"
                        >
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform ${
                              expandedMessages[`${day.day}:${idx}`]
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                          {expandedMessages[`${day.day}:${idx}`]
                            ? "Hide Instructor Message"
                            : "Show Instructor Message"}
                        </button>

                        {expandedMessages[`${day.day}:${idx}`] && (
                          <div className="mt-2 whitespace-pre-line rounded-lg border border-[#BEDBFF] bg-white/70 px-3 py-2 text-xs text-slate-700">
                            {item.message}
                          </div>
                        )}
                      </div>
                    ) : null}

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
