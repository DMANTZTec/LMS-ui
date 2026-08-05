import React from "react";
import { LogOut } from "lucide-react";

// Shadcn UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function StaffNavbarAvatar() {
  // Read from the correct "otpStaff" session key
  const stfData = JSON.parse(
    sessionStorage.getItem("otpStaff") || "{}"
  );
  
  // Extract avatar initials safely from the email prefix
  const getInitials = () => {
    if (!stfData?.email) return <div className="border rounded-full p-1 md:p-2">
                        <img src={Avatar} className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
    return stfData?.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || ""};

  const handleLogout = () => {
    // Targeted removal of authentication credentials
    localStorage.removeItem('LmsJwTtoken');
    sessionStorage.removeItem('otpStaff');
    
    // Redirect back to staff login screen
    window.location.href = "/"; 
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        {/* Trigger */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-emerald-500">
            <Avatar className="h-10 w-10 border border-gray-200 transition-transform duration-200 hover:scale-105">
              {/* Optional: Add profilePicUrl here if it gets appended to otpStaff later */}
              <AvatarImage src={stfData?.profilePicUrl} alt="Staff Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-semibold text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        {/* Floating Dropdown Panel */}
        <DropdownMenuContent className="w-52 mt-2 rounded-xl p-1.5 shadow-xl border border-gray-100 bg-white" align="end" forceMount>
          
          {/* Email View Only */}
          <div className="px-2.5 py-2 text-xs text-gray-500 truncate font-medium">
            {stfData?.email || "staff@lms.com"}
          </div>
          
          <DropdownMenuSeparator className="bg-gray-100 my-1" />

          {/* Logout Action */}
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