import { useState } from "react";
import { BarChart3, LineChart as LineIcon } from "lucide-react";

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { weeklyPerf } from "./data";

function MiniChart({ data, mode }) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {mode === "line" ? (
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: 4,
              left: 4,
              bottom: 0,
            }}
          >
            <XAxis
              hide={true}
              dataKey="d"
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* CHANGED TOOLTIP */}
            <Tooltip
              cursor={{ stroke: "transparent" }}
              wrapperStyle={{
                outline: "none",
                boxShadow: "none",
              }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "none",
              }}
            />

            <Line
              type="monotone"
              dataKey="v"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{
                r: 4,
                stroke: "none", // remove hover outline
                boxShadow: "none",
              }}
              dot={{
                r: 3,
                fill: "#3b82f6",
                stroke: "none",
              }}
            />
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{
              top: 8,
              right: 4,
              left: 4,
              bottom: 0,
            }}
          >
            <XAxis
              hide={true}
              dataKey="d"
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* CHANGED TOOLTIP */}
            <Tooltip
              cursor={{ fill: "transparent" }}
              wrapperStyle={{
                outline: "none",
                boxShadow: "none",
              }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "none",
              }}
            />

            <Bar
              dataKey="v"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function Section({ title, data, mode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">
        {title}
      </h4>

      <MiniChart data={data} mode={mode} />

      <div className="grid grid-cols-4 gap-2 text-center">
        {data.map((p) => (
          <div key={p.d}>
            <div className="text-base font-bold text-foreground">
              {p.v}
            </div>

            <div className="text-[11px] text-muted-foreground">
              {p.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyPerformance() {
  const [mode, setMode] = useState("line");

  return (
    <Card className="flex h-full min-h-0 flex-col shadow-none">
      <CardContent className="flex min-h-0 flex-1 flex-col p-4 pt-0 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#155DFC]" />

            <h3 className="text-base font-semibold text-foreground">
              Weekly Performance
            </h3>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMode(mode === "line" ? "bar" : "line")
            }
            className="h-8 shadow-none"
          >
            <LineIcon className="mr-1 h-3.5 w-3.5" />

            {mode === "line" ? "Line" : "Bar"}
          </Button>
        </div>

        <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          <Section
            title="Hours Spent"
            data={weeklyPerf.hours}
            mode={mode}
          />

          <Section
            title="Instructor Rating"
            data={weeklyPerf.rating}
            mode={mode}
          />

          <Section
            title="Classes Attended"
            data={weeklyPerf.attended}
            mode={mode}
          />

          <Section
            title="Tasks Completed"
            data={weeklyPerf.tasksCompleted}
            mode={mode}
          />
        </div>
      </CardContent>
    </Card>
  );
}