import React, {lazy, Suspense} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import StaffLogin from '@/pages/Auth/StaffLogin';
import StudentLogin from '@/pages/Auth/StudentLogin';
import StudentOtp from '@/features/StudentOtp';
import StaffOtp from '@/features/StaffOtp';

const StaffDashBoard = lazy(() => import('@/pages/staffPages/StaffDashBoard'));
const StudentDashBoard = lazy(() => import('@/pages/studentPages/StudentDashBoard'));
const CourseMgtMain = lazy(() => import('../features/Course-Mgt/main'));
const AddCourse = lazy(() => import('@/features/Course-Mgt/AddCourse'));
const CourseStructureBuilder = lazy(() => import('@/features/courseBuilder/CourseStructureBuilder'));
const CourseDetails = lazy(() => import('../features/Course-Mgt/CourseDetail/CourseDetails'));

import AuthGuard from '../components/protectedRoutes/AuthGuard';

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

                    {/* STAFF Routes */}
                    <Route element={<AuthGuard allowedRole="STAFF" />}>
                        <Route path="/Staff-dashboard" element={<StaffDashBoard />} />
                        <Route path="courseMgt" element={<CourseMgtMain />} />
                        <Route path="/addCourse" element={<AddCourse />} />
                        <Route  path='/course-builder/:courseId' element={<CourseStructureBuilder />} />
                        <Route path="/courseDetails/:courseId" element={<CourseDetails />} />
                    </Route>

                    {/* STUDENT Routes */}
                    <Route element={<AuthGuard allowedRole="STUDENT" />}>
                        <Route path="/student-dashboard" element={<StudentDashBoard />} />
                    </Route>



                </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default AppRoute;