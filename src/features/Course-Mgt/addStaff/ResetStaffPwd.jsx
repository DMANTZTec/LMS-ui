import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2 } from 'lucide-react';
import Field from '@/components/common/Field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { staffApi } from '@/api/staff-controller.api';


const resetPwdSchema = z.object({
    
    newPwd: z
        .string()
        .min(1, "New Password is required.")
        //.min(8, "password must be atleast 8 chareters long")
        // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPwd: z
        .string()
        .min(1, "ConfirmPwd is required"),
}).refine((data) => data.newPwd === data.confirmPwd, {
    message: " New Password and Confirm password do not match.",
    path: ["confirmPwd"]
});


const ResetStaffPwd = () => {
const [isSubmitting, setIsSubmitting] = useState(false);    
const [submittedMsg, setSubmittedMsg] = useState(null);
const [globalError, setGlobalError] = useState(null);

    const [ searchParams ] = useSearchParams();
// Extract the specific query parameter
  const tokenValue = searchParams.get('token');

 const { register, handleSubmit, reset, setError, formState: { errors }, watch } = useForm({
        resolver: zodResolver(resetPwdSchema),
        defaultValues: {
            "newPwd": "",
            "confirmPwd": ""
        }
    })

    const watchedValues = watch(["newPwd","confirmPwd"]);
    
       useEffect(() => {
        console.log("entered into useEffect");
        setSubmittedMsg(null);
        setGlobalError(null);
       },[JSON.stringify(watchedValues)]);

  const resetPwd = async (data) => {
setIsSubmitting(true);
setSubmittedMsg(null);
    setGlobalError(null);

let payload = {
    "token": tokenValue,
  "password": data.newPwd,
  "confirmPassword": data.confirmPwd
}
try {
const result = await staffApi.resetPassword1(payload);
// toast.success("new password was reset successfully", {
// duration: 5000, 
// className: '!bg-green-800 !text-white'
//  });
 setSubmittedMsg(" new password was reset successfully.");
}catch(error) {
setIsSubmitting(false);
                if(error.response) {
        setGlobalError(error.response?.data);
      }else {
        if(error.request)
        setGlobalError("Network Error: No internet connection or server down.");
      }
  } finally{
    setIsSubmitting(false);
  }
  }
    return (
        <>
         <Card className="mx-auto max-w-md shadow-lg mt-10">
                <CardHeader>
                    <CardTitle>Reset Staff Password</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    {submittedMsg && (
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-red-200 text-sm text-green-600">
                            <CheckCircle className="text-green-600" size={24} />{submittedMsg}
                        </div>

                    )}
                    {globalError && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                            {globalError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(resetPwd)} noValidate className="space-y-4">
                        

                        <Field label="New Password" error={errors.newPwd?.message}>
                            <Input {...register("newPwd")} type="password" />
                        </Field>

                        <Field label="Confirm Password" error={errors.confirmPwd?.message}>
                            <Input {...register("confirmPwd")} type="password" />
                        </Field>

                        <Button type="submit" disabled = {isSubmitting}>
                            {isSubmitting ? (
                            <>
                            <Loader2 className='animate-spin'/> Submitting
                            </>
                            ) : (
"Create Password"
                            )
                            }</Button>

                    </form>
                </CardContent>
            </Card>
        </>
    );
}

export default ResetStaffPwd;