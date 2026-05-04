import React from 'react';
import * as icon from '../../assets/images';

const CourseIcon = () => {
        
       const courses = [ 
    { id: 1, name: 'Java', src: icon.JAVA},
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
        <>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 px-4 py-4">          
            {courses.map((icon,index) => (
               <div key={icon.id} className="flex flex-col items-center w-20">
               <img src={icon.src}  className="text-xs md:text-sm text-blue-700 text-center mt-1"/>
               <span className="text-xs text-medium text-blue-700">{icon.name}</span>
               </div> 
            ))}

            </div>
        </>
    );
};

export default CourseIcon;