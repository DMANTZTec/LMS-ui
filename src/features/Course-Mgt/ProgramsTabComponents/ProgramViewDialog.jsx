import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, BookOpen, Layers, Award, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { api } from '@/api/CourseMgtController';

const ProgramViewDialog = ({ program }) => {
  const [open, setOpen] = useState(false);

  if (!program) return null;
  api.getProgramById(program.id).then((res) => {
      
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto hover:bg-gray-100 transition-colors">
          <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-50 p-0 rounded-xl border border-slate-200 shadow-2xl">
        {/* Banner / Header Summary */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-t-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800/50">
                {program.programId}
              </span>
              <DialogTitle className="text-xl md:text-3xl font-bold tracking-tight text-white mt-3">
                {program.programTitle}
              </DialogTitle>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
                {program.description || "No summary description configured for this operational track."}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 self-start md:self-center">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${program.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${program.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider">{program.status}</span>
            </div>
          </div>

          {/* Metrics Dashboard Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Duration</p>
                <p className="font-semibold text-slate-100">{program.durationInMonths} Months</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Curriculum Size</p>
                <p className="font-semibold text-slate-100">{program.coursesList?.length || 0} Modules</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Provider Track</p>
                <p className="font-semibold text-slate-100">ID Reference #{program.providerId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Structure */}
        <div className="p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Program Modules Breakdown
          </h3>

          {/* Courses Dynamic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.coursesList && program.coursesList.length > 0 ? (
              program.coursesList.map((course) => (
                <div 
                  key={course.id || course.courseId} 
                  className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    {/* Upper Metadata Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] tracking-wider font-bold text-slate-400 uppercase">
                          {course.courseId}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base mt-0.5 line-clamp-1">
                          {course.courseTitle}
                        </h4>
                      </div>
                      
                      {/* Dynamic Difficulty Badge */}
                      <Badge 
                        variant="secondary" 
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded border ${
                          course.level === 'BEGINNER' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                            : 'bg-amber-50 text-amber-700 border-amber-200/60'
                        }`}
                      >
                        {course.level}
                      </Badge>
                    </div>

                    {/* Simple Custom Card Image Slot Handling */}
                    <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                      {course.courseImage && course.courseImage !== "string" ? (
                        <img 
                          src={`/images/courses/${course.courseImage}`} 
                          alt={course.courseTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="text-center p-4 flex flex-col items-center gap-1.5">
                          <Award className="w-7 h-7 text-slate-300" />
                          <span className="text-xs font-medium text-slate-400">Syllabus Reference Module</span>
                        </div>
                      )}
                      
                      {/* Subject Name Overlay Badge */}
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                        {course.subjectNm || "General"}
                      </span>
                    </div>

                    {/* Course Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {course.description && course.description !== "string" 
                        ? course.description 
                        : "Comprehensive tactical program containing targeted industry-aligned concepts and implementation guides."}
                    </p>
                  </div>

                  {/* Skills / Footer Block */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-1.5 mt-auto">
                    <Tag size={12} className="text-slate-400 mr-1" />
                    {course.skills && course.skills.length > 0 ? (
                      course.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 shadow-sm uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] italic text-slate-400">General Conceptual Competencies</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center p-8 bg-white border border-dashed rounded-xl flex flex-col items-center justify-center gap-2">
                <BookOpen className="w-8 h-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No core modules attached to this layout registry track yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-white border-t p-4 px-6 md:px-8 flex justify-end rounded-b-xl">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="text-slate-700 border-slate-200 shadow-sm font-medium hover:bg-slate-50"
          >
            Close Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramViewDialog;