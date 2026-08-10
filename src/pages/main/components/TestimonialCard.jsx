import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, name, role, profileImg, initial }) => {
    const fallbackInitial = initial || (name ? name.charAt(0).toUpperCase() : '');

    return (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col h-full">
            {Quote && <Quote className="size-8 text-[#445AC8]" />}
            <p className="text-[#364153] text-base italic mt-4">{quote}</p>
            <div className="flex items-center gap-4 mt-6">
                {profileImg ? (
                    <img
                        src={profileImg}
                        alt={name}
                        className="rounded-full size-12 object-cover shrink-0"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="bg-[#0F766E] rounded-full size-12 flex items-center justify-center shrink-0">
                        <span className="text-white text-xl font-bold">{fallbackInitial}</span>
                    </div>
                )}
                <div>
                    <h4 className="text-[#101828] text-base font-bold">{name}</h4>
                    <p className="text-[#4A5565] text-sm">{role}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;