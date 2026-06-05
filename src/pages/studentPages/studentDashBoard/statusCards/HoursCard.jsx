// HoursCard.jsx

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { hours } from "../data";

export default function HoursCard() {
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
          {hours.total}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Total learning time
        </div>

      </CardContent>

    </Card>
  );
}