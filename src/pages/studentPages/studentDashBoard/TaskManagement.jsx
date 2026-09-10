// TaskManagement.jsx

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Plus, MoreVertical } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { decodeToken } from "@/utils/tokenUtility";
import { staskapi } from "@/api/student-task-controller";
import { GetTasksByStatusStatusEnum } from "@/api/openApi";
import toast from "react-hot-toast";

import SubmissionModal from "./SubmissionModal";

function TaskItem({ task, onToggle, onDelete, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(task)}
      className="cursor-pointer rounded-lg border border-border bg-secondary/30 p-2.5 transition-colors hover:bg-secondary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold">{task.title}</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
             onClick={() => onClick && onClick(task)}
            >
             Submit Assignment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }}
            >
              Mark as{" "}
              {task.status === "active" ? "completed" : "active"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {task.description}
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {(task.tags || []).map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="text-[10px]"
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function TaskManagement() {
  const queryClient = useQueryClient();
  const studentId = decodeToken()?.userId || null;

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    course: "",
    chapter: "",
    topic: "",
  });

  const useTasksByStatus = (status) =>
    useQuery({
      queryKey: ["studentTasks", studentId, status],
      queryFn: async () => {
        if (!studentId) return { count: 0, tasks: [] };
        const res = await staskapi.getTasksByStatus(
          studentId,
          status
        );
        return res?.data ?? res ?? { count: 0, tasks: [] };
      },
      enabled: Boolean(studentId),
      staleTime: 5 * 60 * 1000,
    });

  const activeQuery = useTasksByStatus(GetTasksByStatusStatusEnum.Active);
  const completedQuery = useTasksByStatus(
    GetTasksByStatusStatusEnum.Completed
  );

  const active = useMemo(
    () => (activeQuery.data?.tasks || []).map((t) => ({ ...t, status: "active" })),
    [activeQuery.data]
  );
  const completed = useMemo(
    () => (completedQuery.data?.tasks || []).map((t) => ({ ...t, status: "completed" })),
    [completedQuery.data]
  );

  const { data: courses = [] } = useQuery({
    queryKey: ["studentEnrolledCourses", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const res = await staskapi.getEnrolledCourses(studentId);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(studentId),
    staleTime: 10 * 60 * 1000,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["studentTaskChapters", draft.course],
    queryFn: async () => {
      if (!draft.course) return [];
      const res = await staskapi.getChaptersByCourse(draft.course);
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(draft.course),
    staleTime: 10 * 60 * 1000,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["studentTaskTopics", draft.chapter],
    queryFn: async () => {
      if (!draft.chapter) return [];
      const res = await staskapi.getTopicsByChapter(
        Number(draft.chapter)
      );
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: Boolean(draft.chapter),
    staleTime: 10 * 60 * 1000,
  });

  const refreshTasks = (status) =>
    queryClient.invalidateQueries([
      "studentTasks",
      studentId,
      status,
    ]);

  const addTaskMutation = useMutation({
    mutationFn: (payload) => staskapi.addStudentTask(payload),
    onSuccess: () => {
      toast.success("Task created successfully");
      refreshTasks(GetTasksByStatusStatusEnum.Active);
      refreshTasks(GetTasksByStatusStatusEnum.Completed);
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

    addTaskMutation.mutate({
      title: draft.title,
      description: draft.description,
      courseId: draft.course,
      chapterId: draft.chapter ? Number(draft.chapter) : undefined,
      topicId: draft.topic ? Number(draft.topic) : undefined,
      studentId,
    });
  };

  const toggle = (id) => {
    const isActive = active.some((t) => t.id === id);
    const targetStatus = isActive
      ? GetTasksByStatusStatusEnum.Completed
      : GetTasksByStatusStatusEnum.Active;

    queryClient.setQueryData(
      ["studentTasks", studentId, targetStatus],
      (old) => {
        const list = isActive ? active : completed;
        const task = list.find((t) => t.id === id);
        return {
          count: (old?.count || 0) + 1,
          tasks: [...(old?.tasks || []), task],
        };
      }
    );

    queryClient.setQueryData(
      ["studentTasks", studentId, isActive ? GetTasksByStatusStatusEnum.Active : GetTasksByStatusStatusEnum.Completed],
      (old) => {
        const remaining = (old?.tasks || []).filter((t) => t.id !== id);
        return { count: remaining.length, tasks: remaining };
      }
    );

    toast.success("Task status updated");
  };

  const remove = (id) => {
    const isActive = active.some((t) => t.id === id);
    const statusKey = isActive
      ? [GetTasksByStatusStatusEnum.Active]
      : [GetTasksByStatusStatusEnum.Completed];

    queryClient.setQueryData(
      ["studentTasks", studentId, statusKey[0]],
      (old) => {
        const remaining = (old?.tasks || []).filter((t) => t.id !== id);
        return { count: remaining.length, tasks: remaining };
      }
    );

    toast.success("Task removed");
  };

  const handleSubmissionSuccess = (submissionData) => {
    queryClient.setQueryData(
      ["studentTasks", studentId, GetTasksByStatusStatusEnum.Completed],
      (old) => {
        const moved = active.find((t) => t.id === submissionData.taskId);
        if (!moved) return old;
        return {
          count: (old?.count || 0) + 1,
          tasks: [
            ...(old?.tasks || []),
            {
              ...moved,
              submissionNotes: submissionData.notes,
              attachments: submissionData.attachments,
            },
          ],
        };
      }
    );

    queryClient.setQueryData(
      ["studentTasks", studentId, GetTasksByStatusStatusEnum.Active],
      (old) => {
        const remaining = (old?.tasks || []).filter(
          (t) => t.id !== submissionData.taskId
        );
        return { count: remaining.length, tasks: remaining };
      }
    );
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">
            Task Management
          </CardTitle>

          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            <Plus className="mr-1 h-4 w-4" />
            New Task
          </Button>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          {open && (
            <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-3">
              <div className="text-sm font-semibold">
                Create New Task
              </div>

              <Input
                placeholder="Task title"
                value={draft.title}
                onChange={(e) =>
                  setDraft({ ...draft, title: e.target.value })
                }
              />

              <Textarea
                placeholder="Description"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />



              <div className="grid min-w-0 grid-cols-3 gap-1.5">
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
                      <SelectItem
                        key={c.courseId}
                        value={c.courseId}
                      >
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
                  onValueChange={(v) =>
                    setDraft({ ...draft, topic: v })
                  }
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
                <Button size="sm" onClick={handleCreate} disabled={addTaskMutation.isPending}>
                  {addTaskMutation.isPending ? "Creating..." : "Create"}
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

          <Tabs
            defaultValue="active"
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({active.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completed.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="min-h-0 flex-1">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {activeQuery.isLoading ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : active.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No active tasks
                    </div>
                  ) : (
                    active.map((t) => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        onToggle={toggle}
                        onDelete={remove}
                        onClick={(task) => setSelectedTask(task)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="completed" className="min-h-0 flex-1">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {completedQuery.isLoading ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : completed.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No completed tasks
                    </div>
                  ) : (
                    completed.map((t) => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        onToggle={toggle}
                        onDelete={remove}
                        onClick={(task) => setSelectedTask(task)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SubmissionModal
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onSubmitSuccess={handleSubmissionSuccess}
      />
    </>
  );
}
