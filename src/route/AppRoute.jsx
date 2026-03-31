import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '../pages/main/MainPage';
import StudentLogin from '@/pages/StudentLogin';

const AppRoute = () => {

    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="mainPage" element={<MainPage />} />
            <Route path='/studentLogin' element={<StudentLogin/>}/>
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default AppRoute;