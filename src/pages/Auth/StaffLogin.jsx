import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import LoginIcon from '@/assets/images/loginicon.png'
import { staffApi } from '@/api/staff-controller.api';
//import { authapi } from '@/api/auth-controller.api';
// claude code generated
import { saveStaffId, saveOtpStaff, getToken, getUserRole } from '@/utils/tokenUtility';

const StaffLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
const navigate= useNavigate();
const location = useLocation();

const from = location.state?.from?.pathname || "/mainPage"; // fallbaack

  // If a valid JWT already exists, skip the login form and go straight to the role's dashboard
  // claude code generated
  // useEffect(() => {
  //   if (getToken()) {
  //     const role = getUserRole()?.toUpperCase();
  //     if (role === "INSTRUCTOR") navigate("/Instructor-dashboard");
  //     else if (role === "ADMIN" || role === "STAFF") navigate("/Staff-dashboard");
  //   }
  // }, []);

  const handleStaffLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: data.identifier, 
        password: data.password,
        otpChannel: "EMAIL"
      };
      
      const res = await staffApi.staffLogin(payload);

      // claude code generated
      // console.log(`value of res is: ${res.data.message}`);

      // if(res.data.message?.includes("Login successfully Completed. OTP sent to your email.")) {
      //    localStorage.setItem('user', JSON.stringify(res.data));
      //   navigate("/verify-staff-otp");
      //   return; 
      // }
      const { staffId, email, role } = res.data;

if (staffId) {
  // localStorage.setItem('staffId', JSON.stringify(staffId));
  // sessionStorage.setItem("otpStaff",JSON.stringify({staffId,email,role,}));
  // claude code generated
  saveStaffId(staffId);
  saveOtpStaff({ staffId, email, role });

  navigate("/verify-staff-otp");
  return;
}
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <LoginForm
      title="Staff Login"
      iconSrc={LoginIcon}
      onSubmit={handleStaffLogin}
      isSubmitting={isSubmitting}
      bottomLinks={
        <Link to="/forgot-password" className="hover:text-[#00BBA7] underline transition-colors">
          Forgot Password?
        </Link>
      }
    />
  );
};

export default StaffLogin;