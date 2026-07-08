import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { api } from '@/api/CourseMgtController';
import { useNavigate } from "react-router-dom";
import AddNewCourse from '@/pages/staffPages/AddNewCourse';
import ViewCourse from './coursesTabComponents/CourseView';
import DeleteCourseDialog from './coursesTabComponents/DeleteCourseDialog';

import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import EditCourse from './coursesTabComponents/EditCourse';
import AssignInstructorDialog from './coursesTabComponents/AssignInstructorsDialog';
import CourseFeeDialog from './coursesTabComponents/CourseFeeDialog';
import { feeApi } from '@/api/course-fee-controller';

// Pure core fetcher for raw course metadata
const fetchCourses = async () => {
    const result = await api.viewAllCourses();
    return result.data || [];
};

// Isolated Fee Row component to exploit TanStack Query caching per row
const CourseTableRow = ({ course, selectedSubject, refetchCourses, navigate, courseDetail }) => {
    // Each row manages its own cache instance. If it exists in cache, network request is skipped!
    const { data: feeData } = useQuery({
        queryKey: ['courseFee', course.courseId],
        queryFn: async () => {
            const res = await feeApi.getCourseFeeSetting(course.courseId);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // Keep cache fresh for 5 mins
    });

    const duration = feeData?.courseDuration && feeData.courseDuration.trim() !== "—" 
        ? feeData.courseDuration 
        : "#NA";
        
    const fee = feeData?.currentFee?.fee ?? "#NA";

    return (
        <TableRow className="text-[10px] md:text-[12px]">
            <TableCell>{course.courseId}</TableCell>
            <TableCell>{course.subjectNm}</TableCell>
            <TableCell>{course.courseTitle}</TableCell>
            <TableCell>{duration}</TableCell>
            <TableCell>{fee}</TableCell>
            <TableCell>
                <ButtonGroup>
                    <Button
                        className="bg-green-400 hover:bg-green-700 text-white rounded-r-none"
                        size="sm"
                        onClick={() => courseDetail(course.courseId)}
                    >
                        View
                    </Button>
                    <ButtonGroupSeparator />                      
                    <Button
                        className="bg-blue-400 hover:bg-blue-700 text-white rounded-l-none"
                        size="sm"
                        onClick={() => navigate(`/course-builder/${course.courseId}`)}
                    >
                        Edit
                    </Button>
                </ButtonGroup>
            </TableCell>
            <TableCell>
                <div className='flex gap-2 mt-2'>
                    <ViewCourse course={course} />
                    <EditCourse course={course} onUpdateSuccess={refetchCourses} />
                    <CourseFeeDialog course={course} />
                    <DeleteCourseDialog 
                        courseId={course.courseId} 
                        id={course.id} 
                        courseTitle={course.courseTitle} 
                        onDeleteSuccess={refetchCourses} 
                    />
                </div>
            </TableCell>
            <TableCell>
                <AssignInstructorDialog course={course} onAssignSuccess={refetchCourses} />
            </TableCell>
        </TableRow>
    );
};

const CoursesTab = () => {
    const [selectedSubject, setSelectedSubject] = useState("all");    
    const navigate = useNavigate();

    const { data: rawCourses = [], isPending, error, refetch } = useQuery({
        queryKey: ['courses'],
        queryFn: fetchCourses,
        staleTime: 2 * 60 * 1000
    });

    if (isPending) return <div className="p-6 text-center text-sm text-gray-500">Data Loading ...</div>;
    if (error) return <div className="p-6 text-center text-sm text-red-500">Error: {error.message}</div>;

    // Filter array synchronously on the fly during render instead of running heavy effect synchronization blocks
    const filteredCourses = selectedSubject && selectedSubject !== "all"
        ? rawCourses.filter(course => course.subjectNm === selectedSubject)
        : rawCourses;

    const uniqueSubjects = [...new Set(rawCourses.map(d => d.subjectNm).filter(Boolean))];
    const courseDetail = (courseId) => navigate(`/courseDetails/${courseId}`);

    return (
        <div className='bg-gray-100 p-6'>
            <div>
                <h2 className='text-[18px] md:text-3xl font-semibold text-center mb-6'>Course Management</h2>
                <div className='mb-4 flex justify-between items-center bg-gray-100'>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className='w-[200px] bg-white text-[10px] md:text-[12px]'>
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-[10px] md:text-[12px]">All Subjects</SelectItem>
                            {uniqueSubjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="text-[10px] md:text-[12px]">{subject}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <AddNewCourse />
                </div>
            </div>

            <div className='bg-white overflow-x-auto shadow rounded'>
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow className="text-[10px] md:text-[12px]">
                            <TableHead>Course ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Chapters</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Instructors</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <CourseTableRow 
                                    key={course.courseId}
                                    course={course}
                                    selectedSubject={selectedSubject}
                                    refetchCourses={refetch}
                                    navigate={navigate}
                                    courseDetail={courseDetail}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4 text-xs text-gray-400">
                                    No courses found matching criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='mt-2'>
                <p className='text-sm text-gray-500 mt-4'>Showing {filteredCourses.length} of {rawCourses.length} courses</p>
            </div>
        </div>
    );
};

export default CoursesTab;