// HoursCard.jsx
import { Clock ,Loader2} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { decodeToken } from "@/utils/tokenUtility";
import { dashboardApi } from "@/api/student-dashboard-controller";
import { useEffect, useState } from "react";

const EMPTY ={totalHours:0,label: "Total learning time" }

export default function HoursCard() {
  const studentId =decodeToken()?.userId || null

  const [totalHours, setTotalHours] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(studentId));

  useEffect(() => {
    let isMounted = true;
    if (!studentId) return;
    dashboardApi.getTotalHoursSpent(studentId)
    .then((res)=>{
      if(isMounted){
        setTotalHours({
          totalHours: res?.data?.totalHours ?? 0 ,
          label: res?.data?.label ?? EMPTY.label
        })
      }

    })
   .catch(() => {
        if (isMounted) setHours(EMPTY);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };


  },[studentId])
  return (
    <Card className="h-[122px]">

      <CardContent className="p-1 pl-5">

        <div className="flex items-start justify-between">

          <h3 className="text-sm font-semibold text-foreground">
            Hours Spent
          </h3>

          <Clock className="h-[15px] w-[15px] text-[#9810FA]" />

        </div>

        <div className="ms-2 mt-2 text-3xl font-bold text-foreground">
         {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          ) : (
            totalHours.totalHours
          )}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {totalHours.label}
        </div>

      </CardContent>

    </Card>
  );
}