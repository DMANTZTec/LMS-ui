import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '../pages/main/MainPage';
import StudentLogin from '@/pages/StudentLogin';
import CourseMgtMain from '../features/Course-Mgt/main';

const AppRoute = () => {

    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="mainPage" element={<MainPage />} />
            <Route path='/studentLogin' element={<StudentLogin/>}/>
            <Route path="courseMgt" element={<CourseMgtMain />} />
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default AppRoute;