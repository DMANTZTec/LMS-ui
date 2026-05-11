import React, { useState, useEffect } from "react";
import { RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field,FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { staffApi } from "@/api/staff-controller.api";



export default function StaffOtp() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const savedUser = JSON.parse(sessionStorage.getItem('otpStaff') || "{}");


  const staffId = savedUser?.staffId;
  const   email= savedUser?.email;



  const handleVerify = async () => {
    if (value.length !== 6) {
      alert("Enter 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const payload = {
      staffId: staffId,
      otp: value,
    };

      const res = await staffApi.verifyOtp1(payload);

      alert(res.data.message || "Verified ✅");

      navigate("/Staff-dashboard");

    } catch (error) {
      alert(typeof error.response?.data === 'string' ? error.response.data : "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };


  if (!staffId) return null;



  return (
    <Card className="mx-auto max-w-md shadow-lg mt-10">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the code sent to your mail:{" "}
          <span className="font-medium text-black">
            { email || " "}
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