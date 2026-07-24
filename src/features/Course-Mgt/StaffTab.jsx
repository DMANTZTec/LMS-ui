  import React, { useMemo, useState } from "react";
  import { useQuery } from "@tanstack/react-query";
  import { Card, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
  import { Users, UserCheck, UserX, Search, Pencil, KeyRound, ShieldCheck, Loader2, AlertTriangle, ChevronLeft, ChevronRight,} from "lucide-react";
  import { staffApi } from "@/api/staff-controller.api";
  import AddNewStaffMember from '@/features/Course-Mgt/addStaff/AddNewStaffMember';
  import EditStaffMember from './addStaff/EditStaffMember';
import ResetStaffPwdModal from "./addStaff/ResetStaffPwdModal";

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

  const STATUS_STYLES = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
    SUSPENDED: "bg-amber-50 text-amber-600 border-amber-200",
  };

  function StatusBadge({ status }) {
    const label = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
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

  function formatRoleLabel(roleName) {
    if (!roleName) return "";
    return roleName.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  async function fetchAllStaff() {
    const result = await staffApi.getAllStaff();
    return Array.isArray(result) ? result : result?.data || [];
  }

  export default function StaffTab() {
    const [query, setQuery] = useState("");
    const [isAddNewStaffMemberModal, setIsAddNewStaffMemberModal] = useState(false);
    const [selectedEditStaff, setSelectedEditStaff] = useState(null);
    const [isResetStaffPwdModal, setIsResetStaffPwdModal] = useState(false);
    const [selectedStaffResetData, setSelectedStaffResetData] = useState(null); 

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const {
      data: staff = [],
      isPending,
      error,
      refetch,
    } = useQuery({
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

    // Handle Search Input Change (resets pagination page to 1)
    const handleSearchChange = (e) => {
      setQuery(e.target.value);
      setCurrentPage(1);
    };

const resetPwdModal = (data) => {
console.log("entered into resetData function and data is: ",data);

setSelectedStaffResetData(data);
console.log("selectedStaffResetData value is: ",selectedStaffResetData);

setIsResetStaffPwdModal(true);
console.log("isResetStaffPwdModal value is: ",isResetStaffPwdModal);

}

    // Compute total pages and slice records for current page
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginatedStaff = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const totalCount = staff.length;
    const activeCount = staff.filter((s) => s.status === "ACTIVE").length;
    const inactiveCount = totalCount - activeCount;

    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          
          <AddNewStaffMember 
            open={isAddNewStaffMemberModal}
            onOpenChange={setIsAddNewStaffMemberModal} 
          />

          <EditStaffMember 
            open={!!selectedEditStaff} 
            onOpenChange={(isOpen) => !isOpen && setSelectedEditStaff(null)}
            staffData={selectedEditStaff}
            onSuccess={refetch}
          />

{selectedStaffResetData &&
          <ResetStaffPwdModal
            open={isResetStaffPwdModal}
            onOpenChange={setIsResetStaffPwdModal}
            staffData={selectedStaffResetData}
            onSuccess={refetch}
          /> }
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
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="pl-4 pb-0">
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
                      onChange={handleSearchChange}
                      placeholder="Search by name, email, ID, role..."
                      className="w-full pl-9 sm:w-72"
                    />
                  </div>
                  
                  <Button
                    onClick={() => setIsAddNewStaffMemberModal(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                  >
                    Add New Staff Member
                  </Button>
                </div>
              </div>

              {isPending && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Loading staff members…</span>
                </div>
              )}

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

              {!isPending && !error && (
                <div className="overflow-x-auto rounded-lg  border border-slate-100">
                  <table className="w-full text-left text-sm">
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
                      {paginatedStaff.map((member) => (
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
                            {formatJoinDate(member.dateOfJoining)}
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <StatusBadge status={member.status} />
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-2">
                              <ActionIconButton
                                title="Edit staff member"
                                onClick={() => setSelectedEditStaff(member)}
                                className="border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </ActionIconButton>
                              
                              <ActionIconButton
                                title="Reset password"
                                onClick={() => resetPwdModal(member)}
                                className="border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100"
                              >
                                <KeyRound className="h-4 w-4" />
                              </ActionIconButton>
                              
                              {/* Integrated Popover Dropdown for Manage Permissions Shield Icon */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    title="View Roles"
                                    className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100 data-[state=open]:bg-violet-100"
                                  >
                                    <ShieldCheck className="h-4 w-4" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent 
                                  align="end" 
                                  className="w-56 p-0 bg-white border border-slate-150 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95"
                                >
                                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                                      Assigned Roles
                                    </span>
                                  </div>
                                  
                                  <div className="p-2 flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                                    {member.roles && member.roles.length > 0 ? (
                                      member.roles.map((role, idx) => (
                                        <div 
                                          key={idx} 
                                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-slate-800 font-medium hover:bg-slate-50 transition-colors"
                                        >
                                          <span className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                                          <span className="truncate">{formatRoleLabel(role)}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-slate-400 px-2.5 py-4 text-center italic">
                                        No roles assigned
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-slate-400"
                          >
                            No staff members match your search.
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
                  Showing <strong className="font-semibold text-slate-800">{paginatedStaff.length}</strong> staff members
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

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
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
                  ))}

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