import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  RotateCw,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cAdminControllerApi } from "@/api/class-admin-controller";
import { instructorDashboardApi } from "@/api/instructor-dashboard-controller";
import { staskapi } from "@/api/student-task-controller";
import toast from "react-hot-toast";
import {
  SCHEDULE_VIEWS,
} from "../data";
import PlanClassModal from "../components/PlanClassModal";
import RescheduleModal from "../components/RescheduleModal";
import ReviewModal from "../components/ReviewModal";
import CancelScheduleDialog from "../components/CancelScheduleDialog"; 

function MetricCards() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const staffId = JSON.parse(localStorage.getItem("staffId"));

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!staffId) {
        setLoading(false);
        return;
      }

      const [batchRes, classRes, studentRes] = await Promise.allSettled([
        instructorDashboardApi.getBatchSummary(staffId),
        instructorDashboardApi.getClassStats(staffId),
        instructorDashboardApi.getStudentStats(staffId),
      ]);

      const batch =
        batchRes.status === "fulfilled" ? batchRes.value.data : {};
      const cls =
        classRes.status === "fulfilled" ? classRes.value.data : {};
      const student =
        studentRes.status === "fulfilled" ? studentRes.value.data : {};

      setMetrics([
        {
          id: "batches",
          label: "Active Batches",
          value: batch.activeBatchCount ?? 0,
          secondaryLabel: "Completed",
          secondaryValue: batch.completedBatchCount ?? 0,
          icon: BookOpen,
          iconChip: "bg-blue-50 text-blue-600",
        },
        {
          id: "classes",
          label: "Classes Taken",
          value: cls.classesTaken ?? 0,
          secondaryLabel: "Scheduled",
          secondaryValue: cls.scheduled ?? 0,
          icon: Clock,
          iconChip: "bg-emerald-50 text-emerald-600",
          footnote: cls.hoursSpent ? `${cls.hoursSpent}h` : null,
        },
        {
          id: "students",
          label: "Active Students",
          value: student.activeStudents ?? 0,
          secondaryLabel: "Total",
          secondaryValue: student.totalStudents ?? 0,
          icon: Users,
          iconChip: "bg-blue-50 text-blue-600",
        },
      ]);

      setLoading(false);
    };

    fetchAllStats();
  }, [staffId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <CardContent className="p-5 sm:p-6 lg:p-3">
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded-xl bg-slate-100 p-3 h-12 w-12 animate-pulse" />
                <div className="flex min-w-0 items-center gap-5 sm:gap-8 lg:gap-6">
                  <div>
                    <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded mt-1 animate-pulse" />
                  </div>
                  <div className="border-l border-slate-100 pl-5 sm:pl-8 lg:pl-6">
                    <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded mt-1 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {metrics.map((metric) => {
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [pendingReview, setPendingReview] = useState(true);
  const [myClassesOnly, setMyClassesOnly] = useState(false);
  const [reviewTask, setReviewTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    course: "",
    chapter: "",
    topic: "",
  });
  const staffId = JSON.parse(localStorage.getItem("staffId"));

  const submissionsQuery = useQuery({
    queryKey: ["instructorSubmissions", staffId, myClassesOnly],
    queryFn: async () => {
      if (!staffId) return { submissions: [], pendingReviewCount: 0, totalCount: 0 };
      const filter = myClassesOnly ? "ASSIGNED_BY_ME" : "ALL_SUBMISSIONS";
      const res = await instructorDashboardApi.getTaskSubmissions(staffId, filter);
      const data = res?.data;
      if (Array.isArray(data)) {
        const submissions = data;
        return {
          submissions,
          pendingReviewCount: submissions.filter(
            (s) => s.reviewStatus === "PENDING_REVIEW"
          ).length,
          totalCount: submissions.length,
        };
      }
      return {
        submissions: data?.submissions ?? [],
        pendingReviewCount: data?.pendingReviewCount ?? 0,
        totalCount: data?.totalCount ?? 0,
      };
    },
    enabled: Boolean(staffId),
    staleTime: 30 * 1000,
  });

  const completeReviewMutation = useMutation({
    mutationFn: (submissionId) =>
      instructorDashboardApi.completeReview(submissionId),
    onSuccess: () => {
      toast.success("Review completed");
      queryClient.invalidateQueries(["instructorSubmissions", staffId]);
      setReviewTask(null);
    },
    onError: () => {
      toast.error("Failed to complete review");
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["instructorMyCourses", staffId],
    queryFn: async () => {
      if (!staffId) return [];
      const res = await instructorDashboardApi.getMyCourseSummaries(staffId);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(staffId),
    staleTime: 10 * 60 * 1000,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["instructorTaskChapters", draft.course],
    queryFn: async () => {
      if (!draft.course) return [];
      const res = await staskapi.getChaptersByCourse(draft.course);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(draft.course),
    staleTime: 10 * 60 * 1000,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["instructorTaskTopics", draft.chapter],
    queryFn: async () => {
      if (!draft.chapter) return [];
      const res = await staskapi.getTopicsByChapter(Number(draft.chapter));
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(draft.chapter),
    staleTime: 10 * 60 * 1000,
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload) => instructorDashboardApi.createTask(payload),
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries(["instructorMyCourses", staffId]);
      setDraft({
        title: "",
        description: "",
        course: "",
        chapter: "",
        topic: "",
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const handleCreate = () => {
    if (!draft.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    createTaskMutation.mutate({
      title: draft.title,
      description: draft.description,
      courseId: draft.course,
      chapterId: draft.chapter ? Number(draft.chapter) : undefined,
      topicId: draft.topic ? Number(draft.topic) : undefined,
      assignedBy: staffId,
    });
  };

  const ownSubmissions = submissionsQuery.data?.submissions ?? [];

  const filtered = ownSubmissions.filter((task) => {
    if (search) {
      const q = search.toLowerCase();
      const submittedDate = task.submittedAt
        ? new Date(task.submittedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "";
      if (
        !(task.studentName ?? "").toLowerCase().includes(q) &&
        !(task.courseTitle ?? "").toLowerCase().includes(q) &&
        !(task.topicName ?? "").toLowerCase().includes(q) &&
        !(task.taskTitle ?? "").toLowerCase().includes(q) &&
        !submittedDate.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (pendingReview && task.reviewStatus !== "PENDING_REVIEW") return false;
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
              if (reviewTask?.id) {
                completeReviewMutation.mutate(reviewTask.id);
              }
            }}
            submitting={completeReviewMutation.isPending}
            details={{
              studentName: reviewTask.studentName,
              studentInitials: (reviewTask.studentName ?? "?")
                .split(" ")
                .map((p) => p?.[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
              courseTitle: reviewTask.courseTitle,
              topic: reviewTask.topicName,
              submittedDate: reviewTask.submittedAt
                ? new Date(reviewTask.submittedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null,
              taskTitle: reviewTask.taskTitle,
              submissionNotes: reviewTask.submissionNotes || "No notes provided.",
              attachments: reviewTask.attachments || [],
              status:
                reviewTask.reviewStatus === "COMPLETED"
                  ? "Completed"
                  : "Pending Review",
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
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setOpen((v) => !v)}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Task
            </Button>
            <Badge
              variant="secondary"
              className="rounded-full border-none bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
            >
              {submissionsQuery.data?.pendingReviewCount ?? 0} pending
            </Badge>
          </div>
        </div>

        {open && (
          <div className="mb-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 lg:mb-3">
            <div className="text-sm font-semibold text-slate-800">
              Create New Task
            </div>

            <Input
              placeholder="Task title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />

            <Textarea
              placeholder="Description"
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />

            <div className="grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-3">
              <Select
                value={draft.course}
                onValueChange={(v) =>
                  setDraft({ ...draft, course: v, chapter: "", topic: "" })
                }
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.courseId} value={c.courseId}>
                      {c.courseTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={draft.chapter}
                onValueChange={(v) =>
                  setDraft({ ...draft, chapter: v, topic: "" })
                }
                disabled={!draft.course}
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.chapterNm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={draft.topic}
                onValueChange={(v) => setDraft({ ...draft, topic: v })}
                disabled={!draft.chapter}
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.topicNm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Creating..." : "Create"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
              {submissionsQuery.isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    Loading submissions...
                  </TableCell>
                </TableRow>
              )}

              {!submissionsQuery.isLoading && submissionsQuery.isError && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-red-500"
                  >
                    Failed to load submissions. Please try again.
                  </TableCell>
                </TableRow>
              )}

              {!submissionsQuery.isLoading &&
                !submissionsQuery.isError &&
                filtered.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <TableCell className="py-3 font-medium text-slate-800 lg:py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 text-xs font-bold">
                        <AvatarFallback>
                          {(task.studentName ?? "?")
                            .split(" ")
                            .map((p) => p?.[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">
                        {task.studentName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {task.topicName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {task.taskTitle}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {task.submittedAt
                      ? new Date(task.submittedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Review Submission"
                      className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
                      aria-label={`Review ${task.studentName}`}
                      onClick={() => setReviewTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!submissionsQuery.isLoading &&
                !submissionsQuery.isError &&
                filtered.length === 0 && (
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
  const [rescheduleItem, setRescheduleItem] = useState(null);

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

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-5 lg:flex lg:min-h-0 lg:flex-col">
      <CardContent className="p-5 sm:p-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:p-5">
        {planningItem && (
          <PlanClassModal
            isOpen={!!planningItem}
            onClose={() => setPlanningItem(null)}
            scheduleId={planningItem.id}
            courseId={planningItem.courseId}
            classNameTitle={planningItem.course}
            dateTimeText={`${planningItem.date} • ${planningItem.time}`}
          />
        )}

        {rescheduleItem && (
          <RescheduleModal
            isOpen={!!rescheduleItem}
            onClose={() => setRescheduleItem(null)}
            scheduleId={rescheduleItem.id}
            className={rescheduleItem.className}
            currentDate={rescheduleItem.date}
            currentTime={rescheduleItem.time}
            onRescheduled={() => fetchSchedule(scheduleView)}
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
                    <div className={`text-xs font-bold ${item.status === "CANCELLED" ? "text-red-600" : "text-slate-800"}`}>
                      {item.time}
                    </div>
                    <div className={`text-[10px] ${item.status === "CANCELLED" ? "text-red-400" : "text-slate-400"}`}>{item.date}</div>
                  </TableCell>
                  <TableCell className={`text-xs font-medium ${item.status === "CANCELLED" ? "text-red-600" : "text-slate-700"}`}>
                    {item.course}
                  </TableCell>
                  <TableCell className="py-3 lg:py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Plan class topics"
                        className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        aria-label={`Materials for ${item.course}`}
                        onClick={() => setPlanningItem(item)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <CancelScheduleDialog
                        scheduleId={item.id}
                        course={item.course}
                        date={item.date}
                        time={item.time}
                        batchName={item.batchName}
                        onCancelled={() => fetchSchedule(scheduleView)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Reschedule"
                        className="h-6 w-6 rounded-md bg-amber-50 text-amber-500 hover:bg-amber-100"
                        aria-label={`Reschedule ${item.course}`}
                        onClick={() => setRescheduleItem(item)}
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Message Students"
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