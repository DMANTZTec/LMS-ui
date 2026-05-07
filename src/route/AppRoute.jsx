import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import StudentLogin from '@/pages/StudentLogin';
import CourseMgtMain from '../features/Course-Mgt/main';
import StaffLogin from '@/pages/StaffLogin';
import AddCourse from '@/features/Course-Mgt/AddCourse';
import StudentOtp from '@/features/StudentOtp';
import StaffOtp from '@/features/StaffOtp';
import StudentDashBoard from '@/pages/studentPages/StudentDashBoard';
import StaffDashBoard from '@/pages/staffPages/StaffDashBoard';

const AppRoute = () => {

    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="mainPage" element={<MainPage />} />
            <Route path='/studentLogin' element={<StudentLogin/>}/>
             <Route path='/staffLogin' element={<StaffLogin/>}/>
            <Route path="courseMgt" element={<CourseMgtMain />} />
            <Route path="/addCourse" element={<AddCourse />} />
            <Route path="/verify-Student-otp" element={<StudentOtp />} />
            <Route path="/verify-staff-otp" element={<StaffOtp/>} />
            <Route path="/student-dashboard" element={<StudentDashBoard/>} />
            <Route path="/Staff-dashboard" element={<StaffDashBoard/>} />
            
            
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default AppRoute;