import React from 'react';

const HeroBanner = () => {
    return (
        <div className="bg-gradient-to-r from-[#445AC8] to-[#0F766E] px-4 py-5 md:py-6">
            <div className="max-w-[1280px] mx-auto relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <span className="bg-white text-red-600 font-bold text-sm md:text-base px-3 py-1 rounded-[12px] sm:absolute sm:left-0">
                    OPEN 24x7
                </span>
                <p className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    Build Your Career with Expert Guidence
                </p>
            </div>
        </div>
    );
};

export default HeroBanner;
