import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';
import { Upload, CheckCircle, Loader } from "lucide-react";

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

const AddNewStaffMember = ({ open, onOpenChange }) => {

    // Flag state to control the dialog visibility explicitly
    const [isOpen, setIsOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [globalError, setGlobalError] = useState(null);


    const fileInputRef = useRef(null);

    // 2. Pure React Hook Form Configuration
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, dirtyFields },
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
            role: "",
            photo: []
        },
    });

const watchedValues = watch(["firstName", 
  "lastName", 
  "email", 
  "mobileNumber", 
  "dateOfBirth", 
  "gender", 
  "dateOfJoining", 
  "role",
  ]);

  const watchedPhoto = watch("photo");


useEffect(() => {
    console.log("entered into useEffect of AddNewStaffMember");
    setSubmittedMsg(null);
setGlobalError(null);

},[JSON.stringify(watchedValues),watchedPhoto?.name,watchedPhoto?.size]);

    // Watch values for custom controlled components like shadcn Select
    const currentGender = watch("gender");
    const currentRole = watch("role");

    // const onSubmit = async (data: StaffFormValues) => {
    const onSubmit = async (data) => {
    setIsSubmitting(true);
setGlobalError(null);
setSubmittedMsg(null);    
    try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

// 1. Safely extract and format the date back into a string YYYY-MM-DD
      const formattedDOB = data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString().split('T')[0]
        : data.dateOfBirth;
           // 1. Safely extract and format the date back into a string YYYY-MM-DD
      const formattedDateOfJoining = data.dateOfJoining instanceof Date
        ? data.dateOfJoining.toISOString().split('T')[0]
        : data.dateOfJoining;
            
            console.log("Submitting directly to Spring Boot API...", data);
            const result = await staffApi.createStaff(
            data.firstName, 
            data.lastName, 
            data.email, 
            data.mobileNumber, 
            [data.role],                         //data.role, 
            formattedDOB,                         //data.dateOfBirth, 
            [data.gender],                             //data.gender, 
            formattedDateOfJoining,           //data.dateOfJoining, 
            data.photo 
            );

            console.log("result is: ",result);
            // options: RawAxiosRequestConfig = {});
            // Reset state on success
            //reset();
            //setPhotoPreview(null);
            //setIsOpen(false);
setSubmittedMsg("submitted successfully. Link has been sent to your mail");
toast.success("Link has been sent to your mail", { duration:5000,className: '!bg-green-800 !text-white' });
        } catch (error) {
            console.error("error is: ",error);
setSubmittedMsg(null);
let fallbackMessage = error.response?.data?.message || "Internal system upgrade failure.";
setGlobalError(fallbackMessage);
        } finally {
    setIsSubmitting(false);
}
    };

    const handleClose = () => {
        reset();
        setPhotoPreview(null);
        onOpenChange(false);

setSubmittedMsg(null);
setGlobalError(null);

    };

    const openChange = (isOpen) => {
        console.log("entered into openChange and isOpen value is: ", isOpen);
        setPhotoPreview(null);
        reset();

    setSubmittedMsg(null);
setGlobalError(null);


        onOpenChange(isOpen);
    }

    const removePhoto = () => {

        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhotoPreview(null);
        setValue("photo", null);
        fileInputRef.current.value = "";
    };

    return (
        <>
            <Dialog open={open} onOpenChange={openChange}>
                {/* Responsive widths, scrollable area fallback for short mobile devices, and subtle margins */}

                <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-xl md:max-w-3xl p-4 sm:p-6 bg-white rounded-xl max-h-[90vh] overflow-y-auto my-4">
{globalError && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                                {globalError}
                            </div>
                        )}


{submittedMsg && (
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-red-200 text-sm text-green-600">
                            <CheckCircle className="text-green-600" size={24} />{submittedMsg}
                        </div>

                    )}

                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900">
                            Add New Staff Member
                        </DialogTitle>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">

                            Fill in the details to create a new staff account.
                        </p>
                    </DialogHeader>

                    {/* Standard HTML Form powered directly by react-hook-form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 mt-4">
                        {/* Shifts from 1 column on mobile to 3 columns on medium screens and up */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

                            {/* Main Inputs (Left side columns on desktop, top on mobile) */}
                            <div className="md:col-span-2 space-y-4">

                                {/* Name Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
                                        <Input placeholder="e.g. Anika" className="bg-slate-50/50 w-full" {...register("firstName")} />
                                        {errors.firstName && <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
                                        <Input placeholder="e.g. Sharma" className="bg-slate-50/50 w-full" {...register("lastName")} />
                                        {errors.lastName && <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                {/* Contact Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                        <Input placeholder="name@mcpadmin.io" type="email" className="bg-slate-50/50 w-full" {...register("email")} />
                                        {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                                        <Input placeholder="+1 (555) 000-0000" className="bg-slate-50/50 w-full" {...register("mobileNumber")} />
                                    {errors.mobileNumber && <p className="text-xs font-medium text-red-500">{errors.mobileNumber.message}</p>}
</div>
                                </div>

                                {/* Info Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                                        <Input type="date" className="bg-slate-50/50 w-full" {...register("dateOfBirth")} />
{errors.dateOfBirth && <p className="text-xs font-medium text-red-500">{errors.dateOfBirth.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Gender</label>
                                        <Select onValueChange={(val) => setValue("gender", val)} value={currentGender}>
                                            <SelectTrigger className="bg-slate-50/50 w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
{errors.gender && <p className="text-xs font-medium text-red-500">{errors.gender.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Photo Upload Box (Right column on desktop, reordered/adapted gracefully for mobile layouts) */}
                            <div className="flex flex-col items-center justify-start pt-1 w-full max-w-[200px] mx-auto md:w-full md:max-w-none">
                                <span className="block text-sm font-medium text-slate-700 self-start mb-2">Photo</span>
                                <label className="w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition p-4 text-center relative group">
                                    
                                    <Input
                                        {...register("photo")}
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        //onChange={handlePhotoChange}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
    // Clear the old object URL to prevent memory leaks
                if (photoPreview) {
                    URL.revokeObjectURL(photoPreview);
                }
                                                setValue("photo", file, {
    shouldValidate: true,
    shouldDirty: true
});
                                                setPhotoPreview(URL.createObjectURL(file));


console.log("Newly selected file linked to form state:", file  );
                                            }
                                        }}
                                    />

                                    {photoPreview ? (
                                        <>                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>fileInputRef.current.click()}
                                                >
                                                    Change Photo
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={removePhoto}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>

                                            <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:scale-105 transition-transform">
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">Click to upload passport photo</span>
                                        </>
                                    )
                                    }
                                </label>
                                <span className="text-[11px] text-slate-400 mt-2 text-center">JPG or PNG Passport size</span>
                            </div>
                        </div>

                        {/* Bottom Form Elements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Date of Joining <span className="text-red-500">*</span></label>
                                <Input type="date" className="bg-slate-50/50 w-full" {...register("dateOfJoining")} />
                                {errors.dateOfJoining && <p className="text-xs font-medium text-red-500">{errors.dateOfJoining.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Assign Roles <span className="text-red-500">*</span></label>
                                <Select onValueChange={(val) => setValue("role", val)} value={currentRole}>
                                    <SelectTrigger className="bg-slate-50/50 w-full">
                                        <SelectValue placeholder="Select roles..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Administrator</SelectItem>
                                        <SelectItem value="3">Staff Member</SelectItem>
                                        <SelectItem value="2">Instructor</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-xs font-medium text-red-500">{errors.role.message}</p>}
                            </div>
                        </div>

                        {/* Action Buttons: Stacked on mobile, side-by-side on larger screens */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled = {isSubmitting}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5"
                            >
{isSubmitting ? (
                                        <>
                                            <Loader className="animate-spin" />
                                            Submitting
                                        </>
                                    ) : (
                                        "Create Staff Member"
                                    )}   
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default AddNewStaffMember;

// ----------------------------------------------------------

// import React, { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Upload } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { staffFormSchema } from "./AddNewStaffMemberSchema";

// import { staffApi } from '@/api/staff-controller.api';

// const AddNewStaffMember = ({ open, onOpenChange }) => {
//   // Flag state to control the dialog visibility implicitly
//   const [photoPreview, setPhotoPreview] = useState(null);
//   // Separate state to hold the newly selected photo
//   const [newPhoto, setNewPhoto] = useState(null);

//   const fileInputRef = useRef(null);

//   // 2. Pure React Hook Form Configuration
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(staffFormSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       mobileNumber: "",
//       dateOfBirth: "",
//       gender: "",
//       dateOfJoining: "",
//       role: "",
//     },
//   });

//   // Watch values for custom controlled components like shadcn Select
//   const currentGender = watch("gender");
//   const currentRole = watch("role");

//   // useEffect to handle memory leaks from revoked URLs
//   useEffect(() => {
//     return () => {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   // Function to handle photo selection
//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//       setPhotoPreview(URL.createObjectURL(file));
//       // Store the new photo file in its own state
//       setNewPhoto(file);
//     }
//   };

//   // Modified onSubmit function to be fully asynchronous
//   const onSubmit = async (data, e) => {
//     e.preventDefault(); // Prevent default form submission

//     try {
//       const formData = new FormData();
//       Object.entries(data).forEach(([key, value]) => {
//         if (value) formData.append(key, value);
//       });

//       console.log("Submitting with controlled photo handling...", data);
//      console.log("data.photo is : ",data.photo);

//       // Use the newly selected photo from its state, or the default if it exists
//       const photoToSend = newPhoto || data.photo;
//       formData.append("photo", photoToSend);

//       console.log("File currently prepared to send:", formData.get("photo"));

//       const result = await staffApi.createStaff(
//         data.firstName, 
//         data.lastName, 
//         data.email, 
//         data.mobileNumber, 
//         [data.role], 
//         data.dateOfBirth, 
//         [data.gender], 
//         data.dateOfJoining, 
//         photoToSend // Pass the correct photo to the API call
//       );

//       console.log("result is: ", result);

//       // Reset state and close modal on success
//       //handleClose();
//     } catch (error) {
//       console.error("error is: ", error);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     setPhotoPreview(null);
//     setNewPhoto(null);
//     onOpenChange(false);
//   };

//   const openChange = (isOpen) => {
//     setPhotoPreview(null);
//     setNewPhoto(null);
//     reset();
//     onOpenChange(isOpen);
//   }

//   const removePhoto = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }
//     setPhotoPreview(null);
//     setNewPhoto(null);
//     setValue("photo", null);
//     fileInputRef.current.value = "";
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={openChange}>
//         <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-xl md:max-w-3xl p-4 sm:p-6 bg-white rounded-xl max-h-[90vh] overflow-y-auto my-4">
//           <DialogHeader className="border-b pb-4">
//             <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900">
//               Add New Staff Member
//             </DialogTitle>
//             <p className="text-xs sm:text-sm text-slate-500 mt-1">
//               Fill in the details to create a new staff account.
//             </p>
//           </DialogHeader>

//           {/* Form component wrapping the handleSubmit function */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
//               <div className="md:col-span-2 space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
//                     <Input placeholder="e.g. Anika" className="bg-slate-50/50 w-full" {...register("firstName")} />
//                     {errors.firstName && <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>}
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
//                     <Input placeholder="e.g. Sharma" className="bg-slate-50/50 w-full" {...register("lastName")} />
//                     {errors.lastName && <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
//                     <Input placeholder="name@mcpadmin.io" type="email" className="bg-slate-50/50 w-full" {...register("email")} />
//                     {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Mobile Number</label>
//                     <Input placeholder="+1 (555) 000-0000" className="bg-slate-50/50 w-full" {...register("mobileNumber")} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Date of Birth</label>
//                     <Input type="date" className="bg-slate-50/50 w-full" {...register("dateOfBirth")} />
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Gender</label>
//                     <Select onValueChange={(val) => setValue("gender", val)} value={currentGender}>
//                       <SelectTrigger className="bg-slate-50/50 w-full">
//                         <SelectValue placeholder="Select gender" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="MALE">Male</SelectItem>
//                         <SelectItem value="FEMALE">Female</SelectItem>
//                         <SelectItem value="OTHER">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               {/* Corrected Photo Upload Box with event handling */}
//               <div className="flex flex-col items-center justify-start pt-1 w-full max-w-[200px] mx-auto md:w-full md:max-w-none">
//                 <span className="block text-sm font-medium text-slate-700 self-start mb-2">Photo</span>
                
//                 {/* File Input Ref used to isolate the file input */}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/jpeg,image/png"
//                   className="hidden"
//                   onChange={handlePhotoChange} // Attach the new handler
//                 />

//                 {/* Clickable Frame Area now purely opens the dialog */}
//                 <div 
//                   onClick={() => !photoPreview && fileInputRef.current?.click()} 
//                   className={`w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center relative group ${!photoPreview ? 'cursor-pointer hover:bg-slate-50 transition' : ''}`}
//                 >
//                   {photoPreview ? (
//                     <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
//                   ) : (
//                     <>
//                       <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:scale-105 transition-transform">
//                         <Upload size={20} />
//                       </div>
//                       <span className="text-xs font-medium text-slate-600">Click to upload passport photo</span>
//                     </>
//                   )}
//                 </div>

//                 {/* Operational buttons with stop propagation and prevent default */}
//                 {photoPreview && (
//                   <div className="flex gap-2 mt-3 w-full justify-center">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         e.preventDefault(); // Stop form submission
//                         e.stopPropagation(); // Stop parent label click
//                         fileInputRef.current?.click();
//                       }}
//                     >
//                       Change Photo
//                     </Button>

//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="sm"
//                       onClick={(e) => {
//                         e.preventDefault(); // Stop form submission
//                         e.stopPropagation(); // Stop parent label click
//                         removePhoto();
//                       }}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 )}
                
//                 <span className="text-[11px] text-slate-400 mt-2 text-center">JPG or PNG Passport size</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-slate-700">Date of Joining <span className="text-red-500">*</span></label>
//                 <Input type="date" className="bg-slate-50/50 w-full" {...register("dateOfJoining")} />
//                 {errors.dateOfJoining && <p className="text-xs font-medium text-red-500">{errors.dateOfJoining.message}</p>}
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-slate-700">Assign Roles <span className="text-red-500">*</span></label>
//                 <Select onValueChange={(val) => setValue("role", val)} value={currentRole}>
//                   <SelectTrigger className="bg-slate-50/50 w-full">
//                     <SelectValue placeholder="Select roles..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">Administrator</SelectItem>
//                     <SelectItem value="3">Staff Member</SelectItem>
//                     <SelectItem value="2">Instructor</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.role && <p className="text-xs font-medium text-red-500">{errors.role.message}</p>}
//               </div>
//             </div>

//             <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleClose}
//                 className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-5"
//               >
//                 Cancel
//               </Button>
//               {/* Type="submit" to trigger the onSubmit function on the form component */}
//               <Button
//                 type="submit"
//                 className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5"
//               >
//                 Create Staff Member
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default AddNewStaffMember;