import React from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import LearningPathSection from './components/LearningPathSection';
import TestimonialsSection from './components/TestimonialsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

const MainPage = () => {
    return (
        <>
            <Header />
            <HeroBanner />
            <LearningPathSection />
            <TestimonialsSection />
            <CtaSection />
            <Footer />
        </>
    );
}

export default MainPage
