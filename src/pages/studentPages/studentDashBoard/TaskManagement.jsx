// TaskManagement.jsx

import { useState } from "react";

import {
  Plus,
  MoreVertical,
} from "lucide-react";

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

import {
  initialTasks,
  courseOptions,
  chapterOptions,
  topicOptions,
} from "./data";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-2.5">

      <div className="flex items-start justify-between gap-2">

        <div className="text-sm font-semibold">
          {task.title}
        </div>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

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
              onClick={() => onToggle(task.id)}
            >
              Mark as{" "}
              {task.status === "active"
                ? "completed"
                : "active"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
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

        {task.tags.map((t) => (
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
  const [tasks, setTasks] = useState(initialTasks);

  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    course: "",
    chapter: "",
    topic: "",
  });

  const active = tasks.filter(
    (t) => t.status === "active"
  );

  const completed = tasks.filter(
    (t) => t.status === "completed"
  );

  const handleCreate = () => {
    if (!draft.title.trim()) return;

    setTasks([
      ...tasks,
      {
        id: `t${Date.now()}`,
        title: draft.title,
        description: draft.description,
        tags: [draft.course, draft.topic].filter(Boolean),
        status: "active",
      },
    ]);

    setDraft({
      title: "",
      description: "",
      course: "",
      chapter: "",
      topic: "",
    });

    setOpen(true);
  };

  const toggle = (id) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === "active"
                  ? "completed"
                  : "active",
            }
          : t
      )
    );

  const remove = (id) =>
    setTasks((prev) =>
      prev.filter((t) => t.id !== id)
    );

  return (
    <Card className="flex flex-col">

      <CardHeader className="flex flex-row items-center justify-between pb-2">

        <CardTitle className="text-base font-semibold">
          Task Management
        </CardTitle>

        <Button
          size="sm"
          onClick={() => setOpen((v) => !v)}
        >
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
                setDraft({
                  ...draft,
                  title: e.target.value,
                })
              }
            />

            <Textarea
              placeholder="Description"
              value={draft.description}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  description: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-3 gap-2">

              <Select
                value={draft.course}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    course: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Course" />
                </SelectTrigger>

                <SelectContent>
                  {courseOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={draft.chapter}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    chapter: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>

                <SelectContent>
                  {chapterOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={draft.topic}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    topic: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>

                <SelectContent>
                  {topicOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="flex gap-2">

              <Button
                size="sm"
                onClick={handleCreate}
              >
                Create
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

          <TabsContent
            value="active"
            className="min-h-0 flex-1"
          >

            <ScrollArea className="h-full pr-2">

              <div className="space-y-2">

                {active.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    onToggle={toggle}
                    onDelete={remove}
                  />
                ))}

              </div>

            </ScrollArea>

          </TabsContent>

          <TabsContent
            value="completed"
            className="min-h-0 flex-1"
          >

            <ScrollArea className="h-full pr-2">

              <div className="space-y-2">

                {completed.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    onToggle={toggle}
                    onDelete={remove}
                  />
                ))}

              </div>

            </ScrollArea>

          </TabsContent>

        </Tabs>

      </CardContent>

    </Card>
  );
}