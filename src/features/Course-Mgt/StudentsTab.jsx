import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  GraduationCap,
  Search,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserMinus,
} from "lucide-react";

import { studentApi } from "@/api/student-controller.api";
import { enrollmentApi } from "@/api/enrollment-controller";
import EnrollStudentDialog from "./studentsTabComponents/EnrollStudentDialog";
//import UnrollStudentDialog from "./studentsTabComponents/UnrollStudentDialog";

function getInitials(firstNm, lastNm) {
  return `${firstNm?.[0] ?? ""}${lastNm?.[0] ?? ""}`.toUpperCase();
}

function formatJoinDate(createdDt) {
  if (!createdDt) return "—";
  const d = new Date(createdDt);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMobile(mobileNum) {
  if (!mobileNum) return "—";
  const digits = mobileNum.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return `+${digits}`;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-teal-100 text-teal-600",
];

function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

async function fetchAllStudents() {
  const result = await studentApi.getAllStudents();
  return Array.isArray(result) ? result : result?.data || [];
}

export default function StudentsTab() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnrollStudent, setSelectedEnrollStudent] = useState(null);
  const [selectedUnrollStudent, setSelectedUnrollStudent] = useState(null);
  const [enrollmentMap, setEnrollmentMap] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 10;

  const {
    data: students = [],
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getStudents"],
    queryFn: fetchAllStudents,
    staleTime: 2 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const fullName = `${s.firstNm} ${s.lastNm}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (s.emailId || "").toLowerCase().includes(q) ||
        (s.studentId || "").toLowerCase().includes(q) ||
        (s.mobileNum || "").toLowerCase().includes(q)
      );
    });
  }, [students, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalCount = students.length;
  const enrolledCount = students.filter((s) => hasEnrollments(s.studentId)).length;
  const unEnrolledCount = Math.max(totalCount - enrolledCount, 0);

  function hasEnrollments(studentId) {
    return (enrollmentMap[studentId] ?? []).length > 0;
  }

  const fetchEnrollments = async (studentId) => {
    try {
      const result = await enrollmentApi.getEnrollmentsByStudent(studentId);
      return Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (paginatedStudents.length > 0 && !isPending) {
      let cancelled = false;
      Promise.all(
        paginatedStudents.map((s) => fetchEnrollments(s.studentId))
      ).then((results) => {
        if (cancelled) return;
        const map = {};
        paginatedStudents.forEach((s, idx) => {
          map[s.studentId] = results[idx];
        });
        setEnrollmentMap((prev) => ({ ...prev, ...map }));
      });
      return () => {
        cancelled = true;
      };
    }
  }, [paginatedStudents, isPending, refreshKey]);

  const handleEnrolled = () => {
    setRefreshKey((k) => k + 1);
    refetch();
  };

  const handleUnenrolled = () => {
    setRefreshKey((k) => k + 1);
    refetch();
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <EnrollStudentDialog
          key={selectedEnrollStudent?.studentId ?? "none"}
          student={selectedEnrollStudent}
          open={!!selectedEnrollStudent}
          onOpenChange={(isOpen) => !isOpen && setSelectedEnrollStudent(null)}
          onEnrolled={() => selectedEnrollStudent && handleEnrolled(selectedEnrollStudent.studentId)}
        />
{/* 
        <UnrollStudentDialog
          key={selectedUnrollStudent?.studentId ?? "none"}
          student={selectedUnrollStudent}
          open={!!selectedUnrollStudent}
          onOpenChange={(isOpen) => !isOpen && setSelectedUnrollStudent(null)}
          onUnenrolled={() => selectedUnrollStudent && handleUnenrolled(selectedUnrollStudent.studentId)}
        /> */}

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
            value={totalCount}
            label="Total Students"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            value={enrolledCount}
            label="Enrolled"
          />
          <StatCard
            icon={<UserPlus className="h-5 w-5 text-slate-500" />}
            iconBg="bg-slate-100"
            value={unEnrolledCount}
            label="Not Enrolled"
          />
        </div>

        {/* Table card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="pl-4 pb-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Students
                </h2>
                <p className="text-sm text-slate-500">
                  {filtered.length} of {totalCount} students
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, ID..."
                    className="w-full pl-9 sm:w-72"
                  />
                </div>
              </div>
            </div>

            {isPending && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading students…</span>
              </div>
            )}

            {!isPending && error && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <p className="text-sm text-slate-600">
                  Couldn't load students. {error.message || "Please try again."}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {!isPending && !error && (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Join Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedStudents.map((student) => {
                      const isEnrolled = hasEnrollments(student.studentId);
                      return (
                        <tr
                          key={student.id || student.studentId}
                          className="hover:bg-slate-50/60"
                        >
                          <td className="px-4 py-4 align-middle font-mono text-slate-500">
                            {student.studentId}
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
                                  student.id
                                )}`}
                              >
                                {getInitials(student.firstNm, student.lastNm)}
                              </div>
                              <span className="font-medium text-slate-900">
                                {student.firstNm} {student.lastNm}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-middle text-slate-600">
                            {student.emailId}
                          </td>
                          <td className="px-4 py-4 align-middle font-mono text-slate-600">
                            {formatMobile(student.mobileNum)}
                          </td>
                          <td className="px-4 py-4 align-middle text-slate-600">
                            {formatJoinDate(student.createdDt)}
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <EnrolledBadge isEnrolled={isEnrolled} />
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-2">
                              <ActionIconButton
                                title="Enroll student in courses / programs"
                                onClick={() => setSelectedEnrollStudent(student)}
                                className="border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <GraduationCap className="h-4 w-4" />
                              </ActionIconButton>
                              {/* {isEnrolled && (
                                <ActionIconButton
                                  title="Unroll student"
                                  onClick={() => setSelectedUnrollStudent(student)}
                                  className="border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </ActionIconButton>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-10 text-center text-slate-400"
                        >
                          No students match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>

          {/* Table Pagination Footer */}
          {!isPending && !error && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 mt-4">
              <span className="text-xs text-slate-500 font-normal">
                Showing{" "}
                <strong className="font-semibold text-slate-800">
                  {paginatedStudents.length}
                </strong>{" "}
                students
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function EnrolledBadge({ isEnrolled }) {
  if (isEnrolled) {
    return (
      <Badge
        variant="outline"
        className="rounded-full px-3 py-1 font-medium border bg-emerald-50 text-emerald-600 border-emerald-200"
      >
        <CheckCircle2 className="mr-1 h-3 w-3" /> Enrolled
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-full px-3 py-1 font-medium border bg-slate-100 text-slate-500 border-slate-200"
    >
      Not Enrolled
    </Badge>
  );
}

function StatCard({ icon, iconBg, value, label }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5 w-[286px] h-[77px]">
        <div className={`flex h-5 w-5 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionIconButton({ children, title, className, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
