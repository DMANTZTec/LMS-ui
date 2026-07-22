import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Upload, Loader, RefreshCw, ChevronDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { staffApi } from "@/api/staff-controller.api";
import { roleApi } from "@/api/role-controller";

// --- Zod Validation Schema ---
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const staffEditSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First Name must only contain letters, spaces, hyphens, or apostrophes"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last Name must only contain letters, spaces, hyphens, or apostrophes"),

  email: z.string().optional(),
  mobileNumber: z.string().optional(),

  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected <= today;
      },
      { message: "Date of Birth cannot be in the future" }
    ),

  gender: z.string().optional(),

  dateOfJoining: z
    .string()
    .trim()
    .min(1, "Date of Joining is required"),

  assignedRoleIds: z
    .array(z.number())
    .min(1, "At least one role must be selected"),

  photo: z
    .union([
      z.instanceof(File).refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        { message: "Only JPEG and PNG formats are supported." }
      ),
      z.string().nullable(),
      z.null(),
    ])
    .optional(),
});

// --- Form Field Wrapper with Red Inline Error Message Support ---
const FormField = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[13px] font-semibold text-slate-900">
      {label} {required && <span className="text-red-500 font-normal">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs font-medium text-red-500 mt-0.5">
        {error}
      </span>
    )}
  </div>
);

// --- Photo Upload Component ---
const PhotoUpload = ({
  fileInputRef,
  photoPreview,
  onPhotoChange,
}) => (
  <div className="flex flex-col items-center justify-start h-full pt-1">
    <label className="text-[13px] font-semibold text-slate-900 self-start mb-2">
      Photo
    </label>
    <input
      ref={fileInputRef}
      type="file"
      className="hidden"
      accept="image/png,image/jpeg"
      onChange={onPhotoChange}
    />
    <div
      onClick={() => !photoPreview && fileInputRef.current?.click()}
      className="w-full max-w-[140px] aspect-[4/5] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col justify-center items-center text-center cursor-pointer bg-white hover:bg-slate-50 transition-colors relative group overflow-hidden"
    >
      {photoPreview ? (
        <>
          <img
            src={photoPreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-1.5 p-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-full py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-medium rounded-md flex items-center justify-center gap-1 shadow-xs"
            >
              <RefreshCw size={12} /> Change
            </button>
          </div>
        </>
      ) : (
        <div className="p-3 flex flex-col items-center">
          <Upload size={22} className="text-slate-400 mb-2 stroke-[1.5]" />
          <p className="text-[12px] text-slate-500 leading-normal font-medium px-1">
            Click to upload passport photo
          </p>
        </div>
      )}
    </div>
    <p className="text-[11px] text-center text-slate-400 mt-3 leading-tight font-medium">
      JPG or PNG
      <br />
      Passport size
    </p>
  </div>
);

async function fetchAllRoles() {
  const result = await roleApi.getAllRoles();
  return Array.isArray(result) ? result : result?.data || [];
}

const EditStaffMember = ({ open, onOpenChange, staffData, onSuccess }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [isOpenRolesDropdown, setIsOpenRolesDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { data: rolesList = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dateOfBirth: "",
      gender: "",
      dateOfJoining: "",
      assignedRoleIds: [],
      photo: null,
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpenRolesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Pre-fill form when staffData loads
  useEffect(() => {
    if (staffData) {
      let initialIds = [];

      if (Array.isArray(staffData.roles)) {
        initialIds = staffData.roles
          .map((r) => {
            if (typeof r === "object" && r?.id !== undefined) return Number(r.id);
            const found = rolesList.find(
              (sysRole) =>
                sysRole.roleNm === r ||
                sysRole.id === r ||
                String(sysRole.id) === String(r)
            );
            return found ? Number(found.id) : null;
          })
          .filter((id) => id !== null && !isNaN(id));
      } else if (Array.isArray(staffData.roleIds)) {
        initialIds = staffData.roleIds
          .map((id) => Number(id))
          .filter((id) => !isNaN(id));
      }

      reset({
        firstName: staffData.firstNm || "",
        lastName: staffData.lastNm || "",
        email: staffData.email || "",
        mobileNumber: staffData.mobileNum || "",
        dateOfBirth: staffData.dob || "",
        gender: staffData.gender || "",
        dateOfJoining:
          staffData.dateOfJoining ||
          (staffData.dateOfJoining ? staffData.dateOfJoining.split("T")[0] : ""),
        assignedRoleIds: initialIds,
        photo: staffData.profileImg || staffData.photoUrl || null,
      });

      const initialPhoto = staffData.profileImg || staffData.photoUrl || null;
      setPhotoPreview(initialPhoto);
    }
  }, [staffData, rolesList, reset]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setValue("photo", file, { shouldDirty: true, shouldValidate: true });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setValue("photo", null, { shouldDirty: true, shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatRoleLabel = (roleName) => {
    if (!roleName) return "";
    return roleName
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const formattedRoleIds = (data.assignedRoleIds || [])
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));

      const updatePayload = {
        firstNm: data.firstName || "",
        lastNm: data.lastName || "",
        dob: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        dateOfJoining: data.dateOfJoining || undefined,
        roleIds: formattedRoleIds,
      };

      const requests = [
        staffApi.updateStaff(staffData.staffId, updatePayload),
      ];

      if (data.photo instanceof File) {
        requests.push(
          staffApi.updateProfileImage(staffData.staffId, data.photo)
        );
      }

      await Promise.all(requests);

      toast.success("Staff details updated successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Update failed: ", error);
      setGlobalError(
        error.response?.data?.message || "Failed to update staff credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setGlobalError(null);
    setIsOpenRolesDropdown(false);
    reset();
    onOpenChange(false);
  };

  const inputClassName = (hasError) =>
    `h-11 bg-slate-50 border ${
      hasError ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-blue-500"
    } text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 rounded-xl px-3.5 outline-none w-full transition-all`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-[740px] p-0 rounded-2xl bg-white border-none shadow-xl flex flex-col max-h-[92vh]">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Edit Staff Member
          </DialogTitle>
          <p className="text-[13px] text-slate-500 mt-1">
            Fill in the details to update this staff account.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-6 space-y-4 overflow-y-auto flex-1"
        >
          {globalError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {globalError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_150px] gap-6 items-start">
            <div className="space-y-4">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="First Name" required error={errors.firstName?.message}>
                  <Input
                    placeholder="e.g. Anika"
                    className={inputClassName(!!errors.firstName)}
                    {...register("firstName")}
                  />
                </FormField>

                <FormField label="Last Name" required error={errors.lastName?.message}>
                  <Input
                    placeholder="e.g. Sharma"
                    className={inputClassName(!!errors.lastName)}
                    {...register("lastName")}
                  />
                </FormField>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Email Address">
                  <Input
                    type="email"
                    placeholder="name@mcpadmin.io"
                    className={inputClassName(false)}
                    {...register("email")}
                    disabled
                  />
                </FormField>

                <FormField label="Mobile Number">
                  <Input
                    placeholder="+1 (555) 000-0000"
                    className={inputClassName(false)}
                    {...register("mobileNumber")}
                    disabled
                  />
                </FormField>
              </div>

              {/* Row 3: DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
                  <Input
                    type="date"
                    className={`${inputClassName(!!errors.dateOfBirth)} text-slate-600`}
                    {...register("dateOfBirth")}
                  />
                </FormField>

                <FormField label="Gender" error={errors.gender?.message}>
                  <select
                    className={`${inputClassName(
                      !!errors.gender
                    )} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat cursor-pointer`}
                    {...register("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    <option value="OTHER">Other</option>
                  </select>
                </FormField>
              </div>

              {/* Row 4: Date of Joining */}
              <FormField label="Date of Joining" required error={errors.dateOfJoining?.message}>
                <Input
                  type="date"
                  className={`${inputClassName(!!errors.dateOfJoining)} text-slate-600`}
                  {...register("dateOfJoining")}
                />
              </FormField>

              {/* Row 5: Multi-Select Role Checkboxes */}
              <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                <label className="text-[13px] font-semibold text-slate-900">
                  Assign Roles <span className="text-red-500 font-normal">*</span>
                </label>

                {isLoadingRoles ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                    <Loader size={14} className="animate-spin" /> Fetching roles...
                  </div>
                ) : (
                  <Controller
                    name="assignedRoleIds"
                    control={control}
                    render={({ field }) => {
                      const selectedIds = Array.isArray(field.value)
                        ? field.value.map((id) => Number(id))
                        : [];

                      const selectedLabels = selectedIds
                        .map((id) => rolesList.find((r) => Number(r.id) === id)?.roleNm)
                        .filter(Boolean)
                        .map(formatRoleLabel);

                      const triggerText =
                        selectedLabels.length > 0
                          ? selectedLabels.join(", ")
                          : "Select roles...";

                      return (
                        <div className="relative w-full">
                          {/* Dropdown Box Header */}
                          <div
                            onClick={() => setIsOpenRolesDropdown((prev) => !prev)}
                            className={`flex h-11 w-full items-center justify-between rounded-xl border bg-slate-50 px-3.5 py-2 text-sm cursor-pointer transition-all ${
                              errors.assignedRoleIds
                                ? "border-red-500 ring-1 ring-red-500"
                                : isOpenRolesDropdown
                                ? "ring-1 ring-blue-500 border-blue-500"
                                : "border-slate-200"
                            }`}
                          >
                            <span
                              className={`truncate ${
                                selectedLabels.length > 0
                                  ? "text-slate-800 font-medium"
                                  : "text-slate-400"
                              }`}
                            >
                              {triggerText}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform duration-200 ${
                                isOpenRolesDropdown
                                  ? "rotate-180 text-blue-500"
                                  : ""
                              }`}
                            />
                          </div>

                          {/* Options List Menu */}
                          {isOpenRolesDropdown && (
                            <div className="absolute left-0 right-0 z-[100] mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                              <div className="flex flex-col gap-0.5">
                                {rolesList.map((role) => {
                                  const roleIdNum = Number(role.id);
                                  const isChecked = selectedIds.includes(roleIdNum);

                                  const toggleRole = () => {
                                    const nextSelected = isChecked
                                      ? selectedIds.filter((id) => id !== roleIdNum)
                                      : [...selectedIds, roleIdNum];

                                    field.onChange(nextSelected);
                                  };

                                  return (
                                    <div
                                      key={role.id}
                                      onClick={toggleRole}
                                      className="flex items-center space-x-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={toggleRole}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span className="text-sm font-medium text-slate-700 select-none grow">
                                        {formatRoleLabel(role.roleNm)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                )}

                {/* Role Validation Error Display */}
                {errors.assignedRoleIds && (
                  <span className="text-xs font-medium text-red-500 mt-0.5">
                    {errors.assignedRoleIds.message}
                  </span>
                )}
              </div>
            </div>

            <PhotoUpload
              fileInputRef={fileInputRef}
              photoPreview={photoPreview}
              onPhotoChange={handlePhotoChange}
              onRemovePhoto={removePhoto}
            />
          </div>
        </form>

        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="px-5 h-11 border-slate-200 text-slate-600 rounded-xl font-semibold bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-11 rounded-xl font-semibold shadow-xs transition-colors min-w-[160px]"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffMember;