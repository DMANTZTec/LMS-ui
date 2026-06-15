import React from 'react';
import { Button } from '../../../components/ui/button';

const CtaSection = () => {
    return (
        <div className="bg-gradient-to-r from-[#0F766E] to-[#445AC8] px-4 py-8 md:py-10">
            <div className="max-w-[896px] mx-auto flex flex-col items-center text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Ready to Start Your Journey?
                </h2>
                <p className="text-white/90 text-base mt-3">
                    Join hundreds of students who have transformed their careers with us
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <Button className="h-12 px-6 bg-white hover:bg-white/90 text-[#0F766E] text-base font-semibold rounded-lg">
                        Enroll Now
                    </Button>
                    <Button className="h-12 px-6 bg-transparent hover:bg-white/10 border-2 border-white text-white text-base font-semibold rounded-lg">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CtaSection;
