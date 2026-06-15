import React from 'react';
import * as icon from '../../assets/images';

const CourseIcon = () => {

    const courses = [
        { id: 1, name: 'Java', src: icon.JAVA },
        { id: 2, name: 'Spring Boot', src: icon.SPRINGBOOT },
        { id: 3, name: 'React JS', src: icon.REACT },
        { id: 4, name: 'Python', src: icon.PYTHON },
        { id: 5, name: 'AI', src: icon.AI },
        { id: 6, name: 'AWS', src: icon.AWS },
        { id: 7, name: 'Linux', src: icon.Linux },
        { id: 8, name: 'Node JS', src: icon.NODE },
        { id: 9, name: 'Mobile Apps', src: icon.MobileApps },
        { id: 10, name: 'Linux', src: icon.Linux },
        { id: 11, name: 'Angular', src: icon.Angular },
        { id: 12, name: 'IoT', src: icon.IoT }
    ];

    return (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4 py-4">
            {courses.map((course) => (
                <div key={course.id} className="flex flex-col items-center gap-1 w-16 md:w-20 bg-white rounded-md p-2">
                    <img src={course.src} className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-md" />
                    <span className="text-xs md:text-sm font-bold text-[#445AC8] text-center">{course.name}</span>
                </div>
            ))}
        </div>
    );
};

export default CourseIcon;
