import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mentorPoints } from "../data";

export default function MentorPointsCard() {
  return (
    <Card className="h-[122px]">
      <CardContent className="p-1 pl-5">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Mentor Points
          </h3>

          <CheckCircle2 className="h-[15px] w-[15px] text-[#F54900]" />
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <div className="text-4xl font-bold text-foreground">
            {mentorPoints.total}
          </div>

          <span className="text-xs text-muted-foreground">
            total
          </span>
        </div>

        <div className="mt-4 text-xs font-medium text-[#F54900]">
          +{mentorPoints.thisMonth} this month
        </div>
      </CardContent>
    </Card>
  );
}