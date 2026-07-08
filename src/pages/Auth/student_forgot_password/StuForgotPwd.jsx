import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Field from '@/components/common/Field';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from "lucide-react";

import { studentApi } from '@/api/student-controller.api';

const forgotPwdSchema = z.object({
    emailOrmobile: z.string()
        .trim()
        .min(1, "Email is required.")
        .email("Enter valid number.")
});


const StuForgotPwd = () => {

    const [globalError, setGlobalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isDirty }, watch, setError, reset } = useForm({
        resolver: zodResolver(forgotPwdSchema),
        defaultValues: {
            emailOrmobile: ""
        }
    });

    const watchedEmailValue = watch("emailOrmobile");

    useEffect(() => {
        console.log("entered into useEffect and watchedEmailValue value is: ", watchedEmailValue);
        setGlobalError(null);

    }, [watchedEmailValue]);

    const onSubmit = async (data) => {

        setIsSubmitting(true);

        console.log("entered into onSubmit(.) and entered email is: ", data);
        try {
            const response = await studentApi.forgotPassword({ getEmailIdOrMobileNo: data.emailOrmobile, otpChannel: "EMAIL" });
            console.log("response is: ", response);
            console.log("response.data is:", response.data);
            navigate("/stuResetPwd", { state: { EmailIdOrMobileNo: data.emailOrmobile } });
            reset();
        } catch (error) {
            const backendErrors = error.response?.data?.fieldErrors;
            if (backendErrors) {
                Object.keys(backendErrors).forEach((field) => {
                    setError(field, {
                        type: "server",
                        message: backendErrors[field],
                    });
                });
            } else {
                const fallbackMessage = error.response?.data || "Internal system upgrade failure.";
                setGlobalError(fallbackMessage);
            }
        } finally {
            console.log("finally block is exicuted.");
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

                        {globalError && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                                {globalError}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                            className="space-y-5"
                        >
                            <Field label="EmailOrMobileNumber" error={errors.emailOrmobile?.message}>
                                <Input {...register("emailOrmobile")} placeholder="emailId or mobile number" />
                            </Field>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader className="animate-spin" />
                                        Sending
                                    </>
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </form>

                    </CardContent>
                </CardHeader>

            </Card>

        </>
    );
}

export default StuForgotPwd;