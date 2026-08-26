import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  MapPin,
  ShieldCheck,
  KeyRound,
  Edit3,
  AlertCircle,
  Clock,
  UserCheck,
  Camera,
  Loader2,
  RotateCcw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ResetStaffPwdModal from './ResetStaffPwdModal';
import { StaffProfileSchema } from "./StaffProfileSchema";
import Field from "@/components/common/Field";

import { staffApi } from "@/api/staff-controller.api";



export default function StaffProfileScreen() {


  const [activeTab, setActiveTab] = useState("personal");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const [staffData, setStaffData] = useState({});
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [selectedStaffResetData, setSelectedStaffResetData] = useState(null);
  const [isResetStaffPwdModal, setIsResetStaffPwdModal] = useState(false);

  const profileImageRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(StaffProfileSchema),
  });


  // Fetch registered user details from backend on component mount
  useEffect(() => {
    const fetchAddNewStaffData = async () => {
      setIsLoading(true);
      try {
        const otpData = sessionStorage.getItem("otpStaff");
        let staffId = null;

        if (otpData) {
          staffId = JSON.parse(otpData).staffId;
        }

        if (!staffId) {
          console.error("No staff ID found in session storage.");
          setIsLoading(false);
          return;
        }

        // Call Backend API to fetch registration details
        const response = await staffApi.getStaffById(staffId);
        const apiData = response?.data;
        setStaffData(apiData);



        if (apiData) {
          // 1. Save original initial data to a state variable for future reference
          setInitialValues(apiData);

          // 2. Populate form fields dynamically with the backend registration data
          reset(apiData);

          // 3. Set image preview if present in API payload
          if (apiData.profileImg) {
            setPreviewProfilePicture(apiData.profileImage);
          }
        }
      } catch (error) {
        console.error("Failed to load user profile data from backend API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddNewStaffData();
  }, [reset]);






  const tabErrors = {
    personal: !!(errors.firstNm || errors.lastNm || errors.email || errors.mobileNum || errors.gender || errors.dob),
    employment: !!(errors.staffId || errors.designation || errors.dateOfJoining|| errors.roles || errors.addr1 || errors.addr2 || errors.city || errors.state || errors.country || errors.pin),
    emergency: !!(errors.emergencyContactNm || errors.emergencyContactNum),
  };

  // Called when validation fails on submit
  const onError = (formErrors) => {
    console.log("formErrors is: ", formErrors);
    // Auto-switch to the first tab containing an error
    if (errors.firstName || errors.lastName || errors.email) {
      setActiveTab("personal");
    } else if (errors.department || errors.joiningDate) {
      setActiveTab("employment");
    } else if (errors.roles) {
      setActiveTab("roles");
    }
  };

  const totalErrorCount = Object.keys(errors).length;

  const saveProfile = async (data) => {
    console.log("entered into saveProfile function. and data is: ", data);
    const payload = {

      "firstName": data.firstNm,
      "lastName": data.lastNm,
      "emailId": data.email,
      "mobileNumber": data.mobileNum,
      "gender": data.gender,
      "dateOfBirth": data.dob,                              // this field is not their in swagger response
      "designation": data.designation,
      "dateOfJoining": data.dateOfJoining,
      "roles": data.roles,
      "addressOne": data.addr1,
      "addressTwo": data.addr2,
      "city": data.city,
      "state": data.state,
      "country": data.country,
      "pincode": data.pin,
      "emergencyContactName": data.emergencyContactNm,
      "emergencyContactNumber": data.emergencyContactNum
    }
    const resultOne = await staffApi.updateStaff(data.staffId, payload);
    const updatedStaffData = resultOne.data;
    console.log("updatedStaffData is: ", updatedStaffData);

    console.log("data.profileImg is: ", data.profileImg);
    console.log("data.profileImg instanceof File is: ", data.profileImg instanceof File);
    console.log("imageRemoved is: ", imageRemoved);
    console.log("typeof data.profileImg is: ", typeof data.profileImg);

    if (data.profileImg instanceof File) {
      console.log("entered into if block and data.profileImg instanceof File is: ", data.profileImg instanceof File);
      const resultTwo = await staffApi.updateProfileImage1(data.staffId, data.profileImg);
    }
    else if (initialValues.profileImg === null && data.profileImg === null && imageRemoved === true) {
      console.log("entered into else if block and (typeof initialValue.profileImg === 'string' && data.profileImg == null && imageRemoved === true) is: ", (typeof initialValues.profileImg === "string" && data.profileImg === null && imageRemoved === true));
    }
    else if (data.profileImg === null && imageRemoved === true) {
      console.log("entered into else if block.");
      console.log("data.profileImg and (data.profileImg ===null && imageRemoved ===true) are: ", data.profileImg, data.profileImg === null && imageRemoved === true);
      await staffApi.deleteProfileImage1(data.staffId);
    }
    else if ((data.profileImg === null && imageRemoved === false) || typeof data.profileImg === "string") {
      console.log("entered into else if block and (data.profileImg === null && imageRemoved === false) || typeof data.profileImg === 'string' is: ", (data.profileImg === null && imageRemoved === false) || typeof data.profileImg === "string");

    } else {
      console.log("entered into else block: ");
    }

    setIsDisabled(true);

  }

  const openFilePicker = () => {
    profileImageRef.current.click();
  }

  const uploadPicture = (e) => {
    //profileImageRef.current.click();
    const file = e.target?.files[0];
    if (file) {
      if (previewProfilePicture)
        URL.revokeObjectURL(previewProfilePicture);
      const url = URL.createObjectURL(file);
      setPreviewProfilePicture(url);
      setImageRemoved(false);
      setValue("profileImg", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }

  }

  const removePhoto = () => {
    console.log("entered into remoePhoto function.");
    if (previewProfilePicture)
      URL.revokeObjectURL(previewProfilePicture);
    setPreviewProfilePicture(null);
    setImageRemoved(true);
    setValue("profileImg", null, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    if (profileImageRef.current)
      profileImageRef.current.value = "";
  }

  const resetPwdModal = (data) => {
    console.log("entered into resetPwdModal function and data is: ", data);


    setIsResetStaffPwdModal(true);
    console.log("isResetStaffPwdModal value is: ", isResetStaffPwdModal);

  }


  return (
    
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      
<Link to="/Staff-dashboard" className="flex items-center text-blue-500 hover:text-blue-700" >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

      <form onSubmit={handleSubmit(saveProfile, onError)} noValidate>
        {/* 1. HERO HEADER CARD */}
        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800" />
          <CardContent className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">

              {/* Avatar & Basic Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
                <div className="relative w-28 h-28 rounded-full border-2 border-slate-100">
                  {previewProfilePicture ? (
                    <img
                      src={previewProfilePicture}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    />
                  ) : !imageRemoved && initialValues?.profileImg ? (
                    <img
                      src={initialValues.profileImg}
                      className="w-28 h-28 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    />
                  ) : (
                    <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-gray-300" />
                  )}

                  {errors.profileImg?.message && <p className="text-xs font-medium text-red-500">{errors.profileImg?.message}</p>}
                  {(!errors.profileImg?.message && !imageRemoved) && <p className="text-sm cursor-pointer text-blue underline" onClick={() => removePhoto()}>Remove Photo</p>}
                  {/* <img
                    src={staffData.profileImage}
                    alt={`${staffData.firstName} ${staffData.lastName}`}
                    // className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    className="w-28 h-28 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                  /> */}
                  <input type="file" className="hidden" {...register("profileImg")} ref={profileImageRef} onChange={(e) => uploadPicture(e)} />
                  <button
                    type="button"
                    aria-label="Upload photo"
                    className="absolute bottom-1 right-1 p-1.5 bg-white rounded-full border border-slate-200 shadow-md hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-600" onClick={() => openFilePicker()} />
                  </button>
                </div>
                <div className="space-y-1 mb-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {staffData.firstNm} {staffData.lastNm}
                    </h1>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                      {staffData.status}
                    </Badge>
                    {staffData.enabled == 'Y' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        Account Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {staffData.designation} • <span className="text-slate-700 font-semibold">{staffData.staffId}</span>
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 gap-2" onClick={() => resetPwdModal(true)}>
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  Reset Password
                </Button>
                <Button type="button" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm" onClick={() => setIsDisabled(false)}>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. TABBED CONTENT & AUDIT SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Details (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">

            {/* <form onSubmit={handleSubmit(saveProfile, onError)} noValidate> */}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-200/60 p-1 rounded-xl w-full justify-start gap-1">
                <TabsTrigger value="personal" className="rounded-lg text-sm font-medium">
                  Personal Info
                  {tabErrors.personal && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="employment" className="rounded-lg text-sm font-medium">
                  Employment & Address
                  {tabErrors.employment && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="emergency" className="rounded-lg text-sm font-medium">
                  Emergency Contact
                  {tabErrors.emergency && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Personal Details */}
              <TabsContent value="personal" className="mt-4">
                <Card className="border-slate-200 rounded-2xl shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
                      <User className="w-4 h-4 text-blue-600" /> Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={"FirstName"} error={errors.firstNm?.message}>
                      <Input {...register("firstNm")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <Field label={"LastName"} error={errors.lastNm?.message}>
                      <Input {...register("lastNm")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <div className="relative flex">
                      <Mail className="absolute left-3 top-10 w-4 h-4 text-slate-400 shrink-0" />

                      <Field label={"Email"} error={errors.email?.message}>
                        <Input {...register("email")} className="w-full h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 pl-9" disabled={true} />
                      </Field>
                    </div>


                    <div className="relative flex">
                      <Phone className="absolute left-3 top-10 w-4 h-4 text-slate-400 shrink-0" />

                      <Field label={"Mobile Number"} error={errors.mobileNum?.message}>
                        <Input {...register("mobileNum")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 pl-8" disabled={isDisabled} />
                      </Field>
                    </div>
                    {/* <Field label={"Gender"} error={errors.gender?.message}>
                      <Input {...register("gender")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field> */}

<Field label="Gender" error={errors.gender?.message}>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value || ""} disabled={isDisabled}>
                                                <SelectTrigger className={`w-full h-10 text-sm font-medium text-slate-800  p-2.5 rounded-lg border border-slate-100 ${isDisabled === true ? "bg-slate-100": "bg-slate-50/80"}`}>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg">
                                                    <SelectItem value="MALE">Male</SelectItem>
                                                    <SelectItem value="FEMALE">Female</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>

                    <div className="relative flex">
                      <Calendar className="absolute left-3 top-10 w-4 h-4 text-slate-400 shrink-0" />

                      <Field label={"Date of Birth"} error={errors.dob?.message}>
                        <Input type="date" {...register("dob")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 pl-8" disabled={isDisabled} />
                      </Field>
                    </div>
                    {/* <ReadOnlyField label="First Name" value={staffData.firstName} />
                    <ReadOnlyField label="Last Name" value={staffData.lastNax`me} />
                    <ReadOnlyField label="Email Address" value={staffData.emailId} icon={Mail} />
                    <ReadOnlyField label="Mobile Number" value={staffData.mobileNumber} icon={Phone} />
                    <ReadOnlyField label="Gender" value={staffData.gender} />
                    <ReadOnlyField label="Date of Birth" value={staffData.dateOfBirth} icon={Calendar} /> */}
                  </CardContent>
                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={() => setActiveTab("employment")}>
                      Next: Employment & Address →
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* TAB 2: Employment & Address */}
              <TabsContent value="employment" className="mt-4 space-y-4">
                <Card className="border-slate-200 rounded-2xl shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
                      <Building className="w-4 h-4 text-blue-600" /> Academic & Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <Field label={"staffId"} error={errors.staffId?.message}>
                      <Input {...register("staffId")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={true} />
                    </Field>
                    <Field label={"designation"} error={errors.designation?.message}>
                      <Input {...register("designation")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <div className="relative flex">
                      <Calendar className="absolute left-3 top-10 w-4 h-4 text-slate-400 shrink-0" />

                      <Field label={"dateOfJoining"} error={errors.dateOfJoining?.message}>
                        <Input type="date" {...register("dateOfJoining")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 pl-8" disabled={true} />
                      </Field>
                    </div>
                    {/* <ReadOnlyField label="Staff ID" value={staffData.staffId} />
                    <ReadOnlyField label="Designation" value={staffData.designation} />
                    <ReadOnlyField label="Date of Joining" value={staffData.dateOfJoining} icon={Calendar} /> */}
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Assigned Roles
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(staffData.roles ?? []).map((role, i) => (
                          <Badge key={i} className="bg-slate-100 text-slate-800 border-slate-200 rounded-md hover:bg-slate-100">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 rounded-2xl shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
                      <MapPin className="w-4 h-4 text-blue-600" /> Address Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <Field label={"AddressOne"} error={errors.addr1?.message}>
                      <Input {...register("addr1")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <Field label={"AddressTwo"} error={errors.addr2?.message}>
                      <Input {...register("addr2")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <Field label={"City"} error={errors.city?.message}>
                      <Input {...register("city")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <Field label={"State"} error={errors.state?.message}>
                      <Input {...register("state")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>

<Field label="State *" error={errors.state?.message}>

                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isDisabled} 
                        >
                          <SelectTrigger className={`w-full h-10 text-sm font-medium text-slate-800  p-2.5 rounded-lg border border-slate-100 ${ isDisabled === true ? "bg-slate-100" : "bg-slate-50/80"}`}>
                            <SelectValue placeholder="Select State" /> 
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="Telangana">Telangana</SelectItem>
                            <SelectItem value="AndhraPradesh">AndhraPradesh</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="TamilNadu">TamilNadu</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          </SelectContent>

                        </Select>

                      </>
                    )}
                  />

                </Field>

                    <Field label={"country"} error={errors.country?.message}>
                      <Input {...register("country")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <Field label={"pinCode"} error={errors.pin?.message}>
                      <Input {...register("pin")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>


                    {/* <ReadOnlyField label="Address Line 1" value={staffData.addressOne} />
                    <ReadOnlyField label="Address Line 2" value={staffData.addressTwo || "—"} />
                    <ReadOnlyField label="City" value={staffData.city} />
                    <ReadOnlyField label="State" value={staffData.state} />
                    <ReadOnlyField label="Country" value={staffData.country} />
                    <ReadOnlyField label="Pincode" value={staffData.pinCode} /> */}
                  </CardContent>

                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={() => setActiveTab("emergency")}>
                      Next: Emergency Contact →
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* TAB 3: Emergency Contact */}
              <TabsContent value="emergency" className="mt-4">
                <Card className="border-slate-200 rounded-2xl shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <Field label={"emergencyContactPersonName"} error={errors.emergencyContactNm?.message}>
                      <Input {...register("emergencyContactNm")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100" disabled={isDisabled} />
                    </Field>
                    <div className="relative flex">
                      <Phone className="absolute left-3 top-10 w-4 h-4 text-slate-400 shrink-0" />

                      <Field label={"emergencyContactNumber"} error={errors.emergencyContactNum?.message}>
                        <Input {...register("emergencyContactNum")} className="h-10 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 pl-8" disabled={isDisabled} />
                      </Field>
                    </div>
                    {/* <ReadOnlyField label="Contact Person Name" value={staffData.emergencyContactName} />
                    <ReadOnlyField label="Emergency Contact Number" value={staffData.emergencyContactNumber} icon={Phone} /> */}


                  </CardContent>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-blue-600">
                      Save Profile
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            {/* </form> */}

          </div>

          {/* Audit / System Metadata Sidebar (Right 1 Column) */}
          <div className="space-y-6">
            <Card className="border-slate-200 rounded-2xl shadow-sm bg-slate-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-slate-500" /> System Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  {/* <UserCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> */}
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    {/* <p className="font-medium text-slate-500">Created By</p>
                    <p className="text-slate-800 font-semibold">{staffData.createdBy}</p> */}
                    <p className="font-medium text-slate-500">Created Date</p>
                    <p className="text-slate-400 text-[11px]">{staffData.createdDt}</p>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    {/* <p className="font-medium text-slate-500">Last Modified By</p>
                    <p className="text-slate-800 font-semibold">{staffData.updatedBy}</p> */}
                    <p className="font-medium text-slate-500">Last Modified Date</p>
                    <p className="text-slate-400 text-[11px]">{staffData.updatedDt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </form>
      {isResetStaffPwdModal &&
        <ResetStaffPwdModal
          open={isResetStaffPwdModal}
          onOpenChange={setIsResetStaffPwdModal}
          staffData={staffData}
        />}

    </div>
  );
}

// Reusable Field Display Component
function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <span className="truncate">{value || "—"}</span>
      </div>
    </div>
  );
}
