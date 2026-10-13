import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipboardList, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { instructorDashboardApi } from "@/api/instructor-dashboard-controller";
import { staskapi } from "@/api/student-task-controller";
import { getStaffId } from "@/utils/tokenUtility";

const EMPTY_FORM = { title: "", description: "", chapter: "", topic: "" };

/**
 * Assigns a task to a single class schedule. Chapters load for the schedule's
 * course when the dialog opens; topics load for the selected chapter. The form
 * resets whenever the target schedule changes so no stale selection leaks in.
 */
export default function ScheduleTaskModal({ isOpen = false, onClose, schedule }) {
  const staffId = getStaffId();
  const [form, setForm] = useState(EMPTY_FORM);

  const scheduleId = schedule?.scheduleId ?? null;
  const courseId = schedule?.courseId ?? "";

  const chaptersQuery = useQuery({
    queryKey: ["scheduleTaskChapters", courseId],
    queryFn: async () => {
      const res = await staskapi.getChaptersByCourse(courseId);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(isOpen && courseId),
    staleTime: 10 * 60 * 1000,
  });

  const topicsQuery = useQuery({
    queryKey: ["scheduleTaskTopics", form.chapter],
    queryFn: async () => {
      const res = await staskapi.getTopicsByChapter(Number(form.chapter));
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(isOpen && form.chapter),
    staleTime: 10 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      instructorDashboardApi.createScheduleTask(scheduleId, payload),
    onSuccess: () => {
      toast.success("Task assigned to this class successfully.");
      setForm(EMPTY_FORM);
      onClose?.();
    },
    onError: () => {
      toast.error("Could not assign the task. Please try again.");
    },
  });

  const chapters = chaptersQuery.data ?? [];
  const topics = topicsQuery.data ?? [];

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (createMutation.isPending) return;

    const title = form.title.trim();
    const description = form.description.trim();
    if (!title) return toast.error("Task title is required.");
    if (!description) return toast.error("Task description is required.");
    if (!form.chapter) return toast.error("Please select a chapter.");
    if (!form.topic) return toast.error("Please select a topic.");

    createMutation.mutate({
      title,
      description,
      chapterId: Number(form.chapter),
      topicId: Number(form.topic),
      assignedBy: staffId,
    });
  };

  if (!schedule) return null;

  const details = [
    { label: "Course", value: schedule.course },
    { label: "Batch", value: schedule.batch },
    { label: "Session", value: schedule.className },
  ];

  const chapterLoading = chaptersQuery.isLoading;
  const chapterError = chaptersQuery.isError;
  const noChapters = !chapterLoading && !chapterError && chapters.length === 0;

  const topicLoading = topicsQuery.isLoading;
  const topicError = topicsQuery.isError;
  const noTopics =
    Boolean(form.chapter) && !topicLoading && !topicError && topics.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardList className="h-4 w-4 text-blue-600" />
            </span>
            Add Task
          </DialogTitle>
          <DialogDescription>
            Create a task and assign it to this class session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-3">
            {details.map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="truncate text-xs font-semibold text-slate-700">
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="schedule-task-title">Task Title</Label>
            <Input
              id="schedule-task-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. Build a CRUD API"
              disabled={createMutation.isPending}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="schedule-task-description">Description</Label>
            <Textarea
              id="schedule-task-description"
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Describe what the students should do…"
              rows={3}
              disabled={createMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Chapter</Label>
              <Select
                value={form.chapter}
                onValueChange={(value) => update({ chapter: value, topic: "" })}
                disabled={
                  chapterLoading ||
                  chapterError ||
                  noChapters ||
                  createMutation.isPending
                }
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue
                    placeholder={
                      chapterLoading ? "Loading chapters…" : "Select chapter"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={String(chapter.id)}>
                      {chapter.chapterNm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {chapterLoading && (
                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading chapters…
                </p>
              )}
              {chapterError && (
                <p className="flex items-center gap-2 text-[11px] text-rose-500">
                  Could not load chapters.
                  <button
                    type="button"
                    onClick={() => chaptersQuery.refetch()}
                    className="font-semibold underline"
                  >
                    Retry
                  </button>
                </p>
              )}
              {noChapters && (
                <p className="text-[11px] text-slate-400">
                  No chapters available for this course.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Topic</Label>
              <Select
                value={form.topic}
                onValueChange={(value) => update({ topic: value })}
                disabled={
                  !form.chapter ||
                  topicLoading ||
                  topicError ||
                  noTopics ||
                  createMutation.isPending
                }
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue
                    placeholder={
                      !form.chapter
                        ? "Select chapter first"
                        : topicLoading
                          ? "Loading topics…"
                          : "Select topic"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={String(topic.id)}>
                      {topic.topicNm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.chapter && topicLoading && (
                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading topics…
                </p>
              )}
              {form.chapter && topicError && (
                <p className="flex items-center gap-2 text-[11px] text-rose-500">
                  Could not load topics.
                  <button
                    type="button"
                    onClick={() => topicsQuery.refetch()}
                    className="font-semibold underline"
                  >
                    Retry
                  </button>
                </p>
              )}
              {noTopics && (
                <p className="text-[11px] text-slate-400">
                  No topics available for this chapter.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {createMutation.isPending ? "Assigning…" : "Assign Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
