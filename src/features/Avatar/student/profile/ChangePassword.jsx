import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { studentDataAtom } from '@/store/atoms';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

import Field from '@/components/common/Field';
import { studentApi } from '@/api/student-controller.api';

const changePWDScheema = z.object({
    currentPWD: z
        .string()
        .min(1, "currentPWD is required.")
        .min(8, "currnetPWD must be atleast 8 chareters long"),

    newPWD: z
        .string()
        .min(1, "Password is required")
        // Enforces length between 8 and 12 characters
        .min(8, "Password must be at least 8 characters long")
        .max(12, "Password cannot exceed 12 characters")
        // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPWD: z
        .string()
        .min(1, "confirmPWD is required")
}).refine((data) => data.newPWD === data.confirmPWD, {
    message: "New password and confirm password do not match.",
    path: ["confirmPWD"]
});

const ChangePassword = ({ open, onOpenChange }) => {

    const [submitted, setSubmitted] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [studentData_jotai, setStudentData_jotai] = useAtom(studentDataAtom);

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showCurrentPassword, setShowCurrentPassword ] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const { register, handleSubmit, reset, setError, formState: { errors }, watch } = useForm({
        resolver: zodResolver(changePWDScheema),
        defaultValues: { 
            "currentPWD": "",
            "newPWD":"",
            "confirmPWD":""             
        }
    });

    const [currentPWD, newPWD, confirmPWD] = watch(["currentPWD", "newPWD", "confirmPWD"]);
    
    useEffect(() => {
    console.log("entered into useEffect hook. ");
    setSubmitted(false);
    setGlobalError(null);
    },[currentPWD,newPWD,confirmPWD]); 


    const handleOpenChange = (isOpen) => {
        //setOpen(isOpen);

        // When the modal closes (either via 'X', clicking outside, or cancel), reset state
        if (!isOpen) {
            setSubmitted(false);
            setGlobalError(null);
            reset(); // Clears react-hook-form inputs and errors
        }
        onOpenChange(isOpen);
    };

    const save = async (data) => {
        setIsSubmitting(true);

        setGlobalError(null);
        setSubmitted(false);
        console.log("entered into save() function and the data is: ", data);
        console.log("new password is: ", data.newPWD);
        const studentData_ss = JSON.parse(sessionStorage.getItem("stuRegData"));
        console.log("studentData_ss.studentId is: ", studentData_ss.studentId);
        const student_id = studentData_jotai?.studentId || studentData_ss?.studentId;

        const payload = {
            "studentId": student_id,
            "oldPassword": data.currentPWD,
            "newPassword": data.newPWD,
            "confirmPassword": data.confirmPWD
        };

        try {
            const response = await studentApi.changePassword(payload);
            console.log("response?.data is: ", response?.data);
            console.log("response is: ", response);
            
            setSubmitted(true);

            //reset();
        } catch (error) {
            
            setSubmitted(false);
            let backend_error_one = "Current password is incorrect";
            let backend_error_two = "New password must be different from Current password";
            if(error.response) {
            if ((error.response?.data).trim().toLowerCase() === "old password is incorrect")
                setGlobalError(backend_error_one);
            if ((error.response?.data).trim().toLowerCase() === "new password must be different from old password")
                setGlobalError(backend_error_two);
        }
        else {
            if(error.request)
            setGlobalError("Network Error: No internet connection or server down.");
    }
        } finally {
    setIsSubmitting(false);
}

    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>

                {/* <DialogTrigger className="text-blue-500">
                    Change password
                </DialogTrigger> */}
                <DialogContent>
                    <DialogDescription></DialogDescription>

                    <DialogHeader>
                        {/* <DialogTitle>Change Password</DialogTitle> */}
                    </DialogHeader>
                    {submitted && (
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-red-200 text-sm text-green-600">
                            <CheckCircle className="text-green-600" size={24} />Password changed successfully.
                        </div>

                    )}
                    {globalError && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                            {globalError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(save)} noValidate className='space-y-4'>
                        <Field label="Current password" error={errors.currentPWD?.message}>
                                <div className="relative flex items-center max-w-sm">                      
                            <Input {...register("currentPWD")} type={showCurrentPassword ? "text": "password"} placeholder="current password" className='' />
                                <Button type="button"
                                    onClick={() => setShowCurrentPassword(prev => !prev)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 bg-gray-100 hover:bg-gray-100"
                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"} >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size="18"/>}
                            </Button>   
                            </div>
                        </Field>
                        <Field label="New password" error={errors.newPWD?.message}>
                            <div className="relative flex items-center max-w-sm">
                            <Input {...register("newPWD")} type={showNewPassword ? "text": "password"} placeholder="new password" />
                            <Button type="button"
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 bg-gray-100 hover:bg-gray-100"
                                    aria-label={showNewPassword ? "Hide password" : "Show password"} >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size="18"/>}
                            </Button>
                            </div>
                        </Field>
                        <Field label="Confirm password" error={errors.confirmPWD?.message}>
                            <div className="relative flex items-center max-w-sm">
                            <Input {...register("confirmPWD")} type={showConfirmPassword ? "text": "password"} placeholder="re enter password" />
                        <Button type="button"
                                                                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                                                                        className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 bg-gray-100 hover:bg-gray-100"
                                                                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} >
                                                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size="18"/>}
                                                                                </Button>
                        </div>
                        </Field>


                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                        
                            <Button type="submit" disabled = {isSubmitting}>
                            {isSubmitting ? (
                            <>
                            <Loader2 className='animate-spin'/> Submitting
                            </>
                            ) : (
"Create Password"
                            )
                            }</Button>

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChangePassword;