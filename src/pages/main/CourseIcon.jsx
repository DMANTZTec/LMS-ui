import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import * as icon from '../../assets/images';
import { api } from '@/api/CourseMgtController';

const CourseIcon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses,setcourses]=useState([]);
  const activeFilter = searchParams.get('subject');
  const [loading, setLoading] = useState(true);

  // useEffect(()=>{
  // setcourses([
  //   { id: 1, name: 'Java', src: icon.JAVA },
  //   { id: 2, name: 'Spring Boot', src: icon.SPRINGBOOT },
  //   { id: 3, name: 'React JS', src: icon.REACT },
  //   { id: 4, name: 'Python', src: icon.PYTHON },
  //   { id: 5, name: 'AI', src: icon.AI },
  //   { id: 6, name: 'AWS', src: icon.AWS },
  //   { id: 7, name: 'Linux', src: icon.Linux },
  //   { id: 8, name: 'Node JS', src: icon.NODE },
  //   { id: 9, name: 'Mobile Apps', src: icon.MobileApps },
  //   { id: 10, name: 'Angular', src: icon.Angular },
  //   { id: 11, name: 'IoT', src: icon.IoT }
  // ])},[])

useEffect(()=>{
  const fetchsubjects= async()=>{
    try{
      const response = await api.viewAllSubjects();
      setcourses(response.data);
    }
   catch(error){
      console.error("Failed to load subjects", error);
   }
   finally{
    setLoading(false);
   }
  }
  fetchsubjects();

},[])






  const handleIconClick = (subjectName) => {
    // If clicking the currently selected subject, clear the filter; otherwise apply it
    if (activeFilter?.toLowerCase() === subjectName?.toLowerCase()) {
      navigate('/view-courses');
    } else {
      navigate(`/view-courses?subject=${encodeURIComponent(subjectName)}`);
    }
  };
  if (loading) {
  return (
    <div className="flex justify-center py-4">
      <span>Loading subjects...</span>
    </div>
  );
}
  

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 py-2">
      {courses.map((course) => {
        const isActive = activeFilter?.toLowerCase() === course.subjectNm.toLowerCase();
        return (
       
          <div
            key={course.id}
            onClick={() => handleIconClick(course.subjectNm)}
            className={`flex flex-col items-center gap-1 w-14 md:w-16 rounded-md p-1.5 cursor-pointer transition-all ${
              isActive ? 'ring-2 ring-[#445AC8] shadow-sm' : 'hover:opacity-80'
            }`}
          >
            <img
              src={course.subjectImage}
              className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-md"
              alt={course.subjectNm}
            />
            <span className="text-[10px] md:text-xs font-bold text-[#445AC8] text-center">
              {course.subjectNm}
            </span>
          </div>
        
        );
      })}
    </div>
  );
};

export default CourseIcon;