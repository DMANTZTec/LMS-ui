import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import LoginIcon from '../assets/images/loginicon.png'
import { staffApi } from '@/api/staff-controller.api';

const StaffLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStaffLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: data.identifier, 
        password: data.password,
      };
      
      const res = await staffApi.login(payload);
           
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