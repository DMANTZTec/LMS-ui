import { useState, useCallback, useEffect } from "react";
import { BookOpen, Calendar, GraduationCap, Loader2 } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";
import { api } from "@/api/CourseMgtController";
import { staffcourseApi } from "@/api/staff-course-controller";
import { cAdminControllerApi } from "@/api/class-admin-controller";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to get today's date string in YYYY-MM-DD format safely
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to return the day immediately following a selected date string (YYYY-MM-DD)
const getNextDayString = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1); // Increment day by exactly 1
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ─── Real-Time Production Validation Schema ──────────────────────────────────
const scheduleFormSchema = z.object({
  subjectId: z.string({ required_error: "Subject selection is required" }).min(1, "Subject selection is required"),
  courseId: z.string({ required_error: "Course selection is required" }).min(1, "Course selection is required"),
  batchName: z.string().trim().min(3, "Batch name must be at least 3 characters long").max(50, "Batch name cannot exceed 50 characters"),
  beginDate: z.string().min(1, "Begin Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  selectedDays: z.array(z.string()).min(1, "Please select at least one recurring day"),
  selectedInstructors: z.array(z.string()).min(1, "Please assign at least one instructor"),
  dayTimes: z.record(
    z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
    })
  )
}).refine((data) => {
  if (!data.beginDate || !data.endDate) return true;
  const start = new Date(data.beginDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: "End Date must be strictly greater than Begin Date",
  path: ["endDate"], 
}).refine((data) => {
  for (const day of data.selectedDays) {
    const times = data.dayTimes[day];
    if (times?.start && times?.end) {
      if (times.start >= times.end) return false;
    }
  }
  return true;
}, {
  message: "Start time must be earlier than End time",
  path: ["dayTimes"] 
});

function calcDuration(start, end) {
  if (!start || !end) return "—";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m}m`;
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 font-medium mt-1.5 animate-fadeIn">{message}</p>;
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-5 h-5 flex items-center justify-center text-indigo-600">{icon}</div>
      <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</span>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-medium text-slate-600 uppercase mb-2">{children}</label>;
}

function SelectInput({ value, onChange, children, className = "", disabled, isError }) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition ${className} ${
          isError ? "border-red-300 focus:ring-red-400 focus:border-red-400" : "border-slate-200 focus:ring-indigo-400 focus:border-indigo-400"
        } disabled:bg-slate-100 disabled:cursor-not-allowed`}
      >
        {children}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function SCheduleCourse({ onSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); 

  const [subjectId, setSubjectId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed"]);
  const [dayTimes, setDayTimes] = useState({
    Mon: { start: "", end: "" },
    Tue: { start: "", end: "" },
    Wed: { start: "", end: "" },
  });

  const todayStr = getTodayString();
  // Calculate minimum end date string contextually
  const minEndDateStr = beginDate ? getNextDayString(beginDate) : todayStr;

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await api.viewAllSubjects();
        setSubjects(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      if (!subjectId) {
        setCourses([]);
        setCourseId("");
        return;
      }
      try {
        const response = await api.viewCoursesBySubject(subjectId);
        const coursesData = Array.isArray(response) ? response : response?.data || [];
        setCourses(coursesData);
        setCourseId(coursesData.length > 0 ? coursesData[0].courseId.toString() : "");
        clearFieldError("subjectId");
      } catch (error) {
        console.error(error);
      }
    }
    fetchCourses();
  }, [subjectId]);

  useEffect(() => {
    async function fetchInstructors() {
      if (!courseId) {
        setInstructors([]);
        setSelectedInstructors([]);
        return;
      }
      try {
        const response = await staffcourseApi.getInstructorsByCourse(courseId);
        setInstructors(Array.isArray(response) ? response : response?.data || []);
        setSelectedInstructors([]); 
        clearFieldError("courseId");
      } catch (error) {
        console.error(error);
      }
    }
    fetchInstructors();
  }, [courseId]);

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const toggleInstructor = useCallback((staffId) => {
    setSelectedInstructors((prev) => {
      const updated = prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId];
      if (updated.length > 0) setErrors((err) => ({ ...err, selectedInstructors: undefined }));
      return updated;
    });
  }, []);

  const toggleDay = useCallback((day) => {
    setSelectedDays((prev) => {
      const isOn = prev.includes(day);
      const next = isOn ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
      
      if (next.length > 0) setErrors((err) => ({ ...err, selectedDays: undefined }));

      setDayTimes((t) => {
        const copy = { ...t };
        if (isOn) delete copy[day];
        else copy[day] = { start: "", end: "" };
        return copy;
      });
      return next;
    });
  }, []);

  const updateTime = useCallback((day, field, value) => {
    setDayTimes((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setErrors((err) => ({ ...err, dayTimes: undefined }));
  }, []);

  const handleGenerate = async () => {
    const rawFormPayload = {
      subjectId,
      courseId,
      batchName,
      beginDate,
      endDate,
      selectedDays,
      selectedInstructors,
      dayTimes,
    };

    const validationResult = scheduleFormSchema.safeParse(rawFormPayload);

    if (!validationResult.success) {
      const fieldsMap = {};
      validationResult.error.issues.forEach((issue) => {
        const pathKey = issue.path[0];
        if (!fieldsMap[pathKey]) {
          fieldsMap[pathKey] = issue.message;
        }
      });
      setErrors(fieldsMap);
      toast.error("Please fix the validation errors below.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const formattedDayTimes = Object.keys(dayTimes).reduce((acc, day) => {
        const { start, end } = dayTimes[day];
        acc[day] = {
          start: start ? `${start}:00` : "00:00:00",
          end: end ? `${end}:00` : "00:00:00"
        };
        return acc;
      }, {});

      const requestBody = {
        batchName,
        beginDate,
        endDate,
        selectedDays,
        dayTimes: formattedDayTimes,
        selectedInstructors
      };

      await cAdminControllerApi.addClass(courseId, requestBody);
      toast.success("Course schedule successfully generated!");
      if (onSuccess) setTimeout(() => onSuccess(), 500);
      
    } catch (error) {
      console.error(error);
      toast.error("An API error occurred while generating schedules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Schedule a Course</h1>
        <p className="text-sm text-slate-600 mt-1">Define batch details, assign instructors, and generate the class timetable.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 items-start">
        
        {/* Left Form Panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col gap-5">
          <SectionHeader icon={<BookOpen className="w-5 h-5" />} title="Schedule Details" />

          {/* Subject Field */}
          <div>
            <FieldLabel>Subject</FieldLabel>
            <SelectInput value={subjectId} onChange={setSubjectId} isError={!!errors.subjectId}>
              <option value="">Select a Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id.toString()}>{s.subjectNm}</option>
              ))}
            </SelectInput>
            <ErrorMessage message={errors.subjectId} />
          </div>

          {/* Course Field */}
          <div>
            <FieldLabel>Course</FieldLabel>
            <SelectInput value={courseId} onChange={setCourseId} disabled={!subjectId} isError={!!errors.courseId}>
              <option value="">Select a Course</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId.toString()}>{c.courseTitle} ({c.courseId})</option>
              ))}
            </SelectInput>
            <ErrorMessage message={errors.courseId} />
          </div>

          {/* Batch Name Field */}
          <div>
            <FieldLabel>Batch / Section Name</FieldLabel>
            <input
              type="text"
              placeholder="e.g. Batch 2026-A"
              value={batchName}
              onChange={(e) => { setBatchName(e.target.value); clearFieldError("batchName"); }}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition ${
                errors.batchName ? "border-red-300 focus:ring-red-400 focus:border-red-400" : "border-slate-200 focus:ring-indigo-400"
              }`}
            />
            <ErrorMessage message={errors.batchName} />
          </div>

          {/* Dates Row Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Begin Date</FieldLabel>
              <input
                type="date"
                value={beginDate}
                min={todayStr} 
                onChange={(e) => { 
                  const selectedBegin = e.target.value;
                  setBeginDate(selectedBegin); 
                  clearFieldError("beginDate");
                  
                  // Reset end date if it falls on or before the new begin date
                  if (endDate && endDate <= selectedBegin) {
                    setEndDate("");
                  }
                }}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition ${
                  errors.beginDate ? "border-red-300 focus:ring-red-400 focus:border-red-400" : "border-slate-200 focus:ring-indigo-400"
                }`}
              />
              <ErrorMessage message={errors.beginDate} />
            </div>
            
            <div>
              <FieldLabel>End Date</FieldLabel>
              <input
                type="date"
                value={endDate}
                min={minEndDateStr} // Disables selecting any dates before or equal to the Begin Date
                disabled={!beginDate} 
                onChange={(e) => { setEndDate(e.target.value); clearFieldError("endDate"); }}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition ${
                  errors.endDate ? "border-red-300 focus:ring-red-400 focus:border-red-400" : "border-slate-200 focus:ring-indigo-400"
                } disabled:bg-slate-100 disabled:cursor-not-allowed`}
              />
              <ErrorMessage message={errors.endDate} />
            </div>
          </div>

          {/* Instructors List */}
          <div>
            <FieldLabel>Instructors</FieldLabel>
            {!courseId ? (
              <p className="text-xs text-slate-400 italic">Select a course to view available instructors.</p>
            ) : instructors.length === 0 ? (
              <p className="text-xs text-red-500 font-medium bg-red-50 p-2.5 rounded border border-red-200">
                First go to Courses Tab, Assign Instructors to course.
              </p>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2.5">
                  {instructors.map((inst) => {
                    const active = selectedInstructors.includes(inst.staffId.toString());
                    const initials = `${inst.firstNm?.[0] || ""}${inst.lastNm?.[0] || ""}`.toUpperCase();
                    return (
                      <button
                        key={inst.staffId}
                        type="button"
                        onClick={() => toggleInstructor(inst.staffId.toString())}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          active ? "bg-slate-100 border-indigo-500 text-indigo-600 font-medium" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${active ? "bg-indigo-600" : "bg-slate-400"}`}>
                          {initials || "IN"}
                        </span>
                        <span>{inst.firstNm} {inst.lastNm}</span>
                      </button>
                    );
                  })}
                </div>
                <ErrorMessage message={errors.selectedInstructors} />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel Component */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col gap-5 h-full">
          <SectionHeader icon={<Calendar className="w-5 h-5" />} title="Generate Classes" />

          {/* Recurring Toggles */}
          <div>
            <FieldLabel>Recurring Days</FieldLabel>
            <div className="flex gap-2 flex-wrap">
              {ALL_DAYS.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-10 rounded-lg text-xs font-medium transition-all ${
                      active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <ErrorMessage message={errors.selectedDays} />
          </div>

          {/* Dynamic Time Input Elements */}
          {selectedDays.length > 0 && (
            <div className="flex flex-col gap-3 mt-2">
              {selectedDays.map((day) => {
                const t = dayTimes[day] || { start: "", end: "" };
                const dur = calcDuration(t.start, t.end);
                return (
                  <div key={day} className="flex flex-row items-center gap-2 py-1.5 border-b border-slate-50 last:border-none w-full">
  {/* Left Side: Day and Inputs (80% Width) */}
  <div className="flex items-center gap-2 w-11/12">
    <span className="text-sm font-medium text-slate-700 w-10 shrink-0">{day}</span>
    <input
      type="time"
      disabled={isSubmitting}
      value={t.start}
      onChange={(e) => updateTime(day, "start", e.target.value)}
      className="flex-1 min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <span className="text-slate-400 shrink-0">–</span>
    <input
      type="time"
      disabled={isSubmitting}
      value={t.end}
      onChange={(e) => updateTime(day, "end", e.target.value)}
      className="flex-1 min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  </div>

  {/* Right Side: Duration Indicator (20% Width) */}
  <div className="w-1/12 text-xs font-medium text-slate-500  px-2 py-1.5 rounded text-center truncate">
    {dur}
  </div>
</div>
                );
              })}
              <ErrorMessage message={errors.dayTimes} />
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-3 rounded-lg transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Scheduling...</>
            ) : (
              <><Calendar className="w-4 h-4" />Generate Course Schedule</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}