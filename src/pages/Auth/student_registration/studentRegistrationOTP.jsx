import React, { useState, useEffect } from "react";
import { RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field,FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { studentApi } from '@/api/student-controller.api';
import { useAtom } from 'jotai';
import {studentDataAtom} from '@/store/atoms/authAtoms';
import { toast } from "react-hot-toast";

export default function StudentRegistrationOTP() {
   const [value, setValue] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

 const [studentData,setStudentData] = useAtom(studentDataAtom);
 console.log("student data in automs is: ",studentData);
 const savedUser = JSON.parse(
     sessionStorage.getItem("stuRegData") || "{}"
 );

useEffect(() => {
  if(!studentData && !sessionStorage.getItem("stuRegData"))
    navigate("/studentLogin");
  if(localStorage.getItem("LmsJwTtoken"))
    navigate("/student-dashboard")
},[]); 

 //const studentId = savedUser?.studentId || studentData?.studentId;
   const emailIdOrMobileNo = (savedUser?.emailId || studentData?.emailId) || (savedUser?.mobileNum || studentData?.mobileNum);


  const handleVerify = async () => {
  if (value.length !== 6) {
    toast.error("Please enter the 6-digit OTP");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      emailIdOrMobileNo,
      otp: value,
      channel: "EMAIL",
    };

    const res = await studentApi.verifyOtp(payload);

    const { token } = res.data;

    if (token) {
      localStorage.setItem("LmsJwTtoken", token);
    }

    sessionStorage.setItem("stuRegData", JSON.stringify(res.data));

    // Success Toast
    toast.success(
  <div>
    <p className="font-semibold">Verification Successful!</p>
    <p className="text-sm">
      Your account has been verified. Redirecting to Login...
    </p>
  </div>,
  {
    duration: 3000,
  }
);

setTimeout(() => {
  navigate("/studentLogin");
}, 3000);

  } catch (error) {
    toast.error(
      typeof error.response?.data === "string"
        ? error.response.data
        : "Invalid OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  //if (!studentId) return null;



  return (
    <Card className="mx-auto max-w-md shadow-lg mt-10">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the code sent to:{" "}
          <span className="font-medium text-black">
            {(JSON.parse(sessionStorage.getItem("stuRegData"))?.emailId|| studentData?.emailId) || "your email"}
          {/* {"your entered email"}  */}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Field className="space-y-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Verification code</FieldLabel>
            {/* <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCwIcon className="h-3 w-3" />
              Resend
            </Button> */}
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
               value={value}
              onChange={(val) => setValue(val)}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Field>
      </CardContent>

      <CardFooter>
        <Button
           onClick={handleVerify}
           disabled={loading || value.length < 6}
          className="w-full"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </CardFooter>
    </Card>
  );

}