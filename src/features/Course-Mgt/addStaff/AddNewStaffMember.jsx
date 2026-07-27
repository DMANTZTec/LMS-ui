import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';
import { Upload, CheckCircle, Loader, RefreshCw, Trash2, Check, ChevronsUpDown, X } from "lucide-react";

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

const PhotoUpload = ({ fileInputRef, photoPreview, onPhotoChange, onRemovePhoto, error, register }) => (
    <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-slate-700 self-start mb-2">
            Photo
        </label>

        {/* <input */}
          <input
          ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg"
            onChange={onPhotoChange}
            register
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
                                //onPhotoChange();                        i have added this line
                                
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

// --- Main Component ---

const AddNewStaffMember = ({ open, onOpenChange, onSuccess }) => {
    const [roleOptions, setRoleOptions] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [globalError, setGlobalError] = useState(null);

const [openPopOver, setOpenPopOver] = useState(false);                    

    const fileInputRef = useRef(null);



const fetchRoles = async () => {
   return (await roleApi.getAllRoles());
};

useEffect(() => {
    const getRoles = async () => {
        const response = await fetchRoles();
        console.log("response is: ", response);
        setRoleOptions(response.data);
        console.log("response.data is: ",response.data);
        
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
        getValues,
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

            roles: [],
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
        //console.log("entered into onSubmit function and data is: ",data);
        //const stringRolesArray = data.roles;
        //const formattedRolesArray =stringRolesArray.map(Number);
        
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
                data.photo
            );

            setSubmittedMsg("Submitted successfully. Link has been sent to your mail");
            toast.success("Link has been sent to your mail", { 
                duration: 5000, 
                className: '!bg-green-800 !text-white' 
            });
            onSuccess();
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
    };

    const handleOpenChange = (isOpen) => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        reset();
        setSubmittedMsg(null);
        setGlobalError(null);
        onOpenChange(isOpen);
    };

    const handlePhotoChange = (e) => {
        console.log("value of e is: ",e);
        console.log("value of e.target is: ", e.target);
        console.log("value of e.target.files?.[0]", e.target.files?.[0]);

        const file = e.target.files?.[0];
        console.log("in hadlePhotoChange function and file.type is: ",file.type);
       console.log("line1 in handlePhotoChange and getValues('photo') is: ",getValues("photo"));
        if (file) {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
                setValue("photo", file, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            console.log("line2 in handlePhotoChange and getValues('photo') is: ",getValues("photo"));
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
            <DialogContent className="w-[95vw] sm:max-w-[720px] p-0 overflow-hidden rounded-xl bg-white border-none shadow-xl">
                
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        Add New Staff Member
                    </DialogTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Fill in the details to create a new staff account.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit,(errors) => {console.log("validation failed");
                console.log("errors is: ",errors);})} className="px-6 py-5 space-y-5">
                    
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
                                <FormField label="Mobile Number" error={errors.mobileNumber}>
                                    <Input 
                                        placeholder="+1 (555) 000-0000" 
                                        className={inputClassName} 
                                        {...register("mobileNumber")} 
                                    />
                                </FormField>
                            </div>

                            {/* Personal Details Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Date of Birth" error={errors.dateOfBirth}>
                                    <Input 
                                        type="date" 
                                        className={`${inputClassName} text-slate-500`} 
                                        {...register("dateOfBirth")} 
                                    />
                                </FormField>
                                <FormField label="Gender" error={errors.gender}>
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
            </DialogContent>
        </Dialog>
    );
};

export default AddNewStaffMember;

