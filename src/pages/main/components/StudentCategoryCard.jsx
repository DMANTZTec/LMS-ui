import React from 'react';
import { Check } from 'lucide-react';

const StudentCategoryCard = ({ Icon, title, description, items }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#0F766E] rounded-full p-3 shrink-0">
                    {React.createElement(Icon, { className: 'size-8 text-white' })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#445AC8]">{title}</h3>
            </div>
            <p className="text-[#4A5565] text-base mb-4">{description}</p>
            <ul className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="size-4 text-[#0F766E] shrink-0 mt-1" />
                        <span className="text-[#364153] text-base">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentCategoryCard;
