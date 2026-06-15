import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { api } from '@/api/CourseMgtController';
import { cAdminControllerApi } from '@/api/class-admin-controller';
import SCheduleCourse from './course-Schedule/ScheduleCourse';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// ─── Individual Course Row Component ─────────────────────────────────────────
const CourseRowWithBatchCount = ({ course, openRow, setOpenRow }) => {
    const courseId = course.courseId;

    const { data: batches = [], isPending } = useQuery({
        queryKey: ['courseBatchesCountOnly', courseId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getClassesByCourse(courseId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        staleTime: 1 * 60 * 1000
    });

    if (isPending) {
        return (
            <TableRow className="text-[10px] md:text-[12px] opacity-60">
                <TableCell><Button variant='ghost' disabled><ChevronRight size={16} /></Button></TableCell>
                <TableCell>{course.courseId}</TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell>{course.subjectNm}</TableCell>
                <TableCell>Calculating...</TableCell>
            </TableRow>
        );
    }

    if (batches.length === 0) return null;

    const isCurrentRowOpen = openRow === courseId;

    return (
        <React.Fragment>
            <TableRow className="text-[10px] md:text-[12px]">
                <TableCell>
                    <Button onClick={() => setOpenRow(isCurrentRowOpen ? null : courseId)} variant='ghost'>
                        {isCurrentRowOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                </TableCell>
                <TableCell>{course.courseId}</TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell>{course.subjectNm}</TableCell>
                <TableCell className="font-semibold">{batches.length}</TableCell>
            </TableRow>

            {isCurrentRowOpen && (
                <TableRow>
                    <TableCell colSpan={5} className='bg-gray-100'>
                        <div className="py-4">
                            <CourseBatchesSubTable courseId={courseId} initialBatches={batches} />
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

// ─── Nested Batches List (Expanded View) ─────────────────────────────────────
const CourseBatchesSubTable = ({ courseId, initialBatches }) => {
    const queryClient = useQueryClient();

    const { data: batches } = useQuery({
        queryKey: ['courseBatches', courseId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getClassesByCourse(courseId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        initialData: initialBatches,
        staleTime: 1 * 60 * 1000 
    });

    return (
        <div className='bg-white rounded-lg overflow-x-auto ml-10 mr-10 p-4 shadow-sm'>
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Active Scheduled Batches</h4>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className='bg-gray-200 text-[10px] md:text-[12px]'>
                        <TableHead>BATCH ID</TableHead>
                        <TableHead>BATCH NAME</TableHead>
                        <TableHead>START DATE</TableHead>
                        <TableHead>END DATE</TableHead>
                        <TableHead>TOTAL CLASSES</TableHead>
                        <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {batches.map((batch) => {
                        const isCancelled = batch.status === 'CANCELLED';
                        return (
                            <TableRow key={batch.batchId} className="text-[10px] md:text-[12px]">
                                <TableCell>{batch.batchId}</TableCell>
                                <TableCell>{batch.className}</TableCell>
                                <TableCell>{batch.startDate}</TableCell>
                                <TableCell>{batch.endDate}</TableCell>
                                <TableCell>{batch.totalSchedulesGenerated} Sessions</TableCell>
                                <TableCell className={`font-semibold ${!isCancelled ? 'text-green-600' : 'text-red-600'}`}>
                                    {batch.status}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

// ─── Main Schedules Panel Component ──────────────────────────────────────────
const ClassesTab = () => {
    const [openRow, setOpenRow] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const fetchAllCourses = async () => {
        const result = await api.viewAllCourses();
        return Array.isArray(result) ? result : result?.data || [];
    };

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['coursesScheduleMaster'],
        queryFn: fetchAllCourses,
        staleTime: 2 * 60 * 1000
    });

    useEffect(() => {
        if (data) setCoursesData(data);
    }, [data]);

    const handleSuccessSchedule = () => {
        setOpen(false); // Close Dialog layout
        refetch(); // Refetch master list
        queryClient.invalidateQueries({ queryKey: ['courseBatchesCountOnly'] });
        queryClient.invalidateQueries({ queryKey: ['courseBatches'] });
    };

    if (isPending) return <div>Loading ...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-6 bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex items-center justify-between mb-4">
                <h2 className='text-[18px] md:text-3xl font-semibold'>Class Schedules</h2>
                
                <Button onClick={() => setOpen(true)}>
                    + Create Class Schedule
                </Button>

                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto bg-gray-100">
                        <SCheduleCourse onSuccess={handleSuccessSchedule} />
                    </DialogContent>
                </Dialog> 
            </div>

            <div className="rounded-xl shadow bg-white overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className='bg-gray-100 text-[10px] md:text-[12px]'>
                            <TableHead />
                            <TableHead>COURSE ID</TableHead>
                            <TableHead>COURSE NAME</TableHead>
                            <TableHead>SUBJECT DOMAIN</TableHead>
                            <TableHead>NO OF BATCHES</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {coursesData.map((course) => (
                            <CourseRowWithBatchCount 
                                key={course.id || course.courseId} 
                                course={course}
                                openRow={openRow}
                                setOpenRow={setOpenRow}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ClassesTab;