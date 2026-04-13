import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';


const loginSchema = z.object({
  identifier: z.string()
    .min(1, "User ID / Mobile Number is required")
    .min(5, "Identifier must be at least 5 characters"),
  password: z.string()
    .min(1, "Password is required")
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must not exceed 20 characters"),
});

const LoginForm = ({ title, iconSrc, onSubmit, isSubmitting, bottomLinks }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit,reset,formState: { errors, isValid },} = useForm({ resolver: zodResolver(loginSchema),mode: "onChange",});

   const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset(); // clear form after submit
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="w-[320px] sm:w-[360px] md:w-[380px] lg:w-[400px] h-auto rounded-[10px] sm:rounded-[12px] lg:rounded-[14px] border-[2px] lg:border-[2.67px] border-[#00BBA7] p-[20px] sm:p-[28px] md:p-[30px] lg:p-[34.67px] flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 bg-white shadow-sm">
        
        {/* Profile Icon */}
        <img
          src={iconSrc}
          alt={`${title} Profile`}
          className="w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] lg:w-[64px] lg:h-[64px] rounded-full object-cover"
        />

        {/* Title */}
        <h2 className="text-black text-base sm:text-lg font-semibold">
          {title}
        </h2>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full flex flex-col items-center"
        >
          {/* User ID / Mobile Number */}
          <div className="w-full lg:w-[330.67px] flex flex-col gap-1 mb-2">
            <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
              User ID / Mobile Number
            </label>
            <input
              {...register('identifier')}
              type="text"
              id="identifier"
              placeholder="Enter your User ID or Mobile Number"
              className="w-full h-[38px] sm:h-[40px] rounded-[8px] bg-gray-100 px-3 outline-none focus:ring-2 focus:ring-[#00BBA7]/50 focus:bg-white transition-all border border-transparent focus:border-[#00BBA7]"
            />
            <p className="text-red-500 text-xs h-[16px] mt-1">
              {errors.identifier?.message}
            </p>
          </div>

          {/* Password Input */}
          <div className="w-full lg:w-[330.67px] flex flex-col gap-1 mb-4">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                id="password"
                placeholder="Enter your password"
                className="w-full h-[38px] sm:h-[40px] rounded-[8px] bg-gray-100 px-3 pr-10 outline-none focus:ring-2 focus:ring-[#00BBA7]/50 focus:bg-white transition-all border border-transparent focus:border-[#00BBA7]"
              />
              <button
                type="button" // Prevents form submission when toggling password
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-red-500 text-xs h-[16px] mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full lg:w-[330.67px] h-[36px] rounded-[8px] text-white font-medium transition-all duration-200 mt-2
              ${!isValid || isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#030213] hover:bg-gray-800 active:scale-[0.98]"
              }
            `}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-gray-500 text-sm text-center mt-2">
          {bottomLinks}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;