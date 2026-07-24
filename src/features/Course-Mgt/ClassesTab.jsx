import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Clock, Ban, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

import { api } from '@/api/CourseMgtController';
import { cAdminControllerApi } from '@/api/class-admin-controller';
import SCheduleCourse from './course-Schedule/ScheduleCourse';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Import our decoupled sub-view component
import BatchCalendarView from './classesTabComponents/BatchCalendarView';

// ─── Individual Batch Row Component with Nested Toggle Structure ────────────
const BatchRowContainer = ({ batch, courseId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const isCancelled = batch.status === 'CANCELLED';

    // 1. Batch Level Cancellation Hook
    const cancelBatchMutation = useMutation({
        mutationFn: async (batchId) => {
            return await cAdminControllerApi.cancelClass(batchId);
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Cancelled!',
                text: `Batch "${batch.className}" has been cancelled successfully.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-xl' }
            });

            // Sync structural changes by invalidating relevant queries
            queryClient.invalidateQueries({ queryKey: ['courseBatches', courseId] });
            queryClient.invalidateQueries({ queryKey: ['courseBatchesCountOnly', courseId] });
            queryClient.invalidateQueries({ queryKey: ['batchSchedules', batch.batchId] });
        },
        onError: (err) => {
            Swal.fire({
                title: 'Operation Failed',
                text: err?.message || 'Failed to complete batch cancellation request.',
                icon: 'error',
                customClass: { popup: 'rounded-xl' }
            });
        }
    });

    // 2. Alert confirmation trigger 
    const handleCancelBatchPrompt = (e) => {
        e.stopPropagation(); // Shield nesting click triggers
        
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to cancel the entire batch "${batch.className}" (ID: ${batch.batchId}). All future sessions under this class will be dropped!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#6b7280',  
            confirmButtonText: 'Yes, cancel batch!',
            cancelButtonText: 'Dismiss',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-xl',
                confirmButton: 'rounded-lg font-medium px-4 py-2',
                cancelButton: 'rounded-lg font-medium px-4 py-2'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                cancelBatchMutation.mutate(batch.batchId);
            }
        });
    };

    return (
        <React.Fragment>
            <TableRow className={`text-[10px] md:text-[12px] ${isCancelled ? 'bg-red-50/40 opacity-75' : ''}`}>
                <TableCell className="font-mono font-medium">{batch.batchId}</TableCell>
                <TableCell className="font-medium">{batch.className}</TableCell>
                <TableCell>{batch.startDate}</TableCell>
                <TableCell>{batch.endDate}</TableCell>
                <TableCell>{batch.totalSchedulesGenerated} Sessions</TableCell>
                <TableCell className={`font-semibold ${!isCancelled ? 'text-green-600' : 'text-red-600'}`}>
                    {batch.status}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        {/* Cancel Batch Instance Button Trigger */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full disabled:opacity-30"
                            title="Cancel Entire Batch"
                            disabled={isCancelled || cancelBatchMutation.isPending}
                            onClick={handleCancelBatchPrompt}
                        >
                            <Ban size={13} />
                        </Button>

                        <Button 
                            variant={isOpen ? 'default' : 'outline'} 
                            size='sm' 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="h-7 w-7 p-0 rounded-full"
                        >
                            <Clock size={14} />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Nested expanded calendar sub row container */}
            {isOpen && (
                <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50 border-l-2 border-indigo-500 pl-6 pr-4 py-3">
                        <BatchCalendarView batch={batch} />
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

// ─── Nested Batches List (Expanded View with Tabs) ───────────────────────────
const CourseBatchesSubTable = ({ courseId, initialBatches }) => {
    const [activeTab, setActiveTab] = useState('ongoing');

    const { data: batches = [] } = useQuery({
        queryKey: ['courseBatches', courseId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getClassesByCourse(courseId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        initialData: initialBatches,
        staleTime: 1 * 60 * 1000 
    });

    const getFilteredBatches = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return batches.filter((batch) => {
            const start = new Date(batch.startDate);
            const end = new Date(batch.endDate);
            
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            if (activeTab === 'upcoming') return start > today;
            if (activeTab === 'completed') return end < today;
            return today >= start && today <= end;
        });
    };

    const filteredBatches = getFilteredBatches();
    const tabs = ['ongoing', 'upcoming', 'completed'];

    return (
        <div className='bg-white rounded-lg overflow-x-auto ml-10 mr-10 p-4 shadow-sm'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b pb-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Scheduled Batches
                </h4>
                
                <div className="flex w-full sm:w-auto justify-between gap-1 bg-gray-100 p-1 rounded-md text-xs font-medium">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-sm transition-all capitalize ${
                                activeTab === tab ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {tab} ({
                                batches.filter(b => {
                                    const today = new Date(); today.setHours(0,0,0,0);
                                    const s = new Date(b.startDate); s.setHours(0,0,0,0);
                                    const e = new Date(b.endDate); e.setHours(23,59,59,999);
                                    if (tab === 'upcoming') return s > today;
                                    if (tab === 'completed') return e < today;
                                    return today >= s && today <= e;
                                }).length
                            })
                        </button>
                    ))}
                </div>
            </div>

            {filteredBatches.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                    No {activeTab} batches found.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-200 text-[10px] md:text-[12px]'>
                            <TableHead>BATCH ID</TableHead>
                            <TableHead>BATCH NAME</TableHead>
                            <TableHead>START DATE</TableHead>
                            <TableHead>END DATE</TableHead>
                            <TableHead>TOTAL CLASSES</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead className="text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBatches.map((batch) => (
                            <BatchRowContainer key={batch.batchId} batch={batch} courseId={courseId} />
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

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
        setOpen(false);
        refetch();
        queryClient.invalidateQueries({ queryKey: ['courseBatchesCountOnly'] });
        queryClient.invalidateQueries({ queryKey: ['courseBatches'] });
        queryClient.invalidateQueries({ queryKey: ['batchSchedules'] });
    };

    if (isPending) return <div className="p-6 text-center text-sm font-medium text-gray-500">Loading ...</div>;
    if (error) return <div className="p-6 text-center text-sm text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-6 bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex items-center justify-between mb-4">
                <h2 className='text-[18px] md:text-3xl font-semibold'>Class Schedules</h2>
                
                <Button onClick={() => setOpen(true)}>
                    <Plus size={16} /> Create Class Schedule
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