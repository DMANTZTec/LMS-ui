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
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 py-2">
            {courses.map((course) => (
                <div key={course.id} className="flex flex-col items-center gap-1 w-14 md:w-16 bg-white rounded-md p-1.5">
                    <img src={course.src} className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-md" />
                    <span className="text-[10px] md:text-xs font-bold text-[#445AC8] text-center">{course.name}</span>
                </div>
            ))}
        </div>
    );
};

export default CourseIcon;
