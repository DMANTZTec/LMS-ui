import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import LoginIcon from '@/assets/images/loginicon.png'
//import { staffApi } from '@/api/staff-controller.api';
import { authapi } from '@/api/auth-controller.api';

const StaffLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
const navigate= useNavigate();
const location = useLocation();

const from = location.state?.from?.pathname || "/mainPage"; // fallbaack
   
  const handleStaffLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: data.identifier, 
        password: data.password,
      };
      
      const res = await authapi.staffLogin(payload);

      console.log(`value of res is: ${res.data.message}`);

      // if(res.data.message?.includes("Login successfully Completed. OTP sent to your email.")) {
      //    localStorage.setItem('user', JSON.stringify(res.data));
      //   navigate("/verify-staff-otp");
      //   return; 
      // }
      const { token, staffId, email, role } = res.data;

if (token) {

  // Store JWT
  localStorage.setItem("token", token);

  // Store minimal OTP data
  sessionStorage.setItem(
    "otpStaff",
    JSON.stringify({
      staffId,
      email,
      role,
    })
  );

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
        <Link to="/forgot-password" className="hover:text-[#00BBA7] hover:underline transition-colors">
          Forgot Password?
        </Link>
      }
    />
  );
};

export default StaffLogin;