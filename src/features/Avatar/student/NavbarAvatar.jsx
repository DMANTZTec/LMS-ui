import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { LogOut, User, Settings, CreditCard } from "lucide-react";


// Shadcn UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Jotai Atom (Reading the student data you saved during registration/login)
import { studentDataAtom } from "@/store/atoms/authAtoms";

export default function NavbarAvatar() {
  const navigate = useNavigate();
  // Read-only access to student global state
  const studentData = useAtomValue(studentDataAtom);
  const stuData = JSON.parse(
     sessionStorage.getItem("stuRegData") || "{}"
 );
  
  // Fallback fallback styling helpers (Extract initials like "John Doe" -> "JD")
  const getInitials = () => {
    if (!studentData?.firstNm && !stuData?.firstNm) return "ST";
    const first = studentData?.firstNm?.charAt(0)?.toUpperCase() || stuData?.firstNm?.charAt(0)?.toUpperCase();
    const last = studentData?.lastNm?.charAt(0)?.toUpperCase() || stuData?.lastNm?.charAt(0)?.toUpperCase();
    console.log("values of first and last are: ",first,last);
    return `${first}${last}`;
  };

  const getProfileImage = () => {
    const image = studentData?.profileImg || stuData?.profileImg ;
  return image;
  }

  const handleLogout = () => {
    // Clear your session storage and redirect
    //localStorage.removeItem('LmsJwTtoken');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/studentLogin"; 
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        {/* 1. THE TRIGGER: The clickable Avatar element */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500">
            <Avatar className="h-10 w-10 border border-gray-200 transition-transform duration-200 hover:scale-105">
              {/* If backend provides an image URL, show it, otherwise fallback */}
              <AvatarImage src={studentData?.profileImg || stuData?.profileImg} alt={getInitials()} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-sm">
                {getInitials()}
                
              </AvatarFallback>
            </Avatar>
            
          </Button>
        </DropdownMenuTrigger>

        {/* 2. THE CONTENT: The absolute floating panel that drops down */}
        <DropdownMenuContent className="w-56 mt-2 rounded-xl p-1.5 shadow-xl border border-gray-100 bg-white items-center" align="end" forceMount>
          
          {/* Header Info Block */}
          <DropdownMenuLabel className="font-normal px-2 py-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {studentData?.firstNm ? `${studentData?.firstNm} ${studentData?.lastNm}` : `${stuData?.firstNm} ${stuData?.lastNm}`}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[180px]">
                {studentData?.emailId || stuData?.emailId}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-gray-100 my-1" />

          {/* Action Items Group */}
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => navigate("/studentProfile")} 
              className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-gray-700 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
            >
              <User className="h-4 w-4 text-gray-500" />
              <span>My Profile</span>
            </DropdownMenuItem>

            {/* <DropdownMenuItem 
              onClick={() => navigate("/student/my-courses")} 
              className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-gray-700 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
            >
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span>Enrolled Courses</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => navigate("/student/settings")} 
              className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-gray-700 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span>Account Settings</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-100 my-1" />

          {/* Dangerous Zone / Logout */}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-red-600 font-medium cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Log out</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
