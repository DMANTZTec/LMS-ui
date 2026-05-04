import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as tabs from './index';

import { Avatar, MCP } from '@/assets/images';


const Main = () => {

    const [activeTab, setActiveTab] = useState("Courses");

    return (
        <>
            <div className='min-h-screen bg-white'>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    {/* LEFT - Logo */}
                    <div className="flex items-center gap-2">
                        <img src={MCP} alt="logo" className="w-8 h-8 md:w-10 md:h-10" />
                    </div>

                    {/* CENTER - Title */}
                    <h1 className="text-sm md:text-xl font-semibold text-center flex-1">
                        LMS Administration
                    </h1>

                    {/* RIGHT - Profile */}
                    <div className="border rounded-full p-1 md:p-2">
                        <img src={Avatar} className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                </div>
                {/* Tabs */}
                <div className='flex overflow-x-auto whitespace-nowrap text-[10px] md:text-[14px] gap-1 md:gap-4 px-4 py-3 border-b text-sm justify-center'>
                    {["Courses", "Programs", "Classes", "Students", "Staff", "Reports", "Providers"].map((tab, i) => (
                        <span
                            key={i}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer  transition-all duration-200  ${activeTab === tab
                                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                                : "text-gray-500"
                                }`}
                        >
                            {tab}
                        </span>
                    ))}

                </div>

                {/* Content */}
                <div className="max-w-[330px] sm:max-w-[330px] md:max-w-[600px] lg:max-w-5xl xl:max-w-6xl mx-auto mt-6 bg-white rounded-xl">
                    {activeTab === 'Courses' && <tabs.CoursesTab />}
                    {activeTab === 'Programs' && <tabs.ProgramsTab />}
                    {activeTab === 'Classes' && <tabs.ClassesTab />}
                    {activeTab === 'Students' && <tabs.StudentsTab />}
                    {activeTab === 'Staff' && <tabs.StaffTab />}
                    {activeTab === 'Reports' && <tabs.ReportsTab />}
                    {activeTab === 'Providers' && <tabs.ProvidersTab />}
                </div>
            </div>
        </>
    );
}

export default Main;