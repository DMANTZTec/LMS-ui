import { BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

import CourseCard from "./statusCards/CourseCard";
import ClassCard from "./statusCards/ClassCard";
import HoursCard from "./statusCards/HoursCard";
import MentorPointsCard from "./statusCards/MentorPointsCard";

import { WeeklyPerformance } from "./WeeklyPerformance";
import { WeeklySchedule } from "./WeeklySchedule";
import TaskManagement from "./TaskManagement";

import LoginIcon from "@/assets/images/loginicon.png";

export function StudentDashBoard() {
  return (
    // Lock the container to the viewport height
   <div className="lg:h-screen w-full overflow-hidden bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-6">
  <div className="flex h-full flex-col gap-2 sm:gap-3 md:gap-4">
    
    <header className="flex flex-col gap-3 sm:flex-col md:flex-row md:items-center md:justify-between">
      
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-2xl bg-[#DBEAFE]">
          <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6 text-[#155DFC]" />
        </div>

        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
            Student Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back! Here's your learning overview
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 md:gap-4 w-full md:w-auto">
        
          <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-[10px] sm:text-xs md:text-xs lg:text-sm px-2 sm:px-3 md:px-3 lg:px-5 h-8 sm:h-8 md:h-9 lg:h-10 whitespace-nowrap">
             <BookOpen className="mr-1 h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 shrink-0" />
                 Explore More Courses
          </Button>

        <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border bg-secondary">
          <img
            src={LoginIcon}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </header>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <CourseCard />
      <ClassCard />
      <HoursCard />
      <MentorPointsCard />
    </section>

    <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-3 overflow-hidden">
      <WeeklyPerformance />
      <WeeklySchedule />
      <TaskManagement />
    </section>

  </div>
</div>
  );
}