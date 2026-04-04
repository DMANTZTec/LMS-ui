import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as tabs from './index';

import { MCP } from '@/assets/images';


const Main = () => {

    const [activeTab, setActiveTab] = useState("Courses");

    return (
        <>
            <div className='min-h-screen bg-white'>
                {/* Header */}
                <div className="flex items-center gap-100 px-8 py-4 bg-white shadow">

                    <img src={MCP} className='w-10 h-10' />
                    <h1 className="text-xl font-semibold">LMS Administration</h1>
                </div>

                {/* Tabs */}
                <div className='flex justify-center bg-white gap-6 py-3 text-sm border-b'>
                    {["Courses", "Programs", "Classes", "Students", "Staff", "Reports", "Providers"].map((tab, i) => (
                        <span
                            key={i}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer  transition-all duration-200 ${activeTab === tab
                                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                                : "text-gray-500"
                                }`}
                        >
                            {tab}
                        </span>
                    ))}

                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl">
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