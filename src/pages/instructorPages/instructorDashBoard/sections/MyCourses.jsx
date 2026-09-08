import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Layers,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  COURSE_STATUS_FILTER,
  COURSE_STATUS_STYLES,
  COURSE_LEVEL_STYLES,
} from "../data";
import { instructorDashboardApi } from "@/api/instructor-dashboard-controller";

const COURSE_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-sky-500 via-blue-600 to-indigo-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-rose-500 via-pink-600 to-fuchsia-700",
  "from-amber-500 via-orange-600 to-red-600",
  "from-violet-500 via-purple-600 to-indigo-700",
];

const normalizeCourse = (course, index) => ({
  ...course,
  id: course.courseId,
  gradient: COURSE_GRADIENTS[index % COURSE_GRADIENTS.length],
});

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const DAY_PREFIX = /^(MON|TUE|WED|THU|FRI|SAT|SUN)\s/;

// Shows only today's session out of the batch schedule list.
const displayBatchSchedule = (schedule) => {
  if (!schedule) return "—";
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase()
    .slice(0, 3);

  const entries = schedule
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const todays = entries.find((e) => e.startsWith(`${today} `));
  if (todays) return todays;

  // Day/time list but nothing today -> no class today.
  if (entries.some((e) => DAY_PREFIX.test(e))) return "No class today";

  return schedule;
};

function SummaryCards({ courses }) {
  const stats = useMemo(() => {
    const active = courses.filter((c) => c.status === "ACTIVE").length;
    const completed = courses.filter((c) => c.status === "COMPLETED").length;
    const totalStudents = courses.reduce((sum, c) => sum + c.totalStudents, 0);

    return [
      {
        label: "Total Courses",
        value: courses.length,
        icon: BookOpen,
        chip: "bg-blue-50 text-blue-600",
      },
      {
        label: "Active",
        value: active,
        icon: Clock,
        chip: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Completed",
        value: completed,
        icon: GraduationCap,
        chip: "bg-violet-50 text-violet-600",
      },
      {
        label: "Total Students",
        value: totalStudents,
        icon: Users,
        chip: "bg-amber-50 text-amber-600",
      },
    ];
  }, [courses]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <CardContent className="flex items-center gap-3 p-4 lg:gap-4 lg:p-5">
              <div className={`shrink-0 rounded-xl p-2.5 lg:p-3 ${stat.chip}`}>
                <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold text-slate-800 lg:text-2xl">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium text-slate-400 lg:text-xs">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CourseCard({ course, onSelect }) {
  const batchesCount = course.batches.length;
  const totalBatchStudents = course.batches.reduce(
    (sum, b) => sum + b.students,
    0
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(course)}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      {course.courseImage ? (
        <div className="relative h-28 sm:h-32">
          <img
            src={course.courseImage}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex items-center gap-2">
              <Badge
                className={`text-[9px] font-semibold uppercase tracking-wide ${COURSE_STATUS_STYLES[course.status]}`}
              >
                {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-[9px] font-medium ${COURSE_LEVEL_STYLES[course.level]}`}
              >
                {course.level}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
      <div className={`relative h-28 bg-gradient-to-r ${course.gradient} sm:h-32`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-[9px] font-semibold uppercase tracking-wide ${COURSE_STATUS_STYLES[course.status]}`}
            >
              {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-[9px] font-medium ${COURSE_LEVEL_STYLES[course.level]}`}
            >
              {course.level}
            </Badge>
          </div>
        </div>
      </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {course.subject}
          </div>
          <h3 className="mt-0.5 truncate text-sm font-bold text-slate-800 group-hover:text-[#155DFC]">
            {course.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {course.description}
        </p>

        <div className="mt-auto pt-3">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-600">
              {course.chaptersCompleted}/{course.totalChapters} chapters
            </span>
            <span className="font-bold text-slate-800">{course.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                course.status === "COMPLETED"
                  ? "bg-emerald-500"
                  : course.status === "PLANNED"
                    ? "bg-slate-300"
                    : "bg-[#155DFC]"
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="font-medium">{totalBatchStudents} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>
              {batchesCount} batch{batchesCount > 1 ? "es" : ""}
            </span>
          </div>
          {course.upcomingClasses > 0 && (
            <div className="flex items-center gap-1 text-blue-600">
              <CalendarDays className="h-3 w-3" />
              <span className="font-medium">{course.upcomingClasses} upcoming</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function CourseDetailDialog({ course, onClose }) {
  if (!course) return null;

  return (
    <Dialog open={!!course} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl border-slate-200/80 p-0 sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>

        {course.courseImage ? (
        <div className="relative h-36 sm:h-44">
          <img
            src={course.courseImage}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-[10px] font-semibold uppercase tracking-wide ${COURSE_STATUS_STYLES[course.status]}`}
                  >
                    {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium ${COURSE_LEVEL_STYLES[course.level]}`}
                  >
                    {course.level}
                  </Badge>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  {course.title}
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  {course.subject} · {course.language}
                </p>
              </div>
              <span className="text-3xl font-bold text-white">{course.progress}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative h-36 bg-gradient-to-r ${course.gradient} sm:h-44`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-[10px] font-semibold uppercase tracking-wide ${COURSE_STATUS_STYLES[course.status]}`}
                  >
                    {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium ${COURSE_LEVEL_STYLES[course.level]}`}
                  >
                    {course.level}
                  </Badge>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  {course.title}
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  {course.subject} · {course.language}
                </p>
              </div>
              <span className="text-3xl font-bold text-white">{course.progress}%</span>
            </div>
          </div>
        </div>
      )}

        <ScrollArea className="max-h-[60vh] px-6 py-5">
          <div className="space-y-5">
            <div>
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {course.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label="Students" value={course.totalStudents} icon={Users} />
              <StatBlock
                label="Chapters"
                value={`${course.chaptersCompleted}/${course.totalChapters}`}
                icon={Layers}
              />
              <StatBlock
                label="Upcoming"
                value={course.upcomingClasses}
                icon={CalendarDays}
              />
              <StatBlock
                label="Last Class"
                value={formatDate(course.lastClassDate)}
                icon={Clock}
                small
              />
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Batches
              </h3>
              <div className="rounded-xl border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                        Batch
                      </TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                        Students
                      </TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                        Schedule
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.batches.map((batch) => (
                      <TableRow key={batch.name} className="border-slate-50">
                        <TableCell className="py-2.5 text-xs font-semibold text-slate-700">
                          {batch.name}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-slate-500">
                          {batch.students}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-slate-500">
                          {displayBatchSchedule(batch.schedule)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {course.skills.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skills Covered
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>
                Course ID: <span className="font-mono text-slate-600">{course.id}</span>
              </span>
              {course.nextClassDate && (
                <span>
                  Next class:{" "}
                  <span className="font-semibold text-blue-600">
                    {formatDate(course.nextClassDate)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 rounded-b-2xl">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 text-xs text-slate-600"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Materials
          </Button>
          <Button size="sm" className="bg-[#155DFC] text-xs text-white hover:bg-[#1149c8]">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            Schedule Class
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="text-xs text-slate-400">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatBlock({ label, value, icon, small }) {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-slate-400" />
      <div
        className={`font-bold text-slate-800 ${small ? "text-[11px]" : "text-lg"}`}
      >
        {value}
      </div>
      <div className="text-[10px] font-medium text-slate-400">{label}</div>
    </div>
  );
}

export default function MyCourses() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const staffId = JSON.parse(localStorage.getItem("staffId"));

  const fetchCourses = useCallback(async () => {
    if (!staffId) {
      setError("Unable to identify the logged-in instructor.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await instructorDashboardApi.getMyCourses1(staffId);
      const list = (res.data || []).map(normalizeCourse);
      setCourses(list);
    } catch (err) {
      console.error("Failed to fetch my courses", err);
      setError("Failed to load your courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = useMemo(() => {
    let list = courses;

    if (statusFilter !== "All") {
      list = list.filter(
        (c) => c.status === statusFilter.toUpperCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q) ||
          (c.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, statusFilter, courses]);

  return (
    <div className="flex flex-col gap-4 lg:min-h-0 lg:flex-1 lg:gap-4 lg:overflow-y-auto lg:pr-1 lg:pb-2">
      <SummaryCards courses={courses} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, subjects, skills..."
            className="rounded-full border-slate-200 bg-white py-2 pl-9 pr-4 text-xs shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] rounded-full border-slate-200 bg-white text-xs shadow-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {COURSE_STATUS_FILTER.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-[11px] text-slate-400">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BookOpen className="h-6 w-6 animate-pulse text-slate-400" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-700">
            Loading your courses...
          </h3>
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <BookOpen className="h-6 w-6 text-rose-400" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-700">
            Something went wrong
          </h3>
          <p className="mt-1 max-w-xs text-xs text-slate-400">{error}</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 text-xs"
            onClick={fetchCourses}
          >
            Retry
          </Button>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={setSelectedCourse}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BookOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-700">
            No courses found
          </h3>
          <p className="mt-1 max-w-xs text-xs text-slate-400">
            {search || statusFilter !== "All"
              ? "Try adjusting your search or filter criteria."
              : "You haven't been assigned any courses yet."}
          </p>
          {(search || statusFilter !== "All") && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4 text-xs"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <CourseDetailDialog
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}
