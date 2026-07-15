import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Field from '@/components/common/Field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Loader, RefreshCwIcon } from "lucide-react";

import { studentApi } from '@/api/student-controller.api';

const forgotPwdSchema = z.object({
    otp: z.string()
        .trim()
        .min(1, "OTP is required.")
        .length(6, "OTP must be 6 digits.")
        .regex(/^\d+$/, "OTP must contain only digits"),

    newPwd: z.string()
        .trim()
        .min(1, "New Password is required")
        // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    confirmPwd: z.string()
        .trim()
        // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
}).refine((data) => data.newPwd === data.confirmPwd, {
    message: "New Password and Confirm Password must match",
    path: ["confirmPwd"],
});

const StuResetPwd = () => {
    const [globalError, setGlobalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(120);

    const location = useLocation();
    const navigate = useNavigate();

    const { register, control, handleSubmit, formState: { errors, isDirty }, watch, setError, reset } = useForm({
        resolver: zodResolver(forgotPwdSchema),
        defaultValues: {
            otp: "",
            newPwd: "",
        }
    });

    // Format seconds to MM:SS string
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleResendOtp = async () => {

        try {
            setResending(true);

            const payload = {
                //emailId: email,
                emailId: location?.state?.EmailIdOrMobileNo,
                mobileNum: "string",
                purpose: "LOGIN",
                otpChannel: "EMAIL"
            };

            const res = await studentApi.resendOtp(payload);

            toast.success("OTP resent successfully! 🎉");
            setTimer(120);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Failed to resend OTP";
            toast.error(errorMsg);
        } finally {
            setResending(false);
        }

    };

    const [otp, newPwd] = watch(["otp", "newPwd"]);

    useEffect(() => {


        setGlobalError(null);

    }, [otp, newPwd]);

    useEffect(() => {
        if (timer === 0) return;

        const intervalId = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);

    }, [timer]);

    const onSubmit = async (data) => {

        let payload = {
            "emailIdOrMobileNo": location?.state?.EmailIdOrMobileNo,
            "otp": otp,
            "newPassword": newPwd
        }
        setIsSubmitting(true);


        try {
            const response = await studentApi.resetPassword(payload);
            console.log("response is: ", response);
            toast.success("Password changed successfully. 🎉", { className: '!bg-green-800 !text-white',
                duration:3000
             });
            reset();
            setTimeout(() => {
                navigate("/studentLogin"); 
            },3000)
        } catch (error) {
            const backendErrors = error.response?.data?.fieldErrors;
            if (backendErrors) {
                Object.keys(backendErrors).forEach((field) => {
                    setError(field, {
                        type: "server",
                        message: backendErrors[field],
                    });
                });
             } else if (error.response?.data.trim().toLowerCase().includes("invalid otp")) {
                setError("otp", {
                     type: "server",
                     message: "Invalid OTP"
                 });
             } else if (error.response?.data.toString().trim().toLowerCase().includes("otp expired")) {
                 setError("otp", {
                     type: "server",
                     message: "OTP expired"
                 });    
             }else if (error.response?.data.toString().trim().toLowerCase().includes("otp already used")) {
                 setError("otp", {
                     type: "server",
                     message: "OTP already used"
                 });    
             }
                 else {
                const fallbackMessage = error.response?.data?.message || "Internal system upgrade failure.";
                setGlobalError(fallbackMessage);
                error.response?.data.toLowerCase().includes("invalid otp");
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card className="mx-auto max-w-md shadow-lg mt-10">
                <CardHeader>
                    {/* <CardTitle>Shashikanth</CardTitle> */}
                    <CardDescription></CardDescription>
                    <CardContent>
                        <Link to="/studentLogin">Login</Link>
                        {globalError && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                                {globalError}
                            </div>
                        )}



                        <div className='flex justify-center'>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                                className="space-y-5"
                            >


                                <Field label="OTP" error={errors.otp?.message}>
                                    <div className='flex gap-10'>
                                        <Controller
                                            name="otp"
                                            control={control}
                                            render={({ field }) => (
                                                <InputOTP
                                                    maxLength={6}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <InputOTPGroup>
                                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                                            <InputOTPSlot key={i} index={i} />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            )}
                                        />

                                        {/* <label>Verification code:</label>  */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1 text-xs"
                                            onClick={handleResendOtp}
                                            disabled={resending || timer > 0} // Disabled while sending or during countdown
                                        >
                                            <RefreshCwIcon
                                                className={`h-3 w-3 ${resending ? "animate-spin" : ""}`}
                                            />
                                            {resending
                                                ? "Sending..."
                                                : timer > 0
                                                    ? `Resend in ${formatTime(timer)}`
                                                    : "Resend OTP"
                                            }
                                        </Button>
                                    </div>


                                </Field>




                                <Field label="New Password" error={errors.newPwd?.message}>
                                    <Input {...register("newPwd")} type="password" placeholder="Enter New Password" />
                                </Field>

                                <Field label="Confirm Password" error={errors.confirmPwd?.message}>
                                    <Input {...register("confirmPwd")} type="password" placeholder="Enter Confirm Password" />
                                </Field>

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="animate-spin" />
                                            Submitting
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </CardHeader>

            </Card>

        </>
    );
}


export default StuResetPwd;