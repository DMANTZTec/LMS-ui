import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight, Clock, Ban, Loader2 } from 'lucide-react';
import { cAdminControllerApi } from '@/api/class-admin-controller';
import { toast } from 'react-hot-toast';

const BatchCalendarView = ({ batch }) => {
    const queryClient = useQueryClient();
    const batchStart = new Date(batch.startDate);
    const batchEnd = new Date(batch.endDate);
    
    const [currentMonth, setCurrentMonth] = useState(new Date(batchStart.getFullYear(), batchStart.getMonth(), 1));
    const [selectedDateSchedules, setSelectedDateSchedules] = useState(null);
    const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
    
    // Tracks which schedule ID is currently prompting for cancellation confirmation
    const [pendingCancelId, setPendingCancelId] = useState(null);

    // 1. Fetch batch schedules
    const { data: schedules = [], isPending } = useQuery({
        queryKey: ['batchSchedules', batch.batchId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getSchedulesByBatch(batch.batchId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        staleTime: 1 * 60 * 1000
    });

    // 2. Cancellation Mutation Hook
    const cancelScheduleMutation = useMutation({
        mutationFn: async (scheduleId) => {
            return await cAdminControllerApi.cancelSchedule(scheduleId);
        },
        onSuccess: (_, scheduleId) => {
            toast.success(`Schedule session #${scheduleId} cancelled successfully.`);
            setPendingCancelId(null);
            setIsDayDialogOpen(false); // Close dialogue right after success
            
            // Invalidate query to refresh background values & repaint calendar colors
            queryClient.invalidateQueries({ queryKey: ['batchSchedules', batch.batchId] });
            
            // Dynamically update context inline state
            if (selectedDateSchedules) {
                setSelectedDateSchedules(prev => ({
                    ...prev,
                    list: prev.list.map(sch => 
                        sch.scheduleId === scheduleId ? { ...sch, status: 'CANCELLED' } : sch
                    )
                }));
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to cancel the schedule session.");
            setPendingCancelId(null);
        }
    });

    // Hash map schedules for O(1) date lookups
    const schedulesByDate = React.useMemo(() => {
        const groups = {};
        schedules.forEach(schedule => {
            if (schedule.classDate) {
                const dateStr = new Date(schedule.classDate).toISOString().split('T')[0];
                if (!groups[dateStr]) groups[dateStr] = [];
                groups[dateStr].push(schedule);
            }
        });
        return groups;
    }, [schedules]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const canGoPrev = new Date(year, month - 1, 1) >= new Date(batchStart.getFullYear(), batchStart.getMonth(), 1);
    const canGoNext = new Date(year, month + 1, 1) <= new Date(batchEnd.getFullYear(), batchEnd.getMonth(), 1);

    const changeMonth = (direction) => {
        if (direction === -1 && !canGoPrev) return;
        if (direction === 1 && !canGoNext) return;
        setCurrentMonth(new Date(year, month + direction, 1));
    };

    const handleDateClick = (day) => {
        const clickedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDateSchedules({
            dateString: clickedDateStr,
            list: schedulesByDate[clickedDateStr] || []
        });
        setPendingCancelId(null); // Reset inline prompt states
        setIsDayDialogOpen(true);
    };

    return (
        <div className="rounded-md border bg-white shadow-inner p-4 max-w-md mx-auto">
            {/* Header Navigation */}
            <div className="flex justify-between items-center mb-3 border-b pb-2">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-indigo-600" />
                    <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        {monthNames[month]} {year}
                    </h5>
                </div>
                <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 disabled:opacity-30" onClick={() => changeMonth(-1)} disabled={!canGoPrev}>
                        <ChevronLeft size={12} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 disabled:opacity-30" onClick={() => changeMonth(1)} disabled={!canGoNext}>
                        <ChevronRight size={12} />
                    </Button>
                </div>
            </div>

            {isPending ? (
                <div className="text-xs text-center text-gray-400 py-6">Loading calendar...</div>
            ) : (
                <div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-1">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {blanksArray.map((blank) => <div key={`blank-${blank}`} className="h-8" />)}
                        
                        {daysArray.map((day) => {
                            const loopDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const targetDayDate = new Date(year, month, day);
                            
                            const isOutOfBatchWindow = targetDayDate < new Date(batchStart.setHours(0,0,0,0)) || 
                                                       targetDayDate > new Date(batchEnd.setHours(23,59,59,999));

                            const daySchedules = schedulesByDate[loopDateStr] || [];
                            const hasClasses = daySchedules.length > 0;
                            
                            const today = new Date(); today.setHours(0, 0, 0, 0);
                            const isCompleted = targetDayDate < today;
                            const isEntirelyCancelled = hasClasses && daySchedules.every(s => s.status === 'CANCELLED');

                            const showRedLayout = isCompleted || isEntirelyCancelled;

                            return (
                                <button
                                    key={`day-${day}`}
                                    disabled={isOutOfBatchWindow}
                                    onClick={() => !isOutOfBatchWindow && handleDateClick(day)}
                                    className={`h-8 rounded flex flex-col items-center justify-between p-1 transition-all text-[11px] font-medium relative border ${
                                        isOutOfBatchWindow 
                                            ? 'bg-gray-100/50 text-gray-300 border-none cursor-not-allowed'
                                            : hasClasses 
                                                ? showRedLayout
                                                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 font-bold'
                                                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold'
                                                : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{day}</span>
                                    {hasClasses && !isOutOfBatchWindow && (
                                        <span className={`w-1.5 h-1.5 rounded-full mb-0.5 ${showRedLayout ? 'bg-red-500' : 'bg-indigo-600'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-center items-center gap-4 text-[9px] text-gray-400 mt-3 border-t pt-2">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Active/Upcoming</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Cancelled / Completed</span>
                    </div>
                </div>
            )}

            {/* Schedule Details Dialog Modal */}
            <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
                <DialogContent className="sm:max-w-2xl bg-white p-5">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-600" />
                            Schedules for Date: {selectedDateSchedules?.dateString}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedDateSchedules?.list.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-400 italic">No classes are scheduled.</div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow className="text-[11px]">
                                        <TableHead>ID</TableHead>
                                        <TableHead>TIMING</TableHead>
                                        <TableHead>STAFF</TableHead>
                                        <TableHead>STATUS</TableHead>
                                        <TableHead className="text-right">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedDateSchedules?.list.map((sch) => {
                                        const isSchCancelled = sch.status === 'CANCELLED';
                                        const isConfirmingThisRow = pendingCancelId === sch.scheduleId;

                                        return (
                                            <TableRow key={sch.scheduleId} className={`text-xs hover:bg-gray-50 transition-colors ${isSchCancelled ? 'opacity-50' : ''}`}>
                                                <TableCell className="font-mono font-bold text-gray-600">{sch.scheduleId}</TableCell>
                                                <TableCell className="font-medium text-gray-900">{`${sch.startTime} - ${sch.endTime}`}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{sch.staffName}</div>
                                                    <div className="text-[10px] text-gray-400">{sch.staffId}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                        isSchCancelled 
                                                            ? 'bg-red-100 text-red-700 border border-red-200' 
                                                            : sch.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {sch.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isConfirmingThisRow ? (
                                                        /* Inline Confirmation UI Variant replacing SWAL popup */
                                                        <div className="flex justify-end items-center gap-1.5 animate-in fade-in duration-200">
                                                            <span className="text-[10px] font-medium text-amber-600 mr-1 hidden sm:inline">Confirm cancel?</span>
                                                            <Button 
                                                                size="xs" 
                                                                variant="destructive"
                                                                className="h-6 px-2 text-[10px]"
                                                                disabled={cancelScheduleMutation.isPending}
                                                                onClick={() => cancelScheduleMutation.mutate(sch.scheduleId)}
                                                            >
                                                                {cancelScheduleMutation.isPending ? <Loader2 size={10} className="animate-spin" /> : 'Yes'}
                                                            </Button>
                                                            <Button 
                                                                size="xs" 
                                                                variant="outline"
                                                                className="h-6 px-2 text-[10px]"
                                                                disabled={cancelScheduleMutation.isPending}
                                                                onClick={() => setPendingCancelId(null)}
                                                            >
                                                                No
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        /* Standard Action State Trigger */
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 disabled:opacity-30"
                                                            disabled={isSchCancelled || cancelScheduleMutation.isPending}
                                                            onClick={() => setPendingCancelId(sch.scheduleId)}
                                                        >
                                                            <Ban size={14} />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BatchCalendarView;