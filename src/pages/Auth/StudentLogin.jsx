import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import LoginIcon from '@/assets/images/loginicon.png'
import { studentApi } from '@/api/student-controller.api';
//import { authapi } from '@/api/auth-controller.api';
 //import { studentApi } from '@/api/student-controller.api';
// claude code generated
import { saveOtpUser, getToken, getUserRole } from '@/utils/tokenUtility';

const StudentLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // If a valid JWT already exists, skip the login form and go straight to the role's dashboard
  // claude code generated
  // useEffect(() => {
  //   if (getToken()) {
  //     const role = getUserRole()?.toUpperCase();
  //     if (role === "STUDENT") navigate("/student-dashboard");
  //   }
  // }, []);

  const handleStudentLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: data.identifier, 
        password: data.password,
        otpChannel: "EMAIL"
      };
      
      const res = await studentApi.login(payload);

      
      // claude code generated
      // console.log(res)
      // if (res.data.message === "OTP sent to your registered email") {
      //    localStorage.setItem('user', JSON.stringify(res.data));
      //   navigate("/verify-Student-otp");
      //   return; 
      // }
     const { studentId, email, role } = res.data;

if (studentId) {

  // Store JWT
  //localStorage.setItem("token", token);

  // Store minimal OTP data
  // sessionStorage.setItem(
  //   "otpUser",
  //   JSON.stringify({
  //     studentId,
  //     email,
  //     role,
  //   })
  // );
  // claude code generated
  saveOtpUser({ studentId, email, role });

  navigate("/verify-Student-otp");
  return;
}
      
      
      alert(`${res.data.message} and your studentId: ${res.data.studentId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginForm
      title="Student Login"
      iconSrc={LoginIcon}
      onSubmit={handleStudentLogin}
      isSubmitting={isSubmitting}
      bottomLinks={
        <>
          <Link to="/student-register" className="hover:text-[#00BBA7] underline transition-colors">
            Register
          </Link>
          {" | "}
          <Link to="/stuFPwd" className="hover:text-[#00BBA7] underline transition-colors">
            Forgot Password?
          </Link>
        </>
      }
    />
  );
};

export default StudentLogin;
