import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { staffApi } from '@/api/staff-controller.api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedMsg(null);
    setErrorMsg(null);

    const payload = {
      emailIdOrMobileNo: email,
      otpChannel: "EMAIL"
    };

    setIsLoading(true);
    try {
      await staffApi.forgotPassword1(payload);
      setSubmittedMsg("A password reset link has been sent to your email address.");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response?.data?.message || error.response?.data || "Failed to request reset link.");
      } else if (error.request) {
        setErrorMsg("Network Error: Please check your internet connection.");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Reset your Password
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please enter the email address you'd like your password reset information sent to
          </p>
        </div>

        {/* Feedback Messages */}
        {submittedMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
            <CheckCircle className="shrink-0 text-emerald-600" size={18} />
            <span>{submittedMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 text-left">
            <label 
              htmlFor="email" 
              className="text-xs font-medium text-slate-600"
            >
              Enter email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@dmantz"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800 text-sm outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-1 rounded-lg bg-[#1B3B53] hover:bg-[#153044] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Requesting...</span>
              </>
            ) : (
              "Request reset link"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-1">
          <Link 
            to="/staffLogin" 
            className="text-sm font-medium text-[#205493] hover:underline transition-all"
          >
            Back To Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;