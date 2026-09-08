import { useCallback, useEffect, useState } from "react";
import {
  Clock,
  Eye,
  FileText,
  MessageSquare,
  RotateCw,
  Search,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cAdminControllerApi } from "@/api/class-admin-controller";
import {
  overviewMetrics,
  tasksData,
  SCHEDULE_VIEWS,
} from "../data";
import PlanClassModal from "../components/PlanClassModal";
import ReviewModal from "../components/ReviewModal";

function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {overviewMetrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card
            key={metric.id}
            className="rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <CardContent className="p-5 sm:p-6 lg:p-3">
              <div className="flex items-center gap-4">
                <div
                  className={`shrink-0 rounded-xl p-3 ${metric.iconChip}`}
                >
                  <Icon className="h-6 w-6 lg:h-5 lg:w-5" />
                </div>

                <div className="flex min-w-0 items-center gap-5 sm:gap-8 lg:gap-6">
                  <div>
                    <div className="text-2xl font-bold text-slate-800 lg:text-xl">
                      {metric.value}
                    </div>
                    <div className="text-xs font-medium text-slate-400 lg:text-[11px]">
                      {metric.label}
                    </div>
                  </div>

                  <div className="border-l border-slate-100 pl-5 sm:pl-8 lg:pl-6">
                    <div className="text-2xl font-bold text-slate-800 lg:text-xl">
                      {metric.secondaryValue}
                    </div>
                    <div className="text-xs font-medium text-slate-400 lg:text-[11px]">
                      {metric.secondaryLabel}
                    </div>
                  </div>
                </div>
              </div>

              {metric.footnote && (
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    <span className="font-semibold text-slate-600">
                      {metric.footnote}
                    </span>{" "}
                    hours spent
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TasksForReview() {
  const [search, setSearch] = useState("");
  const [pendingReview, setPendingReview] = useState(true);
  const [myClassesOnly, setMyClassesOnly] = useState(false);
  const [reviewTask, setReviewTask] = useState(null);

  const filtered = tasksData.filter((task) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !task.name.toLowerCase().includes(q) &&
        !task.topic.toLowerCase().includes(q) &&
        !task.date.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (pendingReview && task.status !== "pending") return false;
    if (myClassesOnly && !task.inMyClass) return false;
    return true;
  });

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-7 lg:flex lg:min-h-0 lg:flex-col">
      <CardContent className="p-5 sm:p-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:p-5">
        {reviewTask && (
          <ReviewModal
            isOpen={!!reviewTask}
            onClose={() => setReviewTask(null)}
            onStartReview={() => {
              console.log("Starting review for", reviewTask.name);
              setReviewTask(null);
            }}
            details={{
              studentName: reviewTask.name,
              studentInitials: reviewTask.initials,
              courseTitle: "React Advanced Patterns",
              topic: reviewTask.topic,
              submittedDate: reviewTask.date,
              taskTitle: reviewTask.task,
              submissionNotes:
                "The student has implemented a well-structured solution that addresses the core requirements. Code is organized, readable, and follows the patterns covered in class.",
              attachments: ["submission.tsx","submission.tsx","submission.tsx","submission.tsx", "solution.test.ts", "README.md"],
              status: "Pending Review",
            }}
          />
        )}

        <div className="mb-4 flex items-start justify-between gap-3 lg:mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tasks for Review</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {filtered.length} submissions shown
            </p>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
          >
            4 pending
          </Badge>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 lg:mb-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, topic, date..."
              className="rounded-full border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Switch
                checked={pendingReview}
                onCheckedChange={setPendingReview}
                className="data-[state=checked]:bg-blue-600"
              />
              <span>Pending review</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={myClassesOnly} onCheckedChange={setMyClassesOnly} />
              <span className="text-slate-400">My classes only</span>
            </div>
          </div>
        </div>

        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:rounded-lg lg:border lg:border-slate-100">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Student
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Topic
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Task
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Submitted
                </TableHead>
                <TableHead className="text-center text-[11px] font-bold uppercase text-slate-400">
                  Review
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <TableCell className="py-3 font-medium text-slate-800 lg:py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 text-xs font-bold">
                        <AvatarFallback className={task.avatarBg}>
                          {task.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">{task.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {task.topic}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {task.task}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {task.date}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
                      aria-label={`Review ${task.name}`}
                      onClick={() => setReviewTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No submissions match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const VIEW_TO_FILTER = {
  Week: "WEEK",
  Month: "MONTH",
  All: "ALL",
};

function ClassSchedule() {
  const [scheduleView, setScheduleView] = useState("Week");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planningItem, setPlanningItem] = useState(null);

  //const staffId = JSON.parse(sessionStorage.getItem("otpStaff") || "{}")?.staffId;
  const staffId = JSON.parse(localStorage.getItem("staffId"));

  const fetchSchedule = useCallback(async (view) => {
    if (!staffId) return;
    setLoading(true);
    try {
      const filter = VIEW_TO_FILTER[view];
      const res = await cAdminControllerApi.getSchedulesByInstructor(staffId, filter);
      setScheduleData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schedule", err);
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchSchedule(scheduleView);
  }, [scheduleView, fetchSchedule]);

  const handleSavePlan = (selectedTopicIds) => {
    console.log("Saved topics for", planningItem?.course, selectedTopicIds);
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-5 lg:flex lg:min-h-0 lg:flex-col">
      <CardContent className="p-5 sm:p-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:p-5">
        {planningItem && (
          <PlanClassModal
            isOpen={!!planningItem}
            onClose={() => setPlanningItem(null)}
            onSave={handleSavePlan}
            classNameTitle={planningItem.course}
            dateTimeText={`${planningItem.date} • ${planningItem.time}`}
          />
        )}

        <div className="mb-4 flex items-start justify-between gap-3 lg:mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Class Schedule</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {loading ? "Loading..." : `${scheduleData.length} upcoming classes`}
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium">
            {SCHEDULE_VIEWS.map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setScheduleView(view)}
                className={`rounded-lg px-3 py-1 transition-colors ${
                  scheduleView === view
                    ? "bg-white font-semibold text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:rounded-lg lg:border lg:border-slate-100">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Date &amp; Time
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                  Course
                </TableHead>
                <TableHead className="text-right text-[11px] font-bold uppercase text-slate-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleData.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <TableCell className="py-3 lg:py-2">
                    <div className="text-xs font-bold text-slate-800">
                      {item.time}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.date}</div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700">
                    {item.course}
                  </TableCell>
                  <TableCell className="py-3 lg:py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        aria-label={`Materials for ${item.course}`}
                        onClick={() => setPlanningItem(item)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-md bg-rose-50 text-rose-500 hover:bg-rose-100"
                        aria-label={`Cancel ${item.course}`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-md bg-amber-50 text-amber-500 hover:bg-amber-100"
                        aria-label={`Reschedule ${item.course}`}
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                        aria-label={`Message about ${item.course}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && scheduleData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No upcoming classes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Overview() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:min-h-0 lg:flex-1 lg:gap-4">
      <MetricCards />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:min-h-0 lg:flex-1 lg:auto-rows-fr lg:grid-cols-12 lg:gap-4">
        <TasksForReview />
        <ClassSchedule />
      </div>
    </div>
  );
}