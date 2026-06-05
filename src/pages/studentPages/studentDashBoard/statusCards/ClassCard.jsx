import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { classes } from "../data";

export default function ClassCard() {
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
              {classes.total}

              <span className="text-3xl font-bold text-foreground">/</span>

              <span className="text-red-600">
                {classes.skipped}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Total
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">
              {classes.monthTotal}

              <span className="text-3xl font-bold text-foreground">/</span>

              <span className="text-red-600">
                {classes.monthSkipped} 
              </span>
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