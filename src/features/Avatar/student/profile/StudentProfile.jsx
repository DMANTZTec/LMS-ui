import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { User, MapPin, ShieldAlert, Upload, Loader2, ArrowLeft, ChevronLeft } from 'lucide-react';

import { StudentProfileSchema } from './StudentProfileSchema';
import { studentApi } from '@/api/student-controller.api';
import { studentDataAtom } from '@/store/atoms/authAtoms';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Field from '@/components/common/Field';

// Shared baseline styled wrapper class matching your system UI specs
const inputCls = (hasError) =>
  `h-11 w-full rounded-xl border px-4 text-sm transition outline-none
   placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
   ${hasError ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 bg-gray-50 focus:border-blue-400"}`;

const selectCls = (hasError) =>
  `h-11 w-full rounded-xl border px-4 text-sm transition outline-none bg-gray-50
   focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-gray-700
   ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

const StudentProfile = () => {
const [studentData, setStudentData] = useAtom(studentDataAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // Grab cached registration attributes cleanly out of session data fallback
  const cachedRegData = JSON.parse(sessionStorage.getItem("stuRegData") || "{}");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      firstNm: studentData?.firstNm || cachedRegData.firstNm || "",
      lastNm: studentData?.lastNm || cachedRegData.lastNm || "",
      gender: "",
      dateOfBirth: "",
      currentStatus: studentData?.currentStatus || cachedRegData.currentStatus || "",
      emailId: studentData?.emailId || cachedRegData.emailId || "",
      mobileNum: studentData?.mobileNum || cachedRegData.mobileNum || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      password: "",
      confirm_password: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGlobalError(null);
console.log("data is: ", data);
    try {
      // API invocation against Spring Boot backend controller endpoint
      const response = await studentApi.updateProfile(
  cachedRegData.studentId,
  data.firstNm,
  data.lastNm,
  data.gender,
  data.dateOfBirth,
  data.addressLine1,
  data.addressLine2,
  data.city,
  data.state,
  data.country,
  data.pinCode,
  data.mobileNum,
  data.emergencyContactName,
  data.emergencyContactNumber,
  data.profilePicture?.[0]);
      console.log("value of updated profile data is: ", data);
      setStudentData(response.data);
      alert("Profile saved successfully! 🎉");
    } catch (error) {
      console.log("entered into catch block and error is: ",error);
          console.log("data.firstNm is: ", data.firstNm);
      const backendErrors = error.response?.data?.fieldErrors;
      if (backendErrors) {
        // Dynamic error assignment routine discussed earlier
        Object.keys(backendErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: backendErrors[field],
          });
        });
      } else {
        setGlobalError(error.response?.data?.message || "Internal system upgrade failure.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] py-12 px-4 sm:px-6 lg:px-8">

<Link to="/student-dashboard">
<ChevronLeft className='text-blue-500'/>
</Link>

      <div className="max-w-4xl mx-auto space-y-6">
        
        <h1 className="text-2xl font-bold text-center text-slate-800 tracking-tight">Student Profile</h1>

        {globalError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          
          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 1: Personal Information                               */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">1</span>
              <User className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="First Name *" error={errors.firstNm?.message}>
                <Input {...register("firstNm")} className={inputCls(!!errors.firstNm)} placeholder="Enter first name" />
              </Field>

              <Field label="Last Name *" error={errors.lastNm?.message}>
                <Input {...register("lastNm")} className={inputCls(!!errors.lastNm)} placeholder="Enter last name" />
              </Field>

              <Field label="Gender *" error={errors.gender?.message}>
                <select {...register("gender")} className={selectCls(!!errors.gender)}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Date of Birth *" error={errors.dateOfBirth?.message}>
                <Input type="date" {...register("dateOfBirth")} className={inputCls(!!errors.dateOfBirth)} />
              </Field>

              <Field label="Current Status (Optional)" error={errors.currentStatus?.message}>
                <Input {...register("currentStatus")} className={inputCls(!!errors.currentStatus)} placeholder="Enter current status" />
              </Field>

              {/* Profile Image Row Block Layout matching reference mockup */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Profile Picture (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex h-11 items-center justify-center gap-2 px-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition text-sm font-medium text-slate-700">
                    <Upload className="h-4 w-4 text-slate-500" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" {...register("profilePicture")} />
                  </label>
                  <div className="h-16 w-16 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 2: Contact & Address                                   */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">2</span>
              <MapPin className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">Contact & Address</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Email Address *" error={errors.emailId?.message}>
                  <Input {...register("emailId")} disabled className={`${inputCls(!!errors.emailId)} opacity-60 cursor-not-allowed`} />
                </Field>

                <Field label="Mobile Number *" error={errors.mobileNum?.message}>
                  <Input {...register("mobileNum")} disabled className={inputCls(!!errors.mobileNum)} placeholder="(123) 456-7890" />
                </Field>
              </div>

              <Field label="Address Line 1 *" error={errors.addressLine1?.message}>
                <Input {...register("addressLine1")} className={inputCls(!!errors.addressLine1)} placeholder="Street address, apartment, suite, etc." />
              </Field>

              <Field label="Address Line 2" error={errors.addressLine2?.message}>
                <Input {...register("addressLine2")} className={inputCls(!!errors.addressLine2)} placeholder="Additional address information (optional)" />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field label="City *" error={errors.city?.message}>
                  <Input {...register("city")} className={inputCls(!!errors.city)} placeholder="City" />
                </Field>

                <Field label="State *" error={errors.state?.message}>
                  <Input {...register("state")} className={inputCls(!!errors.state)} placeholder="State" />
                </Field>

                <Field label="Pin / Zip Code *" error={errors.pinCode?.message}>
                  <Input {...register("pinCode")} className={inputCls(!!errors.pinCode)} placeholder="12345" />
                </Field>
              </div>

              <Field label="Country *" error={errors.country?.message}>
                <Input {...register("country")} className={inputCls(!!errors.country)} placeholder="Country" />
              </Field>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 3: Security & Emergency Contact                         */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">3</span>
              <ShieldAlert className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">Security & Emergency Contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Password *" error={errors.password?.message}>
                <Input type="password" {...register("password")} className={inputCls(!!errors.password)} placeholder="Enter password" />
              </Field>

              <Field label="Confirm Password *" error={errors.confirm_password?.message}>
                <Input type="password" {...register("confirm_password")} className={inputCls(!!errors.confirm_password)} placeholder="Re-enter password" />
              </Field>

              <Field label="Emergency Contact Name *" error={errors.emergencyContactName?.message}>
                <Input {...register("emergencyContactName")} className={inputCls(!!errors.emergencyContactName)} placeholder="Full name" />
              </Field>

              <Field label="Emergency Contact Number *" error={errors.emergencyContactNumber?.message}>
                <Input {...register("emergencyContactNumber")} className={inputCls(!!errors.emergencyContactNumber)} placeholder="(123) 456-7890" />
              </Field>
            </div>
          </div>

          {/* Submit Action Execution Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#1d4ed8] text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;