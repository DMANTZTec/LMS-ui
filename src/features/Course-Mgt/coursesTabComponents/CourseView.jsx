import React from "react";
import { Eye, BookOpen, Globe, Layers, Pencil, ShieldAlert, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


const ViewCourse = ({ course }) => {
    const navigate = useNavigate();
  if (!course) return null;

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-slate-100 transition-colors">
          <Eye className="w-5 h-5 text-blue-600" />
        </Button>
      </DialogTrigger>

      {/* Main Dialog Container */}
      <DialogContent className="sm:max-w-6xl w-[92vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl shadow-2xl border border-slate-200/80 gap-0 flex flex-col justify-between">
        <DialogHeader className="sr-only">
          <DialogTitle>{course.courseTitle || "Course Details"}</DialogTitle>
        </DialogHeader>

        {/* Dynamic Wrapper Body */}
        <div className="bg-slate-50 flex-1 flex flex-col font-sans overflow-y-auto">
          
          {/* Header Banner Section */}
          <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-slate-900">
            {course.courseImage ? (
              <img
                src={course.courseImage}
                alt={course.courseTitle}
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 opacity-80" />
            )}

            {/* Premium Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Inner Content Placement */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs font-mono tracking-wider text-slate-300 border border-white/5">
                    ID: {course.courseId || "N/A"}
                  </span>

                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight drop-shadow-sm">
                    {course.courseTitle || "Untitled Course"}
                  </h1>

                  <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-300 font-medium">
                    <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
                      <Globe size={13} className="text-blue-400" />
                      {course.language || "English"}
                    </div>

                    <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
                      <BookOpen size={13} className="text-indigo-400" />
                      {course.subjectNm || "General"}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-end">
                  <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md uppercase tracking-wide">
                    {course.level || "All Levels"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Content Grid - Balanced 2:1 column configuration */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Primary Details Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description Container */}
              <Card className="border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 border-slate-100 uppercase tracking-wider text-slate-400">
                    Course Description
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {course.description || "No description provided for this course."}
                  </p>
                </CardContent>
              </Card>

              {/* Media Video Container */}
              <Card className="border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100 uppercase tracking-wider text-slate-400">
                    Introduction Video
                  </h2>

                  {course.introVideo ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                      <video
                        controls
                        className="w-full h-full object-contain"
                        poster={course.courseImage}
                      >
                        <source src={course.introVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <ShieldAlert className="w-7 h-7 mb-1.5 stroke-[1.5]" />
                      <p className="text-xs font-medium">No Introduction Video Available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Metric and Functional Column */}
            <div className="space-y-6">
              
              {/* Highlighted Syllabus Actions (Real-time Callout Design) */}
              <Card className="border-blue-200 bg-gradient-to-b from-blue-50/40 to-white shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardContent className="p-5">
                  <h2 className="font-bold text-slate-900 text-sm mb-0.5">
                    Course Syllabus
                  </h2>
                  <p className="text-[11px] text-slate-400 mb-4">
                    Manage live chapters and timeline assets.
                  </p>

                  <div className="space-y-2.5">
                    <Button onClick={()=> navigate(`/courseDetails/${course.courseId}`)}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide shadow-sm py-4 h-auto transition-all active:scale-[0.99] ">
                      <Layers className="mr-2 h-3.5 w-3.5" />
                      View Chapters
                    </Button>

                    <Button onClick={() => navigate(`/course-builder/${course.courseId}`)} 
                      variant="outline"
                      className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-xs py-4 h-auto transition-all active:scale-[0.99]"
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5 text-slate-500" />
                      Edit Chapters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Targeted Skills Tag Cloud */}
              <Card className="border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-5">
                  <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase text-slate-400 mb-3">
                    Targeted Skills
                  </h2>

                  {course.skills && course.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200/60 text-slate-600 text-xs font-medium transition-colors cursor-default capitalize"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No skills listed.</p>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Administrative Data Fields */}
              <Card className="border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-5">
                  <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase text-slate-400 mb-3">
                    Meta Registry Information
                  </h2>

                  <div className="divide-y divide-slate-100 text-xs">
                    {/* <div className="flex justify-between py-2.5">
                      <span className="text-slate-500">Course ID</span>
                      <span className="font-mono text-slate-800 font-semibold">{course.courseId || "—"}</span>
                    </div> */}

                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-500">Subject Module</span>
                      <span className="text-slate-800 font-semibold">{course.subjectNm || "—"}</span>
                    </div>

                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-500">Provider ID</span>
                      <span className="font-mono text-slate-700">{course.providerId || "—"}</span>
                    </div>

                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-500">Instruction Level</span>
                      <span className="text-slate-800 font-medium">{course.level || "—"}</span>
                    </div>

                    {course.createdDt && (
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-500">Record Created</span>
                        <span className="text-slate-600">
                          {new Date(course.createdDt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {course.updatedDt && (
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-500">Last Modified</span>
                        <span className="text-slate-600">
                          {new Date(course.updatedDt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div> 
        </div>

        {/* Global Footer Sticky Navigation Row */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex justify-end shrink-0 gap-3 rounded-b-xl">
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-200 text-slate-600 font-medium text-xs px-5 h-9">
              Close Detail Panel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourse;