import React, { useState } from "react";
import { CheckCircle, KeyRound, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { staffApi } from "@/api/staff-controller.api";

/**
 * Responsive copy of ../ResetStaffPwdModal.jsx for the new staff profile page.
 * Same props and same reset-link request; only the layout adapts to phone widths.
 */
const ResetStaffPwdModal = ({ open, onOpenChange, staffData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const handleSendLink = async () => {
    setSubmittedMsg(null);
    setGlobalError(null);

    const payload = {
      emailIdOrMobileNo: staffData?.email,
      otpChannel: "EMAIL",
    };

    setIsLoading(true);
    try {
      await staffApi.forgotPassword1(payload);
      setSubmittedMsg("Password Link has been sent to your mail");
    } catch (error) {
      if (error.response) {
        setGlobalError(error.response?.data);
      } else if (error.request) {
        setGlobalError("Network Error: No internet connection or server down.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (isOpen) => {
    setGlobalError(null);
    setSubmittedMsg(null);
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] gap-3 overflow-y-auto rounded-2xl border-none bg-white p-5 shadow-2xl sm:max-w-[480px] sm:gap-4 sm:p-8"
      >
        {submittedMsg && (
          <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-600 sm:items-center sm:p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 sm:mt-0 sm:h-6 sm:w-6" />
            <span className="min-w-0 break-words">{submittedMsg}</span>
          </div>
        )}
        {globalError && (
          <div className="break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 sm:p-4">
            {globalError}
          </div>
        )}

        <DialogHeader className="flex flex-row items-start gap-3 space-y-0 text-left sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100/70 text-amber-600 sm:h-12 sm:w-12">
            <KeyRound className="h-5 w-5 stroke-[2.2] sm:h-6 sm:w-6" />
          </div>

          <div className="flex min-w-0 flex-col gap-0.5">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Reset Password
            </DialogTitle>
            <p className="break-all text-sm font-medium text-slate-400">Staff ID: {staffData?.staffId}</p>
          </div>
        </DialogHeader>

        <DialogDescription className="pt-1 pb-1 text-sm font-normal leading-relaxed text-slate-500 sm:pt-3 sm:pb-2 sm:text-base">
          A password reset link will be sent to this staff member's registered email address. They will be prompted to
          set a new password on next login.
        </DialogDescription>

        {/* Buttons stack full-width on phones (primary on top) and sit side by side from the sm breakpoint */}
        <DialogFooter className="mx-0 mb-0 flex-col-reverse gap-2 rounded-none border-t-0 bg-transparent p-0 pt-2 sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-slate-100 px-6 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200/80 hover:text-slate-700 sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSendLink}
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-amber-500 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetStaffPwdModal;
