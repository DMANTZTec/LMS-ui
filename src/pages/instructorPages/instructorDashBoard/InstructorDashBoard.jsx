import { useState } from "react";
import { Navigate } from "react-router-dom";

import { getUserRole } from "@/utils/tokenUtility";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Overview from "./sections/Overview";
import MyCourses from "./sections/MyCourses";
import Placeholder from "./sections/Placeholder";
import { NAV_ITEMS } from "./data";

export function InstructorDashBoard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (getUserRole() !== "INSTRUCTOR") {
    return <Navigate to="/Staff-dashboard" replace />;
  }

  const activeItem = NAV_ITEMS.find((item) => item.id === activeNav);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar
        active={activeNav}
        onNavigate={setActiveNav}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:min-h-0 lg:flex-1 lg:gap-4 lg:overflow-hidden lg:p-6 xl:p-8">
          {activeNav === "dashboard" ? (
            <Overview />
          ) : activeNav === "courses" ? (
            <MyCourses />
          ) : (
            <Placeholder
              item={activeItem?.label || "Section"}
              onBack={() => setActiveNav("dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}