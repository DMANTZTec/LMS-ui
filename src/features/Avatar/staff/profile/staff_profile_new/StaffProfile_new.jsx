import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Camera,
  ChevronLeft,
  Info,
  KeyRound,
  Loader2,
  Lock,
  Pencil,
  Phone,
} from "lucide-react";

import { staffApi } from "@/api/staff-controller.api";
import { getOtpStaff } from "@/utils/tokenUtility";

import StaffContactAddressForm from "./StaffContactAddressForm_new";
import StaffEmergencyContactForm from "./StaffEmergencyContactForm_new";
import ResetStaffPwdModal from "./ResetStaffPwdModal_new";
import { ACCEPTED_IMAGE_TYPES, StaffProfileImageSchema } from "./StaffProfileScheema_new";

// Sample data shown when nobody is logged in (preview / demo mode)
const DEMO_STAFF = {
  staffId: "SF00001",
  firstNm: "Shashikanth",
  lastNm: "Reddy",
  email: "shashikanth.reddy@learnspace.in",
  mobileNum: "+91 98765 43210",
  gender: "MALE",
  dob: "1992-03-14",
  designation: "Senior Lecturer",
  dateOfJoining: "2026-07-10",
  roles: ["INSTRUCTOR", "COURSE_AUTHOR"],
  addr1: "H.No 6-2-136, Padma Nagar Road",
  addr2: "",
  city: "Nalgonda",
  state: "Telangana",
  country: "India",
  pin: "508001",
  emergencyContactNm: "",
  emergencyContactNum: "+91 91234 56780",
  status: "ACTIVE",
  updatedDt: "2026-10-24",
  profileImg: null,
};

// Fields counted for the "Profile completion" meter, with the label shown when missing
const COMPLETION_FIELDS = [
  ["profileImg", "a profile photo"],
  ["mobileNum", "mobile number"],
  ["dob", "date of birth"],
  ["gender", "gender"],
  ["addr1", "address"],
  ["city", "city"],
  ["state", "state"],
  ["country", "country"],
  ["pin", "PIN code"],
  ["emergencyContactNm", "emergency contact name"],
  ["emergencyContactNum", "emergency contact number"],
];

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// "COURSE_AUTHOR" -> "Course Author"
const toTitle = (value) =>
  value
    ? String(value)
        .toLowerCase()
        .split(/[_\s]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;

// Backend responses use both `profileImage` and `profileImg` for the image URL
const getImageUrl = (staff) => {
  const url = staff?.profileImage ?? staff?.profileImg;
  return typeof url === "string" && url.trim() !== "" ? url : null;
};

const hasValue = (value) => (Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim() !== "" : !!value);

const notWiredUp = () => toast("This action is not part of the photo upload preview.", { icon: "ℹ️" });

function SectionCard({ icon, iconClass, title, subtitle, action, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DetailItem({ label, value, hint, className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm text-slate-600">{label}</p>
      {hasValue(value) ? (
        <p className="break-words text-sm font-semibold text-slate-900">{value}</p>
      ) : (
        <p className="text-sm italic text-slate-500">Not added</p>
      )}
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Chip({ children, className }) {
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

/**
 * Staff "My profile" page with profile photo upload (camera badge on the avatar).
 * demoMode: show sample data and simulate the photo upload instead of calling the backend.
 */
export default function StaffProfileNew({ demoMode = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Go to the previous page; fall back to the dashboard if the page was opened directly (no in-app history)
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/Staff-dashboard");
    }
  };
  const [demoStaff, setDemoStaff] = useState(DEMO_STAFF);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [isResetPwdOpen, setIsResetPwdOpen] = useState(false);

  const staffId = demoMode ? DEMO_STAFF.staffId : getOtpStaff()?.staffId ?? null;

  const { data: apiStaff, isLoading, isError } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => staffApi.getStaffById(staffId).then((res) => res.data),
    enabled: !demoMode && !!staffId,
  });

  const staff = demoMode ? demoStaff : apiStaff;
  const imageUrl = getImageUrl(staff);

  // Release the demo photo's object URL when it is replaced or the page unmounts
  useEffect(() => {
    return () => {
      if (demoMode && imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [demoMode, imageUrl]);

  const handleUploaded = (file) => {
    if (demoMode) setDemoStaff((prev) => ({ ...prev, profileImg: URL.createObjectURL(file) }));
    else queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
  };

  // Camera button opens the file picker; the picked photo is previewed on the avatar until Save or Cancel
  const photoInputRef = useRef(null);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  // Image URL that failed to load (missing / deleted file); the avatar then falls back to the initials
  const [brokenImageUrl, setBrokenImageUrl] = useState(null);

  // Release the preview's object URL when it is replaced, cleared or the page unmounts
  useEffect(() => {
    return () => {
      if (pendingPhoto) URL.revokeObjectURL(pendingPhoto.url);
    };
  }, [pendingPhoto]);

  const photoSaveMutation = useMutation({
    mutationFn: (file) =>
      demoMode ? new Promise((resolve) => setTimeout(resolve, 1200)) : staffApi.updateProfileImage1(staffId, file),
    onSuccess: (response, file) => {
      toast.success("Profile photo updated.");
      // Show the image URL the backend just saved in the database; handleUploaded then refetches the full record
      const savedImg = response?.data?.profileImg;
      if (!demoMode && savedImg) {
        queryClient.setQueryData(["staff", staffId], (prev) =>
          prev ? { ...prev, profileImg: savedImg, profileImage: savedImg } : prev
        );
      }
      handleUploaded(file);
      setPendingPhoto(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to upload profile photo.");
    },
  });
  const isSavingPhoto = photoSaveMutation.isPending;

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    // Clear the input so picking the same file again still fires onChange
    e.target.value = "";
    if (!file) return;

    const result = await StaffProfileImageSchema.safeParseAsync({ profileImg: file });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || "Please choose a valid photo.");
      return;
    }
    setPendingPhoto({ file, url: URL.createObjectURL(file) });
  };

  const handleContactSaved = (values) => {
    if (demoMode) setDemoStaff((prev) => ({ ...prev, ...values }));
    else queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
    setIsEditingContact(false);
  };

  const handleEmergencySaved = (values) => {
    if (demoMode) setDemoStaff((prev) => ({ ...prev, ...values }));
    else queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
    setIsEditingEmergency(false);
  };

  if (!demoMode && !staffId) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-slate-100 text-base text-slate-600">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        No logged-in staff found. Please log in as staff to view your profile.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-slate-100 text-base text-red-600">
        <AlertCircle className="h-4 w-4" />
        Could not load your profile. Please try again later.
      </div>
    );
  }

  const fullName = [staff.firstNm, staff.lastNm].filter(Boolean).join(" ");
  // First letter of First name + first letter of Last name, in capitals (e.g. "RK")
  const initials = [staff.firstNm, staff.lastNm].map((n) => String(n ?? "").trim().charAt(0)).join("").toUpperCase() || "?";
  const avatarImageUrl = pendingPhoto?.url ?? imageUrl;
  const showAvatarImage = !!avatarImageUrl && avatarImageUrl !== brokenImageUrl;
  const roles = Array.from(staff.roles ?? []);
  const isActive = String(staff.status ?? "").toUpperCase() === "ACTIVE";

  const missing = COMPLETION_FIELDS.filter(([key]) => !hasValue(key === "profileImg" ? imageUrl : staff[key]));
  const completion = Math.round(((COMPLETION_FIELDS.length - missing.length) / COMPLETION_FIELDS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-base font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My profile</h1>
            <p className="text-sm text-slate-600">Your details at LearnSpace. Official details are set by your Admin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Chip className="border border-slate-200 bg-white text-slate-600">
              <Lock className="h-3 w-3" /> Managed by Admin
            </Chip>
            <Chip className="bg-blue-50 text-blue-700">
              <Pencil className="h-3 w-3" /> You can edit
            </Chip>
          </div>
        </div>

        {/* Profile summary */}
        <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-5">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="relative shrink-0">
                <div
                  className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-700 ${
                    pendingPhoto ? "ring-2 ring-blue-400 ring-offset-2" : ""
                  }`}
                >
                  {showAvatarImage ? (
                    <img
                      src={avatarImageUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                      onError={() => setBrokenImageUrl(avatarImageUrl)}
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">{initials}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isSavingPhoto}
                  className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
                  aria-label={imageUrl ? "Change profile photo" : "Add profile photo"}
                  title={imageUrl ? "Change profile photo" : "Add profile photo"}
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={handlePhotoSelected}
                />
              </div>

              {/* Picked photo is only a preview until Save is clicked */}
              {pendingPhoto && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => photoSaveMutation.mutate(pendingPhoto.file)}
                    disabled={isSavingPhoto}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isSavingPhoto && <Loader2 className="h-3 w-3 animate-spin" />}
                    {isSavingPhoto ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingPhoto(null)}
                    disabled={isSavingPhoto}
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-slate-900">{fullName}</p>
              {staff.designation && <p className="text-sm text-slate-600">{staff.designation}</p>}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip className="bg-slate-100 text-slate-700">{staff.staffId}</Chip>
                {roles[0] && <Chip className="bg-violet-50 text-violet-700">{toTitle(roles[0])}</Chip>}
                {staff.status && (
                  <Chip className={isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {toTitle(staff.status)}
                  </Chip>
                )}
              </div>
              <p className="mt-1.5 text-sm text-slate-600">
                {[
                  staff.dateOfJoining && `Joined ${formatDate(staff.dateOfJoining)}`,
                  staff.updatedDt && `Profile last updated ${formatDate(staff.updatedDt)}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 md:w-72">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Profile completion</p>
              <p className="text-base font-bold text-blue-700">{completion}%</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {missing.length ? `Add: ${missing.map(([, label]) => label).join(" · ")}` : "Your profile is complete."}
            </p>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          {/* Left column */}
          <div className="space-y-4">
            <SectionCard
              icon={<Lock className="h-4 w-4" />}
              iconClass="bg-slate-100 text-slate-600"
              title="Official details"
              subtitle="Set by your Admin. You can view these but not change them."
              action={
                <button
                  type="button"
                  onClick={notWiredUp}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Request a correction
                </button>
              }
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                <DetailItem label="First name" value={staff.firstNm} />
                <DetailItem label="Last name" value={staff.lastNm} />
                <DetailItem label="Email address" value={staff.email} hint="Used to sign in" />
                <DetailItem label="Date of birth" value={formatDate(staff.dob)} hint="Visible only to you and Admin" />
                <DetailItem label="Gender" value={toTitle(staff.gender)} />
                <DetailItem label="Date of joining" value={formatDate(staff.dateOfJoining)} />
                <DetailItem label="Designation" value={staff.designation} />
                <DetailItem label="Staff ID" value={staff.staffId} />
              </div>
              <div className="mt-4">
                <p className="mb-1 text-sm text-slate-600">Assigned roles</p>
                {roles.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {roles.map((role) => (
                      <Chip key={role} className="bg-violet-50 text-violet-700">
                        {toTitle(role)}
                      </Chip>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-500">Not added</p>
                )}
              </div>
            </SectionCard>

            <SectionCard
              icon={<Pencil className="h-4 w-4" />}
              iconClass="bg-blue-50 text-blue-600"
              title="Contact & address"
              subtitle="Keep these up to date so the institute can reach you."
              action={
                !isEditingContact && (
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(true)}
                    className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )
              }
            >
              {isEditingContact ? (
                <StaffContactAddressForm
                  staff={staff}
                  staffId={staffId}
                  demoMode={demoMode}
                  onSaved={handleContactSaved}
                  onCancel={() => setIsEditingContact(false)}
                />
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                  <DetailItem label="Mobile number" value={staff.mobileNum} className="sm:col-span-3" />
                  <DetailItem label="Address line 1" value={staff.addr1} className="sm:col-span-3" />
                  <DetailItem label="Address line 2 (optional)" value={staff.addr2} className="sm:col-span-3" />
                  <DetailItem label="City" value={staff.city} />
                  <DetailItem label="State" value={staff.state} />
                  <DetailItem label="Country" value={staff.country} />
                  <DetailItem label="PIN code" value={staff.pin} />
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <SectionCard
              icon={<Phone className="h-4 w-4" />}
              iconClass="bg-orange-50 text-orange-600"
              title="Emergency contact"
              action={
                !isEditingEmergency && (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmergency(true)}
                    className="rounded-md border border-blue-100 bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100"
                    aria-label="Edit emergency contact"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                )
              }
            >
              {isEditingEmergency ? (
                <StaffEmergencyContactForm
                  staff={staff}
                  staffId={staffId}
                  demoMode={demoMode}
                  onSaved={handleEmergencySaved}
                  onCancel={() => setIsEditingEmergency(false)}
                />
              ) : (
                <div className="space-y-3">
                  <DetailItem label="Contact name" value={staff.emergencyContactNm} />
                  <DetailItem label="Phone number" value={staff.emergencyContactNum} />
                </div>
              )}
            </SectionCard>

            <SectionCard icon={<KeyRound className="h-4 w-4" />} iconClass="bg-violet-50 text-violet-600" title="Sign-in & security">
              <div className="space-y-3">
                <DetailItem label="Sign-in email" value={staff.email} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Password</p>
                  <button
                    type="button"
                    onClick={() => setIsResetPwdOpen(true)}
                    className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Change password
                  </button>
                </div>
              </div>
            </SectionCard>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Info className="h-3.5 w-3.5" /> Who can see your details
              </p>
              <p className="mb-2">
                <span className="font-semibold text-slate-800">Students</span> see your name, photo and designation.
              </p>
              <p>
                <span className="font-semibold text-slate-800">Only you and Admin</span> see your date of birth, mobile,
                address and emergency contact.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Responsive reset-password modal; it reads staffData.email and staffData.staffId */}
      {isResetPwdOpen && (
        <ResetStaffPwdModal
          open={isResetPwdOpen}
          onOpenChange={setIsResetPwdOpen}
          staffData={{ staffId: staff.staffId, email: staff.email }}
        />
      )}
    </div>
  );
}
