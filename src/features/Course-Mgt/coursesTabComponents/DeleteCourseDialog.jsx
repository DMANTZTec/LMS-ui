import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { api } from "@/api/CourseMgtController";

const DeleteCourseDialog = ({ courseId, id, courseTitle, onDeleteSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const savedUser = JSON.parse(sessionStorage.getItem("otpStaff"));
  const staffId = savedUser?.staffId;


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Replace this with your actual API invocation line
      // await axios.delete(`/api/courses/${id || courseId}`);
      await api.deleteCourse(id,staffId);
      
      // Simulate real-time async response delays
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Trigger data grid revalidation
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete course resource:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Table Action Trigger (Matches the trash icon pattern) */}
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* Structured Confirmation Dialog Content */}
      <DialogContent className="max-w-md w-[90vw] p-6 rounded-xl border border-slate-200 bg-white shadow-2xl gap-0 flex flex-col">
        
        {/* Warning Icon & Structural Header */}
        <div className="flex items-start gap-4 pb-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full border border-red-100 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
                Delete Course Record
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this course configuration? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Data Meta Panel */}
        <div className="my-2 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5 font-sans">
          <div className="flex justify-between">
            <span className="text-slate-400">Course Identifier:</span>
            <span className="font-mono font-bold text-slate-800">{courseId || id || "N/A"}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-slate-400 whitespace-nowrap">Course Title:</span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
              {courseTitle || "Untitled Course"}
            </span>
          </div>
        </div>

        {/* Bottom Utility Action Row */}
        <DialogFooter className="mt-6 flex flex-row justify-end gap-2.5">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              disabled={isDeleting}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium px-4 h-9 shadow-sm"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 h-9 shadow-sm shadow-red-600/10 transition-all flex items-center justify-center min-w-[90px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;