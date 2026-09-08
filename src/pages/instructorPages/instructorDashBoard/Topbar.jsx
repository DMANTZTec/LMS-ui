import { Menu, Search, Bell } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StaffNavbarAvatar from "@/features/Avatar/staff/StaffNavbarAvatar";

function getStaffFromSession() {
  try {
    return JSON.parse(sessionStorage.getItem("otpStaff") || "{}");
    //const staffId = JSON.parse(localStorage.getItem("staffId"));
  } catch {
    return {};
  }
}

function getDisplayName(stfData) {
  if (stfData?.name) return stfData.name;
  if (stfData?.email) {
    const prefix = stfData.email
      .split("@")[0]
      .replace(/\d+$/g, "")
      .replace(/[._-]+/g, " ")
      .trim();

    if (prefix) {
      return prefix.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  return "Instructor";
}

export default function Topbar({ onMenuClick }) {
  const stfData = getStaffFromSession();

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-5 md:px-8 lg:py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="shrink-0 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-800 md:text-2xl">
            Instructor Dashboard
          </h1>
          <p className="mt-1 truncate text-xs text-slate-400 md:text-sm">
            Welcome back, {getDisplayName(stfData)} • {stfData.staffId || "Staff"}
          </p>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-2 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="w-48 rounded-lg border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus-visible:ring-blue-500 lg:w-64"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0 rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            1
          </span>
        </Button>

        <StaffNavbarAvatar />
      </div>
    </header>
  );
}