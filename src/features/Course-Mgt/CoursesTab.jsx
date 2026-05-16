import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/table';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, SquarePen } from 'lucide-react';
import { api } from '@/api/CourseMgtController';
import { useNavigate } from "react-router-dom";
import AddNewCourse from '@/pages/staffPages/AddNewCourse';

const fetchCourses = async () => {
    console.log('entered into fetchCourses function. and the current time is: ', new Date().toLocaleTimeString());
    const result = await api.viewAllCourses();

    console.log("result is: ", result);
    return result.data;
};


const CoursesTab = () => {

    const [courses, setCourses] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");    
    const [courseLength, setCourseLength ] = useState(0);
    const navigate = useNavigate();

    // const courses = [
    //     { id: "CS101", subject: "Computer Science", name: "Introduction to Programming", duration: "12 weeks", fee: "$500" },
    //     { id: "CS201", subject: "Computer Science", name: "Data Structures and Algorithms", duration: "16 weeks", fee: "$650" },
    //     { id: "MATH101", subject: "Mathematics", name: "Calculus I", duration: "14 weeks", fee: "$450" },
    //     { id: "MATH201", subject: "Mathematics", name: "Linear Algebra", duration: "12 weeks", fee: "$500" },
    //     { id: "PHY101", subject: "Physics", name: "General Physics", duration: "15 weeks", fee: "$550" },
    //     { id: "PHY201", subject: "Physics", name: "Quantum Mechanics", duration: "16 weeks", fee: "$700" },
    //     { id: "CHEM101", subject: "Chemistry", name: "General Chemistry", duration: "14 weeks", fee: "$500" },
    //     { id: "CHEM201", subject: "Chemistry", name: "Organic Chemistry", duration: "16 weeks", fee: "$600" },
    //     { id: "BIO101", subject: "Biology", name: "Introduction to Biology", duration: "12 weeks", fee: "$475" },
    //     { id: "ENG101", subject: "English", name: "English Composition", duration: "10 weeks", fee: "$400" },
    // ]


   
    const { data = [], isPending, error } = useQuery({
        queryKey: ['courses'],
        queryFn: fetchCourses,
        staleTime: 2 * 60 * 1000
    });

    useEffect(() => {
        const filteredData = (selectedSubject && selectedSubject != "all" ? (data.filter(course => course.subjectNm === selectedSubject)) : data);
        setCourses(filteredData);
setCourseLength(filteredData.length);
    }, [data, selectedSubject]);

    const uniqueSubject = [...new Set(data.map(d => d.subjectNm))];
    

    if (isPending) {
        return <div>Data Loading ...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }

const courseDetail = (courseId) => {
navigate(`/courseDetails/${courseId}`);
}


    return (
        <>
            <div className='bg-gray-100 p-6'>
                <div className='bg-gray-100'>
                    <h2 className='text-[18px] md:text-3xl font-semibold text-center mb-6'>Course Management</h2>

                    {/* filter */}
                    <div className='mb-4 bg-gray-100'>

                        <Select onValueChange={setSelectedSubject}>
                            <SelectTrigger className='w-[200px] bg-white text-[10px] md:text-[12px]'>
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all"  className="text-[10px] md:text-[12px]">All Subjects</SelectItem>
                                {uniqueSubject.map((subject) => (
                                    <React.Fragment key={subject}>
                                        <SelectItem value={subject}  className="text-[10px] md:text-[12px]">{subject}</SelectItem>
                                    </React.Fragment>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* ADD Course Button */}
                        <AddNewCourse/>


                    </div>
                </div>

                {/* Table */}
                <div className='bg-white overflow-x-auto shadow rounded'>
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow className="text-[10px] md:text-[12px]">
                                <TableHead>Course ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            

                            {courses.map((course, index) => (



                                <TableRow key={course.courseId} className="text-[10px] md:text-[12px]">

                                    <TableCell >{course.courseId}</TableCell>
                                    <TableCell>{course.subjectNm}</TableCell>
                                    <TableCell>{course.courseTitle}</TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>{course.fee}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2 mt-2'>
                                            <Button variant='ghost' onClick={() => courseDetail(course.courseId)}>
                                                <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
                                            </Button>
                                            <Button variant='ghost'>
                                                <SquarePen className="w-5 h-5 text-green-500 cursor-pointer" />
                                            </Button>
                                        </div>
                                        
                                    </TableCell>
                                </TableRow>
                                
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className='mt-2'><p className='text-sm text-gray-500 mt-4'>Showing {courseLength} of 10 courses</p></div>

            </div>

        </>
    );
}

export default CoursesTab;