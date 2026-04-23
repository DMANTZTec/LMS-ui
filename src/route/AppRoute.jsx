import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '../pages/main/MainPage';
import StudentLogin from '@/pages/StudentLogin';
import CourseMgtMain from '../features/Course-Mgt/main';
import StaffLogin from '@/pages/StaffLogin';
import AddCourse from '@/features/Course-Mgt/AddCourse';

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
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default AppRoute;