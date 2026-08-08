import React,{useState} from 'react';
import { CheckCircle, KeyRound, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {toast} from 'react-hot-toast';
import { staffApi } from '@/api/staff-controller.api';

const ResetStaffPwdModal = ({open, onOpenChange, staffData, onSuccess}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [submittedMsg, setSubmittedMsg] = useState(null);
    const [globalError, setGlobalError] = useState(null);

  const handleSendLink = async () => {
    setSubmittedMsg(null);
    setGlobalError(null);
    
const payload = {
  "getEmailIdOrMobileNo": staffData.email,
  "otpChannel": "EMAIL"
}

    setIsLoading(true);
    try {
    
        const result = await staffApi.forgotPassword1(payload);
    // toast.success("Link has been sent to your mail", { 
    //                 duration: 5000, 
    //                 className: '!bg-green-800 !text-white' 
    //             });
                setSubmittedMsg("Password Link has been sent to your mail");
      //onOpenChange(false);
    } catch (error) {
      if(error.response) {
        setGlobalError(error.response?.data);
      }else {
        if(error.request)
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
    }

return ( <>
    this is ResetStaffPwdModal.jsx
     <Dialog open={open} onOpenChange={handleClose}>
<DialogContent 
        // Removing default close icon (X) to match the clean design in image
        className="[&>button]:hidden sm:max-w-[480px] p-8 rounded-2xl bg-white border-none shadow-2xl"
      >
        {submittedMsg && (
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-red-200 text-sm text-green-600">
                            <CheckCircle className="text-green-600" size={24} />{submittedMsg}
                        </div>

                    )}
                    {globalError && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                            {globalError}
                        </div>
                    )}
        <DialogHeader className="flex flex-row items-start gap-4 space-y-0 text-left">
          {/* Key Icon Badge Container */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100/70 text-amber-600">
            <KeyRound className="h-6 w-6 stroke-[2.2]" />
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Reset Password
            </DialogTitle>
            <p className="text-sm font-medium text-slate-400">
              Staff ID: {staffData.staffId}
            </p>
          </div>
        </DialogHeader>

         {/* Modal Description / Content Body */}
        <DialogDescription className="text-base leading-relaxed text-slate-500 pt-3 pb-2 font-normal">
          A password reset link will be sent to this staff member's registered
          email address. They will be prompted to set a new password on next
          login.
        </DialogDescription>
        {/* Action Buttons */}
        <DialogFooter className="flex-row justify-end gap-3 pt-4 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-700 font-semibold text-sm transition-colors"
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            onClick={handleSendLink}
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm transition-colors"
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
</>
);
};

export default ResetStaffPwdModal;