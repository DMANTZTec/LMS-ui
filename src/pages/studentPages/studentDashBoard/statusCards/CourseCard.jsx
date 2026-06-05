import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "../data";

export default function CourseCard() {
  return (
    <Card className="h-[122px]">
      <CardContent className="p-1 pl-5">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Courses
          </h3>

          <BookOpen className="h-[15px] w-[15px] text-blue-600" />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat value={courses.active} label="Active" />
          <Stat value={courses.planned} label="Planned" />
          <Stat value={courses.completed} label="Completed" />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-foreground">
        {value}
      </div>

      <div className="text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  );
}