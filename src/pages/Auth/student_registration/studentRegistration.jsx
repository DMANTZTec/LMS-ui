import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useAtom } from "jotai";
import { studentApi } from "@/api/student-controller.api.js";
import { UserPlus, Loader2, TriangleAlert, Check, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/common/Field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { studentDataAtom, student_registrationStatusAtom, student_registrationServerErrorAtom } from "@/store/atoms/authAtoms";

// ─── Shared input styling ─────────────────────────────────────────────────────
const inputCls = (hasError) =>
  `h-10 w-full rounded-xl border px-4 text-sm transition-all duration-200
   placeholder:text-gray-400 outline-none
   focus:ring-2 focus:ring-blue-500/20 focus:bg-white
   ${hasError
    ? "border-red-400 bg-red-50/50 focus:border-red-400 focus:ring-red-500/20"
    : "border-gray-200 bg-gray-50/50 focus:border-blue-500"
  }`;

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const studentSchema = z.object({
  firstNm: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, { message: "First name must be at least two characters long." })
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "First name must only contain letters, spaces, hyphens, and apostrophes."
    }),

  lastNm: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, { message: "Last name must be at least two characters long." })
    .max(50, "Last name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Last name must only contain letters, spaces, hyphens, and apostrophes."
    }),

  mobileNum: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  emailId: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password cannot exceed 12 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  confirm_password: z
    .string()
    .min(1, "Confirm password is required"),

  currentStatus: z
    .string()
    .optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Password and confirm password do not match",
  path: ["confirm_password"],
});

// ─── Component ────────────────────────────────────────────────────────────────
const StudentRegistration = () => {
  const [, setStudentData] = useAtom(studentDataAtom);
  const [status, setStatus] = useAtom(student_registrationStatusAtom);
  const [serverError, setServerError] = useAtom(student_registrationServerErrorAtom);

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      firstNm: "",
      lastNm: "",
      mobileNum: "",
      emailId: "",
      password: "",
      confirm_password: "",
      currentStatus: "",
    },
  });

  const navigate = useNavigate();

  // ── Submit handler ──────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setStatus("submitting");
    setServerError(null);

    const testingData = { ...data, otpChannel: "EMAIL" };

    try {
      const response = await studentApi.register(testingData);
      if (response && response.data) {
        sessionStorage.setItem("stuRegData", JSON.stringify(response.data));
        setStudentData(response.data);
        setStatus("success");
        reset();
        navigate("/verify-student-reg-otp");
        setTimeout(() => { setStatus("idle"); }, 30000);
      }
    } catch (error) {
      setStatus("error");
      const message = error.response?.data || "Registration failed";

      if (message.toLowerCase().includes("email already exists")) {
        setError("emailId", {
          type: "manual",
          message: message,
        });
      } else if (message.toLowerCase().includes("mobile number already exists")) {
        setError("mobileNum", {
          type: "manual",
          message: message,
        });
      } else {
        setServerError(message);
      }
    }
  };  

  const isSubmitting = status === "submitting";

  const LabelWithAsterisk = ({ label, isRequired = false }) => (
    <span className="text-sm font-semibold text-gray-700">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </span>
  );

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] flex items-center justify-center py-8 px-4">
      {/* Top-Left Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex h-12 p-3 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:bg-gray-100 active:scale-95"
        title="Go Back"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" /> Go Back
      </button>

      {/* Centered Form Wrapper */}
      <div className="w-full max-w-[450px]">    
        {/* Top Header */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <UserPlus className="h-[24px] w-[24px]" strokeWidth={1.75} />
          </div>
        </div>

        <h1 className="pb-6 text-center text-2xl font-semibold text-[#0F172A]">
          Student Registration
        </h1>

        {/* Form Card */}
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-200/50">

          {/* Server-level Error Banner */}
          {status === "error" && serverError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError || "Please try again later"}</span>
            </div>
          )}

          {/* Success Banner */}
          {status === "success" && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
              <Check className="h-4 w-4 shrink-0" />
              <span>Registration successful! Welcome aboard.</span>
            </div>
          )}

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* First Name */}
            <Field label={<LabelWithAsterisk label="First Name" isRequired />} error={errors.firstNm?.message}>
              <Input
                placeholder="Enter your first name"
                autoComplete="given-name"
                {...register("firstNm")}
                className={inputCls(!!errors.firstNm)}
              />
            </Field>

            {/* Last Name */}
            <Field label={<LabelWithAsterisk label="Last Name" isRequired />} error={errors.lastNm?.message}>
              <Input
                placeholder="Enter your last name"
                autoComplete="family-name"
                {...register("lastNm")}
                className={inputCls(!!errors.lastNm)}
              />
            </Field>

            {/* Mobile Number with India Flag (+91) Prefix */}
            <Field label={<LabelWithAsterisk label="Mobile Number" isRequired />} error={errors.mobileNum?.message}>
              <div className="relative flex items-center w-full">
                <div className={`flex h-10 items-center justify-center rounded-l-xl border-r bg-gray-100 px-3 text-sm font-medium text-gray-600 border ${
                  errors.mobileNum ? "border-red-400 bg-red-50/50" : "border-gray-200"
                }`}>
                  <span className="mr-1.5 text-base" role="img" aria-label="India Flag">🇮🇳</span>
                  <span>+91</span>
                </div>
                <Input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  {...register("mobileNum")}
                  className={`${inputCls(!!errors.mobileNum)} rounded-l-none border-l-0`}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </div>
            </Field>

            {/* Email Address */}
            <Field label={<LabelWithAsterisk label="Email Address" isRequired />} error={errors.emailId?.message}>
              <Input
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                {...register("emailId")}
                className={inputCls(!!errors.emailId)}
              />
            </Field>

            {/* Password Field */}
            <Field label={<LabelWithAsterisk label="Password" isRequired />} error={errors.password?.message}>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  {...register("password")}
                  className={`${inputCls(!!errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Confirm Password Field */}
            <Field label={<LabelWithAsterisk label="Confirm Password" isRequired />} error={errors.confirm_password?.message}>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...register("confirm_password")}
                  className={`${inputCls(!!errors.confirm_password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Current Status / Position Field */}
            <Field
              label={<LabelWithAsterisk label="Current Status (Optional)" />}
              error={errors.currentStatus?.message}
            >
              <Controller
                name="currentStatus"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={`w-full rounded-xl border px-4 text-sm transition-all duration-200
                        focus:ring-3 focus:ring-gray-500/40 focus:bg-white
                        ${
                          errors.currentStatus
                            ? "border-red-400 bg-red-50/50 text-red-900"
                            : "border-gray-200 bg-gray-50/50 text-gray-700"
                        }`}
                    >
                      <SelectValue placeholder="Select your current status" />
                    </SelectTrigger>

                    <SelectContent className="rounded-2xl border border-gray-300 bg-white p-1.5 shadow-xl shadow-slate-200/60">
                      <SelectItem value="Student" className="rounded-xl px-3.5 py-2.5 text-sm cursor-pointer focus:bg-gray-200">
                        Student
                      </SelectItem>
                      <SelectItem value="Developer" className="rounded-xl px-3.5 py-2.5 text-sm cursor-pointer focus:bg-gray-200">
                        Developer
                      </SelectItem>
                      <SelectItem value="Working Professional" className="rounded-xl px-3.5 py-2.5 text-sm cursor-pointer focus:bg-gray-200">
                        Working Professional
                      </SelectItem>
                      <SelectItem value="Freelancer" className="rounded-xl px-3.5 py-2.5 text-sm cursor-pointer focus:bg-gray-200">
                        Freelancer
                      </SelectItem>
                      <SelectItem value="Other" className="rounded-xl px-3.5 py-2.5 text-sm cursor-pointer focus:bg-gray-200">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-11 w-full rounded-xl bg-[#2547CB] text-sm font-semibold text-white
                shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700
                active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering…
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link 
            to="/studentLogin"
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegistration;