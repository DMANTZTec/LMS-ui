import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Star,
  Folder,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "reports", label: "Student Reports", icon: BarChart3 },
  { id: "doing", label: "How am I doing", icon: Star },
  { id: "content", label: "My Content", icon: Folder },
];

export const SCHEDULE_VIEWS = ["Week", "Month", "All"];

export const COURSE_STATUS_FILTER = ["All", "Active", "Completed", "Planned"];

export const COURSE_STATUS_STYLES = {
  ACTIVE: "bg-blue-100 text-[#155DFC] border-0",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-0",
  PLANNED: "bg-amber-100 text-amber-700 border-0",
};

export const COURSE_LEVEL_STYLES = {
  Beginner: "bg-slate-100 text-slate-600 border-0",
  Intermediate: "bg-violet-100 text-violet-600 border-0",
  Advanced: "bg-rose-100 text-rose-600 border-0",
};