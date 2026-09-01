import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Star,
  Folder,
  Clock,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "reports", label: "Student Reports", icon: BarChart3 },
  { id: "doing", label: "How am I doing", icon: Star },
  { id: "content", label: "My Content", icon: Folder },
];

export const overviewMetrics = [
  {
    id: "batches",
    label: "Active Batches",
    value: 8,
    secondaryLabel: "Completed",
    secondaryValue: 24,
    icon: BookOpen,
    iconChip: "bg-blue-50 text-blue-600",
  },
  {
    id: "classes",
    label: "Classes Taken",
    value: 142,
    secondaryLabel: "Scheduled",
    secondaryValue: 18,
    icon: Clock,
    iconChip: "bg-emerald-50 text-emerald-600",
    footnote: "284h",
  },
  {
    id: "students",
    label: "Active Students",
    value: 312,
    secondaryLabel: "Total",
    secondaryValue: 489,
    icon: Users,
    iconChip: "bg-blue-50 text-blue-600",
  },
];

export const tasksData = [
  {
    id: 1,
    name: "Anya Patel",
    initials: "AP",
    topic: "React Hooks &",
    task: "Build a custom",
    date: "28 Aug 2026",
    avatarBg: "bg-blue-100 text-blue-600",
    status: "pending",
    inMyClass: true,
  },
  {
    id: 2,
    name: "Liam Osei",
    initials: "LO",
    topic: "CSS Grid & Fle:",
    task: "Responsive da:",
    date: "27 Aug 2026",
    avatarBg: "bg-green-100 text-green-600",
    status: "pending",
    inMyClass: true,
  },
  {
    id: 3,
    name: "Sara Kim",
    initials: "SK",
    topic: "TypeScript Ger",
    task: "Create a type-:",
    date: "27 Aug 2026",
    avatarBg: "bg-purple-100 text-purple-600",
    status: "pending",
    inMyClass: true,
  },
  {
    id: 4,
    name: "Rahul Mehra",
    initials: "RM",
    topic: "Node.js API D",
    task: "Design REST e:",
    date: "26 Aug 2026",
    avatarBg: "bg-amber-100 text-amber-600",
    status: "pending",
    inMyClass: false,
  },
  {
    id: 5,
    name: "Liam Osei",
    initials: "LO",
    topic: "CSS Grid & Fle:",
    task: "Responsive da:",
    date: "27 Aug 2026",
    avatarBg: "bg-green-100 text-green-600",
    status: "pending",
    inMyClass: true,
  }
];

export const scheduleData = [
  {
    id: 1,
    time: "09:00 AM",
    date: "Mon, 01 Sep 2026",
    course: "React Advanced Patterns",
  },
  {
    id: 2,
    time: "11:00 AM",
    date: "Tue, 02 Sep 2026",
    course: "TypeScript Deep Dive",
  },
  {
    id: 3,
    time: "02:00 PM",
    date: "Wed, 03 Sep 2026",
    course: "Node.js Fundamentals",
  },
  {
    id: 4,
    time: "10:00 AM",
    date: "Thu, 04 Sep 2026",
    course: "CSS Grid Mastery",
  },
];

export const SCHEDULE_VIEWS = ["Week", "Month", "All"];