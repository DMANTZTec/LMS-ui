import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Eye, EyeOff, Loader2, Loader } from 'lucide-react';
import Field from '@/components/common/Field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
//import { Label } from '@/components/ui/label';


import { staffApi } from '@/api/staff-controller.api';
import { toast } from 'react-hot-toast';

const createPwdSchema = z.object({
    
    pwd: z
        .string()
        .min(1, "Password is required.")
        //.min(8, "password must be atleast 8 chareters long")
        // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPwd: z
        .string()
        .min(1, "ConfirmPwd is required"),
}).refine((data) => data.pwd === data.confirmPwd, {
    message: " Password and Confirm password do not match.",
    path: ["confirmPwd"]
});

const CreateStaffPwd = () => {
const [ searchParams ] = useSearchParams();

const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [globalError, setGlobalError] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Extract the specific query parameter
  const tokenValue = searchParams.get('token');

    const { register, handleSubmit, reset, setError, formState: { errors }, watch } = useForm({
        resolver: zodResolver(createPwdSchema),
        defaultValues: {
            "pwd": "",
            "confirmPwd": ""
        }
    })

   const watchedValues = watch(["pwd","confirmPwd"]);

   useEffect(() => {
    console.log("entered into useEffect");
    setSubmittedMsg(null);
    setGlobalError(null);
   },[JSON.stringify(watchedValues)]);

    const createPwd = async (data) => {
    
        setIsSubmitting(true);
    setSubmittedMsg(null);
    setGlobalError(null);


        
    const payload = {
    token: tokenValue,
    password: data.pwd,
    confirmPassword: data.confirmPwd
    };
    
try {
const result = await staffApi.setPassword(payload);
setSubmittedMsg("Staff password created successfully.");
//toast.success("Staff password created successfully.", {duration: 5000,className: '!bg-green-800 !text-white' });

//reset();
} catch(error) {
    setIsSubmitting(false);
    
    if(error.response) {
        setGlobalError(error.response?.data);
      }else {
        if(error.request) {
        
            setGlobalError("Network Error: No internet connection or server down.");
      }
      }
} finally {
    setIsSubmitting(false);
}
    };

    return (
        <>
            <Card className="mx-auto max-w-md shadow-lg mt-10">
                <CardHeader>
                    <CardTitle>Create Staff Password</CardTitle>
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
                    <form onSubmit={handleSubmit(createPwd)} noValidate className="space-y-4">
                        

                        <Field label="Password" error={errors.pwd?.message}>
                            <div className="relative flex items-center max-w-sm">
                            <Input {...register("pwd")} type={showPassword ? "text": "password"} 
                            className="pr-10 bg-gray-100" />
                            <Button type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 bg-gray-100 hover:bg-gray-100"
                                    aria-label={showPassword ? "Hide password" : "Show password"} >
                            {showPassword ? <Eye size={18} /> : <EyeOff size="18"/>}
                            </Button>
                            </div>
                        </Field>

                        <Field label="Confirm Password" error={errors.confirmPwd?.message}>
                            <div className="relative flex items-center max-w-sm">
                                                        <Input {...register("confirmPwd")} type={ showConfirmPassword? "text": "password"} 
                                                        className="pr-10 bg-gray-100" />
                                                        <Button type="button"
                                                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                                                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 bg-gray-100 hover:bg-gray-100"
                                                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} >
                                                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size="18"/>}
                                                        </Button>
                                                        </div>
                        </Field>

                        <Button type="submit" disabled = {isSubmitting}>
                            {isSubmitting ? (
                            <>
                            <Loader className='animate-spin'/> Submitting
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
};

export default CreateStaffPwd;