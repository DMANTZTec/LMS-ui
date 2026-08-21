import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Field from '@/components/common/Field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

import { studentApi } from '@/api/student-controller.api';

const forgotPwdSchema = z.object({
    emailOrmobile: z.string()
        .trim()
        .min(1, "Email or mobile number is required.")
        .email("Enter a valid email address.")
});

const StuForgotPwd = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        resolver: zodResolver(forgotPwdSchema),
        defaultValues: {
            emailOrmobile: ""
        }
    });

    const watchedEmailValue = watch("emailOrmobile");

    useEffect(() => {
        setErrorMsg(null);
    }, [watchedEmailValue]);

    const onSubmit = async (data) => {
        setSubmittedMsg(null);
        setErrorMsg(null);

        const payload = {
            emailIdOrMobileNo: data.emailOrmobile,
            otpChannel: "EMAIL"
        };

        setIsLoading(true);

        try {
            await studentApi.forgotPassword(payload);

            toast.success("OTP sent to your email successfully.", {duration: 5000,className: '!bg-green-800 !text-white'
            });

            setSubmittedMsg(
                "OTP has been sent to your registered email address. Please verify the OTP to continue."
            );

            reset();

            setTimeout(() => {
                navigate("/stuResetPwd", {
                    state: {
                        EmailIdOrMobileNo: data.emailOrmobile
                    }
                });
            }, 2000);

        } catch (error) {
            if (error.response) {
                setErrorMsg(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to send OTP. Please try again."
                );
            } else if (error.request) {
                setErrorMsg(
                    "Network Error: Please check your internet connection."
                );
            } else {
                setErrorMsg(
                    "An unexpected error occurred. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col gap-6">

                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Reset your Password
                    </h1>

                    <p className="text-sm text-slate-500 leading-relaxed">
                        Enter your registered email address to receive an OTP for
                        password reset verification.
                    </p>
                </div>

                {/* Feedback Messages */}
                {submittedMsg && (
                    <div className="flex items-start gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                        <CheckCircle
                            className="shrink-0 text-emerald-600 mt-0.5"
                            size={18}
                        />
                        <span>{submittedMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                        {errorMsg}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                >
                    <Field
                        label="Email or Mobile Number"
                        error={errors.emailOrmobile?.message}
                    >
                        <Input
                            {...register("emailOrmobile")}
                            placeholder="Enter your email or mobile number"
                        />
                    </Field>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 mt-1 rounded-lg bg-[#1B3B53] hover:bg-[#153044] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="text-center pt-1">
                    <Link
                        to="/studentLogin"
                        className="text-sm font-medium text-[#205493] hover:underline transition-all"
                    >
                        Back To Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default StuForgotPwd;

