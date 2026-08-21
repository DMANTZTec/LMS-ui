import React, { useState, useEffect } from "react";
import { RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { staffApi } from "@/api/staff-controller.api";

export default function StaffOtp() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();

  const savedUser = JSON.parse(sessionStorage.getItem("otpStaff") || "{}");

  const staffId = savedUser?.staffId;
  const email = savedUser?.email;

  // Countdown timer logic
  useEffect(() => {
    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

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
        emailIdOrMobileNo: email,
      };

      await staffApi.resendLoginOtp(payload); // Ensure this matches your staff API endpoint

      toast.success("OTP resent successfully! 🎉");
      setTimer(120);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to resend OTP";
      toast.error(errorMsg);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (value.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        emailIdOrMobileNo: email,
        otp: value,
        channel: "EMAIL"
      };

      const res = await staffApi.verifyStaffOtp(payload);
      toast.success(res.data.message || "Verified successfully! ✅");

      const { token } = res.data;
      if (token) {
        localStorage.setItem("LmsJwTtoken", token);
      }

      setTimeout(() => {
        navigate("/Staff-dashboard");
      }, 1000);
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Invalid OTP ❌";
      toast.error(errorMsg);
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
            {email || "your email"}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Field className="space-y-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Verification code</FieldLabel>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={handleResendOtp}
              disabled={resending || timer > 0}
            >
              <RefreshCwIcon
                className={`h-3 w-3 ${resending ? "animate-spin" : ""}`}
              />
              {resending
                ? "Sending..."
                : timer > 0
                ? `Resend in ${formatTime(timer)}`
                : "Resend"}
            </Button>
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