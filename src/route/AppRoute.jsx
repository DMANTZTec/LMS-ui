import React, {lazy, Suspense} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import StaffLogin from '@/pages/Auth/StaffLogin';
import StudentLogin from '@/pages/Auth/StudentLogin';
import StudentOtp from '@/features/StudentOtp';
import StaffOtp from '@/features/StaffOtp';
import StudentRegistration from '@/pages/Auth/student_registration/studentRegistration';
import StudentRegistrationOTP from '@/pages/Auth/student_registration/studentRegistrationOTP';
import StudentProfile from '@/features/Avatar/student/profile/StudentProfile';
import StudentForgotPwd from '@/pages/Auth/student_forgot_password/StuForgotPwd';
import StudentResetPwd from '@/pages/Auth/student_forgot_password/StuResetPwd';
import ContactUs from '@/pages/public/contactUs/contactUsMain';
import CreateStaffPwd from '@/features/Course-Mgt/addStaff/createStaffPwd';
import ResetStaffPwd from '@/features/Course-Mgt/addStaff/ResetStaffPwd';
import StaffProfile from '@/features/Avatar/staff/profile/StaffProfile'; 
const StaffDashBoard = lazy(() => import('@/pages/staffPages/StaffDashBoard'));

//const StudentDashBoard = lazy(() => import('@/pages/studentPages/StudentDashBoard'));
const CourseMgtMain = lazy(() => import('../features/Course-Mgt/main'));
const AddCourse = lazy(() => import('@/features/Course-Mgt/AddCourse'));
const CourseStructureBuilder = lazy(() => import('@/features/courseBuilder/CourseStructureBuilder'));
const InstructorDashBoard = lazy(() => import('@/pages/instructorPages/instructorDashBoard/InstructorDashBoard').then(m => ({ default: m.InstructorDashBoard })));
const CourseDetails = lazy(() => import('../features/Course-Mgt/CourseDetail/CourseDetails'));

import AuthGuard from '../components/protectedRoutes/AuthGuard';

import { StudentDashBoard } from '@/pages/studentPages/studentDashBoard/StudentDashBoard';
import ForgotPassword from '@/pages/Auth/StaffForgotPassword';
import ViewCourses from '@/pages/public/ViewCourses';

const AppRoute = () => {

    return (
        <>
            <BrowserRouter>
            <Suspense fallback={<div className='flex h-screen items-center justify-center'>Loading...</div>}>
                <Routes>
                    {/* public routes*/}
                    <Route path="/" element={<MainPage />} />
                    <Route path="mainPage" element={<MainPage />} />
                    <Route path='/studentLogin' element={<StudentLogin />} />
                    <Route path='/staffLogin' element={<StaffLogin />} />
                    <Route path="/verify-Student-otp" element={<StudentOtp />} />
                    <Route path="/verify-staff-otp" element={<StaffOtp />} />
                    <Route path="/student-register" element={<StudentRegistration />} />
                    <Route path="/verify-student-reg-otp" element={<StudentRegistrationOTP />}/>
                    <Route path="/contactUs" element={<ContactUs />} />
		            <Route path="/stuFPwd" element={<StudentForgotPwd />} />
                    <Route path="/stuResetPwd" element={<StudentResetPwd />} />
                    <Route path="/staff/set-password" element={<CreateStaffPwd />} />
                    <Route path="/reset-password" element={<ResetStaffPwd />} /> 
                    <Route path="/forgot-password" element={<ForgotPassword />} />   
                    <Route path="/view-courses" element={<ViewCourses/>} />
                    
                    {/* STAFF Routes */}
                    <Route element={<AuthGuard allowedRole="STAFF" />}>
                        <Route path="/Staff-dashboard" element={<StaffDashBoard />} />
                        
                        <Route path="/staffProfile" element={<StaffProfile />} />
                        <Route path="courseMgt" element={<CourseMgtMain />} />
                        <Route path="/addCourse" element={<AddCourse />} />
                        <Route  path='/course-builder/:courseId' element={<CourseStructureBuilder />} />
                        <Route path="/courseDetails/:courseId" element={<CourseDetails />} />
                    </Route>

                    {/* INSTRUCTOR Routes */}
                    <Route element={<AuthGuard allowedRole="INSTRUCTOR" />}>
                    <Route path="/Instructor-dashboard" element={<InstructorDashBoard />} />
                    </Route>

                    {/* STUDENT Routes */}
                    <Route element={<AuthGuard allowedRole="STUDENT" />}>
                        <Route path="/student-dashboard" element={<StudentDashBoard />} />
                        <Route path="/studentProfile" element={<StudentProfile /> } />    
                    </Route>



                </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default AppRoute;	