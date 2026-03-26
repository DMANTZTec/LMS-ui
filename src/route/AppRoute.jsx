import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '../pages/main/MainPage';

const AppRoute = () => {

    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="mainPage" element={<MainPage />} />
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default AppRoute;