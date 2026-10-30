import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';
import { Upload, CheckCircle, Loader, RefreshCw, Trash2, Check, ChevronsUpDown, X, Pencil } from "lucide-react";

import {                                                                
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { staffFormSchema } from "./AddNewStaffMemberSchema";
import { staffApi } from '@/api/staff-controller.api';
import { roleApi } from '@/api/role-controller'; 
// --- Sub-components for better maintainability ---

const FormField = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs font-medium text-red-500">{error.message}</p>}
    </div>
);

const PhotoUpload = ({ fileInputRef, photoPreview, onPhotoChange, onRemovePhoto, error }) => (
    <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-slate-700 self-start mb-2">
            Photo <span className="text-red-500">*</span>
        </label>

        <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg"
            onChange={onPhotoChange}
        />

        {/* Outer frame matching standard passport size dimensions */}
        <div
            onClick={() => !photoPreview && fileInputRef.current?.click()}
            className="
                w-[110px]
                h-[150px]
                border
                border-dashed
                border-slate-200
                rounded-lg
                flex
                flex-col
                justify-center
                items-center
                text-center
                cursor-pointer
                bg-slate-50
                hover:bg-slate-100
                transition-colors
                relative
                group
                overflow-hidden
            "
        >
            {photoPreview ? (
                <>
                    <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    
                    {/* Hover Overlay containing explicit micro-actions that fit the 110px box perfectly */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="w-full py-1 px-1.5 bg-white/90 hover:bg-white text-slate-800 text-[10px] font-medium rounded shadow flex items-center justify-center gap-1 transition-colors"
                        >
                            <RefreshCw size={10} />
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemovePhoto();
                            }}
                            className="w-full py-1 px-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-medium rounded shadow flex items-center justify-center gap-1 transition-colors"
                        >
                            <Trash2 size={10} />
                            Remove
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-2 flex flex-col items-center">
                    <Upload size={18} className="text-slate-400 mb-2" />
                    <p className="text-[11px] text-slate-500 leading-4">
                        Click to upload
                        <br />
                        passport photo
                    </p>
                </div>
            )}
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
            JPG or PNG
            <br />
            Passport size
        </p>
        
        {error && <p className="text-xs font-medium text-red-500 mt-1">{error.message}</p>}
    </div>
);

const formatLabel = (value) =>
    value ? String(value).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

// Plain-text label/value pair (not an input) for the read-only view
const ViewField = ({ label, children, className = "" }) => (
    <div className={`py-3 border-b border-slate-100 ${className}`}>
        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
        <dd className="mt-1 text-base font-medium text-slate-900 break-words">{children || "—"}</dd>
    </div>
);

// Read-only view of the staff member fetched back after creation
const StaffDetailsView = ({ staff, photoUrl, submittedMsg, onClose }) => {
    const roles = staff.roles ? [...staff.roles] : [];
    const initials = `${staff.firstNm?.trim()?.[0] ?? ""}${staff.lastNm?.trim()?.[0] ?? ""}`.toUpperCase();
    // Fall back to initials when no photo was selected or it fails to load
    const [photoFailed, setPhotoFailed] = useState(false);
    const showPhoto = photoUrl && !photoFailed;

    return (
    <div className="px-6 py-5 space-y-5">
        {submittedMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                <CheckCircle className="text-green-600" size={20} />
                {submittedMsg}
            </div>
        )}

        {/* Profile summary */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm">
                {showPhoto ? (
                    <img
                        src={photoUrl}
                        alt={`${staff.firstNm ?? ""} ${staff.lastNm ?? ""}`.trim() || "Profile"}
                        className="h-full w-full object-cover"
                        onError={() => setPhotoFailed(true)}
                    />
                ) : (
                    initials || "—"
                )}
            </div>
            <div className="min-w-0">
                <p className="text-xl font-semibold text-slate-900 truncate">
                    {staff.firstNm} {staff.lastNm}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 truncate">{staff.email}</p>
            </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <ViewField label="Staff ID"><span className="font-mono text-blue-700">{staff.staffId}</span></ViewField>
            <ViewField label="Gender">{staff.gender && formatLabel(staff.gender)}</ViewField>
            <ViewField label="First Name">{staff.firstNm}</ViewField>
            <ViewField label="Last Name">{staff.lastNm}</ViewField>
            <ViewField label="Email">{staff.email}</ViewField>
            <ViewField label="Mobile Number">{staff.mobileNum}</ViewField>
            <ViewField label="Date of Birth">{staff.dob && formatDate(staff.dob)}</ViewField>
            <ViewField label="Date of Joining">{staff.dateOfJoining && formatDate(staff.dateOfJoining)}</ViewField>
            <ViewField label="Roles" className="sm:col-span-2 border-b-0">
                {roles.length > 0 && (
                    <span className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                            <span
                                key={role}
                                className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-sm font-medium text-violet-700"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                {formatLabel(role)}
                            </span>
                        ))}
                    </span>
                )}
            </ViewField>
        </dl>

        <div className="border-t pt-5 flex justify-end gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-[95px] h-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
                Close
            </Button>
        </div>
    </div>
    );
};

// Editable fields of the created staff member, with the same rules as create
const staffEditSchema = staffFormSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    mobileNumber: true,
    dateOfBirth: true,
    gender: true,
    dateOfJoining: true,
    roles: true,
}).extend({
    // Optional in edit mode (keep the current photo); a new one must pass the create rules
    photo: staffFormSchema.shape.photo.nullable().optional(),
});

// Profile photo thumbnail in edit mode with a "Change" button to pick a new one
const EditPhotoField = ({ form, currentPhotoUrl, initials }) => {
    const { setValue, watch, formState: { errors } } = form;
    const photoInputRef = useRef(null);
    const newPhoto = watch("photo");
    const [newPhotoUrl, setNewPhotoUrl] = useState(null);

    // Free the preview's object URL when it is replaced or the view unmounts
    useEffect(() => () => {
        if (newPhotoUrl) URL.revokeObjectURL(newPhotoUrl);
    }, [newPhotoUrl]);

    const thumbUrl = newPhotoUrl || currentPhotoUrl;

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("photo", file, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setNewPhotoUrl(URL.createObjectURL(file));
        }
        // Allow picking the same file again after an error
        e.target.value = "";
    };

    const handleUndo = () => {
        setValue("photo", null, { shouldValidate: true, shouldDirty: true });
        setNewPhotoUrl(null);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Profile Photo</label>
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-slate-100">
                    {thumbUrl ? (
                        <img src={thumbUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        initials || "—"
                    )}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => photoInputRef.current?.click()}
                            className="h-9 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium gap-1.5"
                        >
                            <RefreshCw size={14} />
                            Change
                        </Button>
                        {newPhoto && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleUndo}
                                className="h-9 px-3 text-slate-500 hover:text-slate-700 rounded-lg font-medium"
                            >
                                Undo
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                        {newPhoto instanceof File ? newPhoto.name : "JPEG or PNG"}
                    </p>
                </div>
                <input
                    ref={photoInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    onChange={handleChange}
                />
            </div>
            {errors.photo && <p className="text-xs font-medium text-red-500">{errors.photo.message}</p>}
        </div>
    );
};

// Multi-select roles picker for edit mode, same look and behaviour as "Assign Roles" in the create form
const RolesMultiSelect = ({ value, onChange, roleOptions }) => {
    const [openRoles, setOpenRoles] = useState(false);
    const selectedValues = value || [];

    const toggleOption = (val) => {
        const updated = selectedValues.includes(val)
            ? selectedValues.filter((item) => item !== val)
            : [...selectedValues, val];
        onChange(updated);
    };

    return (
        <Popover open={openRoles} onOpenChange={setOpenRoles}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openRoles}
                    className="w-full min-h-10 h-auto py-2 px-3 justify-between bg-slate-50 border-slate-200 hover:bg-slate-100 rounded-lg text-left font-normal"
                >
                    <div className="flex flex-wrap gap-1 items-center max-w-[85%]">
                        {selectedValues.length === 0 && (
                            <span className="text-slate-400 text-sm">Select roles...</span>
                        )}

                        {selectedValues.map((val) => {
                            const label = roleOptions.find((opt) => opt.id === val)?.roleNm;
                            return (
                                <Badge
                                    key={val}
                                    variant="secondary"
                                    className="bg-slate-200 text-slate-800 hover:bg-slate-300 gap-1 rounded-md text-xs py-0.5 px-2"
                                >
                                    {label}
                                    <X
                                        className="h-3 w-3 text-slate-500 hover:text-slate-900 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(val);
                                        }}
                                    />
                                </Badge>
                            );
                        })}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg bg-white border border-slate-200 shadow-md">
                <Command>
                    <CommandInput placeholder="Search roles..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                            {roleOptions.map((option) => {
                                const isSelected = selectedValues.includes(option.id);
                                return (
                                    <CommandItem
                                        key={option.id}
                                        onSelect={() => toggleOption(option.id)}
                                        className="cursor-pointer flex items-center justify-between py-2 px-3 hover:bg-slate-100 rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`flex h-4 w-4 items-center justify-center rounded border border-slate-300 transition-colors ${
                                                    isSelected
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "bg-white opacity-70"
                                                }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium">
                                                {option.roleNm}
                                            </span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// Edit mode of the created staff member: Staff ID stays plain text
const StaffEditView = ({ staff, form, roleOptions, photoUrl, inputClassName, isSaving, error, onSave, onCancel }) => {
    const { register, control, handleSubmit, formState: { errors } } = form;
    const initials = `${staff.firstNm?.trim()?.[0] ?? ""}${staff.lastNm?.trim()?.[0] ?? ""}`.toUpperCase();

    return (
    <form onSubmit={handleSubmit(onSave)} className="px-6 py-5 space-y-5">
        {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
            </div>
        )}

        <EditPhotoField form={form} currentPhotoUrl={photoUrl} initials={initials} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <ViewField label="Staff ID" className="border-b-0 !py-0">
                <span className="font-mono text-blue-700">{staff.staffId}</span>
            </ViewField>
            <FormField label="Gender" required error={errors.gender}>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-slate-700 rounded-lg w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FormField>
            <FormField label="First Name" required error={errors.firstName}>
                <Input className={inputClassName} {...register("firstName")} />
            </FormField>
            <FormField label="Last Name" required error={errors.lastName}>
                <Input className={inputClassName} {...register("lastName")} />
            </FormField>
            <FormField label="Email Address" required error={errors.email}>
                <Input type="email" className={inputClassName} {...register("email")} />
            </FormField>
            <FormField label="Mobile Number" required error={errors.mobileNumber}>
                <Input className={inputClassName} {...register("mobileNumber")} />
            </FormField>
            <FormField label="Date of Birth" required error={errors.dateOfBirth}>
                <Input type="date" className={inputClassName} {...register("dateOfBirth")} />
            </FormField>
            <FormField label="Date of Joining" required error={errors.dateOfJoining}>
                <Input type="date" className={inputClassName} {...register("dateOfJoining")} />
            </FormField>
            <div className="sm:col-span-2">
                <FormField label="Assign Roles" required error={errors.roles}>
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <RolesMultiSelect
                                value={field.value}
                                onChange={field.onChange}
                                roleOptions={roleOptions}
                            />
                        )}
                    />
                </FormField>
            </div>
        </div>

        <div className="border-t pt-5 flex justify-end gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
                className="w-[95px] h-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white w-[140px] h-10 rounded-lg font-medium transition-colors"
            >
                {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader size={16} className="animate-spin" />
                        <span>Saving</span>
                    </div>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </div>
    </form>
    );
};

// --- Main Component ---

const AddNewStaffMember = ({ open, onOpenChange, onSuccess }) => {
    const [roleOptions, setRoleOptions] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [globalError, setGlobalError] = useState(null);
    const [createdStaff, setCreatedStaff] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState(null);

    // Separate form for editing the created staff member, so the create form is untouched
    const editForm = useForm({
        resolver: zodResolver(staffEditSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            dateOfBirth: "",
            gender: "",
            dateOfJoining: "",
            roles: [],
            photo: null,
        },
    });

const [openPopOver, setOpenPopOver] = useState(false);                    

    const fileInputRef = useRef(null);



const fetchRoles = async () => {
   return (await roleApi.getAllRoles());
};

useEffect(() => {
    const getRoles = async () => {
        const response = await fetchRoles();
        setRoleOptions(response.data);
    }
getRoles();
},[]);
    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            dateOfBirth: "",
            gender: "",
            dateOfJoining: "",
            roles: [],
            photo: null,
        },
    });

    const watchedValues = watch([
        "firstName", "lastName", "email", "mobileNumber",
        "dateOfBirth", "gender", "dateOfJoining", "role"
    ]);
    const watchedPhoto = watch("photo");

    // Reset status flags when any input values change
    useEffect(() => {
        setSubmittedMsg(null);
        setGlobalError(null);
    }, [JSON.stringify(watchedValues), watchedPhoto?.name, watchedPhoto?.size]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setGlobalError(null);
        setSubmittedMsg(null);

        try {
            const formattedDOB = data.dateOfBirth instanceof Date
                ? data.dateOfBirth.toISOString().split('T')[0]
                : data.dateOfBirth;
            
            const formattedDateOfJoining = data.dateOfJoining instanceof Date
                ? data.dateOfJoining.toISOString().split('T')[0]
                : data.dateOfJoining;

            const result = await staffApi.createStaff(
                data.firstName,
                data.lastName,
                data.email,
                data.mobileNumber,
                [data.roles],
                formattedDOB,
                [data.gender],
                formattedDateOfJoining,
                data.photo,
            );

            setSubmittedMsg("Submitted successfully. Link has been sent to your mail");
            toast.success("Link has been sent to your mail", {
                duration: 5000,
                className: '!bg-green-800 !text-white'
            });
            onSuccess();

            // Read the saved record back from the database to show it in view mode;
            // fall back to the create response if the lookup fails
            const created = result?.data;
            try {
                const saved = created?.staffId ? await staffApi.getStaffById(created.staffId) : null;
                setCreatedStaff(saved?.data || created || null);
            } catch (fetchError) {
                console.error("Fetching created staff failed: ", fetchError);
                setCreatedStaff(created || null);
            }
        } catch (error) {
            console.error("Submission failed: ", error);
            setSubmittedMsg(null);
            let fallbackMessage = error.response?.data?.message || "Internal system upgrade failure.";
            setGlobalError(fallbackMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        onOpenChange(false);
        setSubmittedMsg(null);
        setGlobalError(null);
        setCreatedStaff(null);
        setIsEditing(false);
        setEditError(null);
        editForm.reset();
    };

    const handleOpenChange = (isOpen) => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        reset();
        setSubmittedMsg(null);
        setGlobalError(null);
        setCreatedStaff(null);
        setIsEditing(false);
        setEditError(null);
        editForm.reset();
        onOpenChange(isOpen);
    };

    const startEdit = () => {
        editForm.reset({
            firstName: createdStaff.firstNm || "",
            lastName: createdStaff.lastNm || "",
            email: createdStaff.email || "",
            mobileNumber: createdStaff.mobileNum || "",
            dateOfBirth: createdStaff.dob?.split("T")[0] || "",
            gender: createdStaff.gender || "",
            dateOfJoining: createdStaff.dateOfJoining?.split("T")[0] || "",
            // The response holds role names; the picker works with role ids
            roles: [...(createdStaff.roles || [])]
                .map((role) => roleOptions.find((opt) => opt.roleNm === role)?.id)
                .filter((id) => id !== undefined),
            photo: null,
        });
        setEditError(null);
        setSubmittedMsg(null);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setEditError(null);
        setSubmittedMsg(null);
        setIsEditing(false);
    };

    const 
    onSaveEdit = async (data) => {
        setIsSaving(true);
        setEditError(null);

        try {
            await staffApi.updateStaffDetails(createdStaff.staffId, {
                firstNm: data.firstName,
                lastNm: data.lastName,
                dob: data.dateOfBirth,
                gender: data.gender,
                dateOfJoining: data.dateOfJoining,
                email: data.email,
                mobileNum: data.mobileNumber,
                roleIds: data.roles,
            });

            // Upload the new profile photo only when one was picked
            if (data.photo instanceof File) {
                await staffApi.updateProfileImage1(createdStaff.staffId, data.photo);
                if (photoPreview) URL.revokeObjectURL(photoPreview);
                setPhotoPreview(URL.createObjectURL(data.photo));
            }
        } catch (error) {
            console.error("Update failed: ", error);
            setEditError(error.response?.data?.message || "Failed to update staff details.");
            setIsSaving(false);
            return;
        }

        // Read the updated record back from the database
        try {
            const saved = await staffApi.getStaffById(createdStaff.staffId);
            setCreatedStaff(saved.data);
        } catch (fetchError) {
            console.error("Fetching updated staff failed: ", fetchError);
            setCreatedStaff((prev) => ({
                ...prev,
                firstNm: data.firstName,
                lastNm: data.lastName,
                dob: data.dateOfBirth,
                gender: data.gender,
                dateOfJoining: data.dateOfJoining,
                email: data.email,
                mobileNum: data.mobileNumber,
                roles: data.roles
                    .map((id) => roleOptions.find((opt) => opt.id === id)?.roleNm)
                    .filter(Boolean),
            }));
        }

        toast.success("Staff details updated successfully!");
        onSuccess();
        setSubmittedMsg(null);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setValue("photo", file, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        setValue("photo", null, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const inputClassName = "h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-[720px] p-0 max-h-[95vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-xl bg-white border-none shadow-xl">
   
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-900">
                                {createdStaff ? "Staff Member Details" : "Add New Staff Member"}
                            </DialogTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                {isEditing
                                    ? "Update the details below and save your changes."
                                    : createdStaff
                                    ? "The staff account has been created with the details below."
                                    : "Fill in the details to create a new staff account."}
                            </p>
                        </div>
                        {createdStaff && !isEditing && (
                            <Button
                                type="button"
                                onClick={startEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-lg font-medium transition-colors gap-1.5 shrink-0"
                            >
                                <Pencil size={14} />
                                Edit
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {createdStaff && isEditing ? (
                    <StaffEditView
                        staff={createdStaff}
                        form={editForm}
                        roleOptions={roleOptions}
                        photoUrl={photoPreview}
                        inputClassName={inputClassName}
                        isSaving={isSaving}
                        error={editError}
                        onSave={onSaveEdit}
                        onCancel={cancelEdit}
                    />
                ) : createdStaff ? (
                    <StaffDetailsView
                        staff={createdStaff}
                        photoUrl={photoPreview}
                        submittedMsg={submittedMsg}
                        onClose={handleClose}
                    />
                ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    
                    {/* Status Banners */}
                    {globalError && (
                        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {globalError}
                        </div>
                    )}

                    {submittedMsg && (
                        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                            <CheckCircle className="text-green-600" size={20} />
                            {submittedMsg}
                        </div>
                    )}

                    {/* Top Shared Layout Wrapper */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-5 items-start">
                        
                        {/* 6 Grid Inputs Left Block */}
                        <div className="space-y-4">
                            {/* Name Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="First Name" required error={errors.firstName}>
                                    <Input 
                                        placeholder="e.g. Anika" 
                                        className={inputClassName} 
                                        {...register("firstName")} 
                                    />
                                </FormField>
                                <FormField label="Last Name" required error={errors.lastName}>
                                    <Input 
                                        placeholder="e.g. Sharma" 
                                        className={inputClassName} 
                                        {...register("lastName")} 
                                    />
                                </FormField>
                            </div>

                            {/* Contact Details Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Email Address" required error={errors.email}>
                                    <Input 
                                        placeholder="name@mcpadmin.io" 
                                        type="email" 
                                        className={inputClassName} 
                                        {...register("email")} 
                                    />
                                </FormField>
                                <FormField label="Mobile Number" required error={errors.mobileNumber}>
                                    <Input 
                                        placeholder="+1 (555) 000-0000" 
                                        className={inputClassName} 
                                        {...register("mobileNumber")} 
                                    />
                                </FormField>
                            </div>

                            {/* Personal Details Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Date of Birth" required error={errors.dateOfBirth}>
                                    <Input 
                                        type="date" 
                                        className={`${inputClassName} text-slate-500`} 
                                        {...register("dateOfBirth")} 
                                    />
                                </FormField>
                                <FormField label="Gender" required error={errors.gender}>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value || ""} >
                                                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-slate-500 rounded-lg w-full">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg">
                                                    <SelectItem value="MALE">Male</SelectItem>
                                                    <SelectItem value="FEMALE">Female</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Standalone Photo Component Uploader (Right Block) */}
                        <PhotoUpload
                            fileInputRef={fileInputRef}
                            photoPreview={photoPreview}
                            onPhotoChange={handlePhotoChange}
                            onRemovePhoto={removePhoto}
                            error={errors.photo}
                            register={{...register("photo")}}
                        />
                    </div>

                    {/* Bottom Full-Width Section */}
                    <div className="space-y-4 pt-1">
                        <FormField label="Date of Joining" required error={errors.dateOfJoining}>
                            <Input 
                                type="date" 
                                className={`${inputClassName} text-slate-500`} 
                                {...register("dateOfJoining")} 
                            />
                        </FormField>

                        

<div className="flex flex-col gap-1.5">                                   
        <label className="text-sm font-medium text-slate-700">
          Assign Roles <span className="text-red-500">*</span>
        </label>

        <Controller
          name="roles"
          control={control}
          render={({ field }) => {
            const selectedValues = field.value || [];

            const toggleOption = (val) => {
              const updated = selectedValues.includes(val)
                ? selectedValues.filter((item) => item !== val)
                : [...selectedValues, val];
              field.onChange(updated);
            };

            return (
              <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full min-h-10 h-auto py-2 px-3 justify-between bg-slate-50 border-slate-200 hover:bg-slate-100 rounded-lg text-left font-normal"
                  >
                    <div className="flex flex-wrap gap-1 items-center max-w-[85%]">
                      {selectedValues.length === 0 && (
                        <span className="text-slate-400 text-sm">Select roles...</span>
                      )}

                      {selectedValues.map((val) => {
                        const label = roleOptions.find((opt) => opt.id === val)?.roleNm;                                      
                         return (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="bg-slate-200 text-slate-800 hover:bg-slate-300 gap-1 rounded-md text-xs py-0.5 px-2"
                          >
                            {label}
                            <X
                              className="h-3 w-3 text-slate-500 hover:text-slate-900 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOption(val);
                              }}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg bg-white border border-slate-200 shadow-md">
                  <Command>
                    <CommandInput placeholder="Search roles..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        {roleOptions.map((option) => {                                                     
                          const isSelected = selectedValues.includes(option.id);
                          return (
                            <CommandItem
                              key={option.id}
                              onSelect={() => toggleOption(option.id)}
                              className="cursor-pointer flex items-center justify-between py-2 px-3 hover:bg-slate-100 rounded-md"
                            >
                              {/* Custom Checkbox Box UI */}
                              <div className="flex items-center gap-2">
                                <div
                                  className=
                                    {`flex h-4 w-4 items-center justify-center rounded border border-slate-300 transition-colors ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "bg-white opacity-70"}
                                    `}
                                >
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                                <span className="text-sm text-slate-700 font-medium">
                                  {option.roleNm}
                                </span>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          }}
        />

        {errors.roles && (
          <p className="text-xs font-medium text-red-500">{errors.roles.message}</p>
        )}
      </div>

                    </div>

                    {/* Bottom Action Footer Control Block */}
                    <div className="border-t pt-5 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="w-[95px] h-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-[160px] h-10 rounded-lg font-medium transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader size={16} className="animate-spin" />
                                    <span>Submitting</span>
                                </div>
                            ) : (
                                "Create Staff Member"
                            )}
                        </Button>
                    </div>
                </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddNewStaffMember;

