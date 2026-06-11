import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { studentApi} from "@/api/student-controller.api.js";
import { UserPlus, Loader2, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Our own Field wrapper — we own this, no external dependency
import Field from "@/components/common/Field";

// Jotai atoms — move these into authAtom.
import {
  studentDataAtom,
  student_registrationStatusAtom,
  student_registrationServerErrorAtom,
} from "@/store/atoms/authAtoms";


// ─── Shared input className ───────────────────────────────────────────────────
const inputCls = (hasError) =>
  `h-11 w-full rounded-xl border px-4 text-sm transition
   placeholder:text-gray-400 outline-none
   focus:ring-2 focus:ring-blue-500/20 focus:bg-white
   ${
     hasError
       ? "border-red-400 bg-red-50 focus:border-red-400"
       : "border-gray-200 bg-gray-50 focus:border-blue-400"
   }`;

// ─── Zod Schema ──────────────────────────────────────
const studentSchema = z.object({
  firstNm: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),

  lastNm: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters"),

  mobileNum: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\+?[\d\s\-().]{7,15}$/, "Enter a valid mobile number"),

  emailId: z
    .string()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

   password: z
   .string()
   .min(6, "password must be 6 charectors"),

   confirm_password: z
   .string()
   .min(1, "confirm_password  is required"),
  
  currentStatus: z
    .string()
    .max(200, "Status must be under 200 characters")
    .optional(),
}).refine((data) => data.password === data.confirm_password , {
  message: "password and confirm password do not match",
  path: ["confirm_password"],
});

// ─── Component ────────────────────────────────────────────────────────────────
const StudentRegistration = () => {
  const [, setStudentData] = useAtom(studentDataAtom);
  const [status, setStatus] = useAtom(student_registrationStatusAtom);
  const [serverError, setServerError] = useAtom(student_registrationServerErrorAtom);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
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

  // ── Submit handler — hits Spring Boot POST /api/students/register ──────────
  const onSubmit = async (data) => {
    // data reaches here ONLY if Zod validation passed — RHF guarantees this
    setStatus("submitting");
    setServerError(null);
let response = null;
    try {
      console.log("entered data is: ",data);
      response = await studentApi.register(data);
          if (response && response.data) {
        sessionStorage.setItem("stuRegData", JSON.stringify(response.data));
        setStudentData(response.data);
        setStatus("success");
               reset();
               navigate("/verify-student-reg-otp");
      }
     
     
      
    } catch(error) {
      
          setStatus("error");

   //---------------------------------------------- this code is if the backend sends just error in the form of string message.

   // 1. Get the error message from the backend response
    const message = error.response?.data || "Registration failed";

    // 2. Map specific messages to their fields
    if (message.toLowerCase().includes("email already exists")) {
      setError("emailId", {
        type: "manual",
        message: "This email is already registered",
      });
    } else if (message.toLowerCase().includes("mobile") || message.toLowerCase().includes("phone")) {
      setError("mobileNum", {
        type: "manual",
        message: "This mobile number is already in use",
      });
    } else {
      // Fallback for generic errors (like database down)
      setServerError(message);
    }

// ---------------------------------------- this code is recommended when the backend sends json object  
// // 1. Extract backend field-specific validation errors
//     const backendErrors = error.response?.data?.fieldErrors; 

//     if (backendErrors) {
//       // 2. Loop through each field returned by Spring Boot (e.g., 'emailId', 'mobileNum')
//       Object.keys(backendErrors).forEach((field) => {
//         setError(field, {
//           type: "server",
//           message: backendErrors[field],
//         });
//       });
//     } else {
//       // 3. Fallback: If it's a global error (e.g., database down, 500 server error)
//       const genericMessage = error.response?.data?.message || "Something went wrong. Please try again.";
//       setServerError(genericMessage);
//     }
// ----------------------------


      // setServerError(error); 
      // setStatus("error"); 
      
    } 
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* ── Icon + Title ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md shadow-blue-100 border border-blue-100">
            <UserPlus className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Student Registration
          </h1>
          
        </div>

        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-xl shadow-blue-100/30">

          {/* Server-level error banner (e.g. "Email already exists") */}
          {status === "error" && serverError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
               <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              {serverError}
            </div>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registration successful! Welcome aboard.
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* First Name
                register("firstName") returns: { name, ref, onChange, onBlur }
                Spread it onto Input — RHF tracks every keystroke silently    */}
            <Field label="First Name" error={errors.firstNm?.message}>
              <Input
                placeholder="Enter your first name"
                autoComplete="given-name"
                {...register("firstNm")}
                className={inputCls(!!errors.firstNm)}
              />
            </Field>

            {/* Last Name */}
            <Field label="Last Name" error={errors.lastNm?.message}>
              <Input
                placeholder="Enter your last name"
                autoComplete="family-name"
                {...register("lastNm")}
                className={inputCls(!!errors.lastNm)}
              />
            </Field>

            {/* Mobile Number */}
            <Field label="Mobile Number" error={errors.mobileNum?.message}>
              <Input
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                {...register("mobileNum")}
                className={inputCls(!!errors.mobileNum)}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" error={errors.emailId?.message}>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("emailId")}
                className={inputCls(!!errors.emailId)}
              />
            </Field>
            {/* Password */}
            <Field label="Password" error={errors.password?.message}>
              <Input
                type="password"
                placeholder="Abc@123"
                autoComplete="pwd"
                {...register("password")}
                className={inputCls(!!errors.password)}
              />
            </Field>
            {/* Confirm Password */}
            <Field label="Confirm Password" error={errors.confirm_password?.message}>
              <Input
                type="password"
                placeholder="Abc@123"
                autoComplete="confirm_pwd"
                {...register("confirm_password")}
                className={inputCls(!!errors.confirm_password)}
              />
            </Field>
            {/* Current Status — optional */}
            <Field
              label="Current Status"
              error={errors.currentStatus?.message}
              optional
            >
              <Textarea
                placeholder="e.g. Undergraduate student, Working professional…"
                rows={2}
                {...register("currentStatus")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm transition
                  placeholder:text-gray-400 outline-none resize-none
                  focus:ring-2 focus:ring-blue-500/20 focus:bg-white
                  ${
                    errors.currentStatus
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:border-blue-400"
                  }`}
              />
            </Field>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-xl bg-blue-700 text-sm font-semibold text-white
                shadow-md shadow-blue-300/40 transition hover:bg-blue-800
                active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  Register
                  
                </>
              )}
            </Button>
          </form>
        </div>

        {/* ── Sign in link ─────────────────────────────────────────────────── */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
            <Link to="/studentLogin"
             className="font-semibold text-blue-600 hover:text-blue-800 transition-colors underline-offset-2 hover:underline">
            Sign in
            </Link>
         </p>
      </div>
    </div>
  );
};

export default StudentRegistration;
