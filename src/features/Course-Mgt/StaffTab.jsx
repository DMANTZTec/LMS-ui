import AddNewStaffMember from '@/features/Course-Mgt/addStaff/AddNewStaffMember';

// const StaffTab = () => {
//     const [isAddNewStaffMemberModal, setIsAddNewStaffMemberModal] = useState(false);
//   return (
//   <>
//   <div className="p-4 sm:p-6 lg:p-8">
//         <h3 className="text-lg font-medium text-slate-800 mb-4">This is Staff tab.</h3>
//         {/* External Trigger Button */}
//         <Button
//           onClick={() => setIsAddNewStaffMemberModal(true)}
//           className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
//         >
//           Add New Staff Member
//         </Button>
//       </div>
//       <AddNewStaffMember 
//        open={isAddNewStaffMemberModal}
//        onOpenChange={setIsAddNewStaffMemberModal} />
//   </>
//   );
// }; 
// export default StaffTab;

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Users, UserCheck, UserX, Search, Plus, Pencil, KeyRound, ShieldCheck, Loader2, AlertTriangle,} from "lucide-react";
import { staffApi } from "@/api/staff-controller.api";


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
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return `+${digits}`;
}

function formatDesignation(designation) {
  if (!designation || designation.trim().toLowerCase() === "string") {
    return "—";
  }
  return designation;
}

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
  SUSPENDED: "bg-amber-50 text-amber-600 border-amber-200",
};

function StatusBadge({ status }) {
  const label =
    status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 font-medium border ${
        STATUS_STYLES[status] ?? STATUS_STYLES.INACTIVE
      }`}
    >
      {label}
    </Badge>
  );
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

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function fetchAllStaff() {
  const result = await staffApi.getAllStaff();
  return Array.isArray(result) ? result : result?.data || [];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StaffTab() {
  const [query, setQuery] = useState("");
  const [isAddNewStaffMemberModal, setIsAddNewStaffMemberModal] = useState(false);


  const {
    data: staff = [],isPending,error,refetch,} = useQuery({
    queryKey: ["getStaff"],
    queryFn: fetchAllStaff,
    staleTime: 2 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => {
      const fullName = `${s.firstNm} ${s.lastNm}`.toLowerCase();
      return (
        fullName.includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.staffId?.toLowerCase().includes(q) ||
        (s.designation ?? "").toLowerCase().includes(q) ||
        (s.roles ?? []).some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [staff, query]);

  const totalCount = staff.length;
  const activeCount = staff.filter((s) => s.status === "ACTIVE").length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
            value={totalCount}
            label="Total Staff"
          />
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            value={activeCount}
            label="Active"
          />
          <StatCard
            icon={<UserX className="h-5 w-5 text-slate-500" />}
            iconBg="bg-slate-100"
            value={inactiveCount}
            label="Inactive / Suspended"
          />
        </div>

        {/* Table card */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Staff Members
                </h2>
                <p className="text-sm text-slate-500">
                  {filtered.length} of {totalCount} members
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email, ID, role..."
                    className="w-full pl-9 sm:w-72"
                  />
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add New Staff Member
                </Button>  */}
              <Button
           onClick={() => setIsAddNewStaffMemberModal(true)}
           className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
         >
           Add New Staff Member
         </Button>
         <AddNewStaffMember 
      open={isAddNewStaffMemberModal}
        onOpenChange={setIsAddNewStaffMemberModal} />

                
              </div>
            </div>

            {/* Loading state */}
            {isPending && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading staff members…</span>
              </div>
            )}

            {/* Error state */}
            {!isPending && error && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <p className="text-sm text-slate-600">
                  Couldn't load staff members. {error.message || "Please try again."}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Table */}
            {!isPending && !error && (
              <>
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3">Staff ID</th>
                        <th className="px-4 py-3">Staff Name</th>
                        <th className="px-4 py-3">Email Address</th>
                        <th className="px-4 py-3">Mobile</th>
                        <th className="px-4 py-3">Join Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-4 align-middle font-mono text-slate-500">
                            {member.staffId}
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
                                  member.id
                                )}`}
                              >
                                {getInitials(member.firstNm, member.lastNm)}
                              </div>
                              <span className="font-medium text-slate-900">
                                {member.firstNm} {member.lastNm}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-middle text-slate-600">
                            {member.email}
                          </td>
                          <td className="px-4 py-4 align-middle font-mono text-slate-600">
                            {formatMobile(member.mobileNum)}
                          </td>
                         
                          <td className="px-4 py-4 align-middle text-slate-600">
                            {formatJoinDate(member.createdDt)}
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <StatusBadge status={member.status} />
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-2">
                              <ActionIconButton
                                title="Edit staff member"
                                className="border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </ActionIconButton>
                              <ActionIconButton
                                title="Reset password"
                                className="border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100"
                              >
                                <KeyRound className="h-4 w-4" />
                              </ActionIconButton>
                              <ActionIconButton
                                title="Manage permissions"
                                className="border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100"
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </ActionIconButton>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-4 py-10 text-center text-slate-400"
                          >
                            No staff members match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>
                    Showing <strong className="text-slate-700">{filtered.length}</strong>{" "}
                    staff members
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, value, label }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
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

function ActionIconButton({ children, title, className }) {
  return (
    <button
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${className}`}
    >
      {children}
    </button>
  );
}