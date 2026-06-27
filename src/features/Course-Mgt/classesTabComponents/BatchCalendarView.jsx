import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X, Loader2 } from 'lucide-react';
import { cAdminControllerApi } from '@/api/class-admin-controller';
import { toast } from 'react-hot-toast';
import ScheduleDetailsList from './ScheduleDetailsList';

/**
 * Parses dates into a timezone-agnostic 'YYYY-MM-DD' key relative to local time,
 * resolving the "one day advance/behind" timezone mismatch bug.
 */
const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const BatchCalendarView = ({ batch }) => {
    const queryClient = useQueryClient();
    
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const batchStart = useMemo(() => {
        const d = new Date(batch.startDate);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [batch.startDate]);

    const batchEnd = useMemo(() => {
        const d = new Date(batch.endDate);
        d.setHours(23, 59, 59, 999);
        return d;
    }, [batch.endDate]);

    // Fallback focus logic
    const initialDate = useMemo(() => {
        if (today >= batchStart && today <= batchEnd) return today;
        return today < batchStart ? batchStart : batchEnd;
    }, [today, batchStart, batchEnd]);

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [newClassForm, setNewClassForm] = useState({
        className: '',
        staffId: '',
        startTime: '09:00',
        endTime: '10:00'
    });

    // 1. Fetch batch schedules
    const { data: schedules = [], isPending } = useQuery({
        queryKey: ['batchSchedules', batch.batchId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getSchedulesByBatch(batch.batchId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        staleTime: 1 * 60 * 1000
    });

    // 2. Fetch instructors
    const { data: instructors = [] } = useQuery({
        queryKey: ['batchInstructors', batch.batchId],
        queryFn: async () => {
            const result = await cAdminControllerApi.getInstructorsByBatchId(batch.batchId);
            return Array.isArray(result) ? result : result?.data || [];
        },
        staleTime: 5 * 60 * 1000
    });

    // Hash map grouping
    const schedulesByDate = useMemo(() => {
        const groups = {};
        schedules.forEach(schedule => {
            if (schedule.classDate) {
                const dateStr = getLocalDateString(schedule.classDate);
                if (dateStr) {
                    if (!groups[dateStr]) groups[dateStr] = [];
                    groups[dateStr].push(schedule);
                }
            }
        });
        return groups;
    }, [schedules]);

    const selectedDateStr = getLocalDateString(selectedDate);
    const activeSchedulesList = schedulesByDate[selectedDateStr] || [];

    // 3. Create Schedule Mutation
    const addScheduleMutation = useMutation({
        mutationFn: async (payload) => {
            return await cAdminControllerApi.addScheduleToClass(payload);
        },
        onSuccess: () => {
            toast.success("New class session added successfully!");
            setIsAddingClass(false);
            setNewClassForm({ className: '', staffId: '', startTime: '09:00', endTime: '10:00' });
            queryClient.invalidateQueries({ queryKey: ['batchSchedules', batch.batchId] });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to create class session.");
        }
    });

    const handleAddClassSubmit = (e) => {
        e.preventDefault();
        if (!newClassForm.className.trim()) return toast.error("Please provide a class name.");

        // Format times into matching "HH:mm:ss" strings for the backend API requirement
        const formattedStartTime = newClassForm.startTime.length === 5 ? `${newClassForm.startTime}:00` : newClassForm.startTime;
        const formattedEndTime = newClassForm.endTime.length === 5 ? `${newClassForm.endTime}:00` : newClassForm.endTime;

        // Structured payload to match the target flat structure
        const payload = {
            batchId: Number(batch.batchId),
            staffId: newClassForm.staffId ? String(newClassForm.staffId) : null,
            className: newClassForm.className,
            classDate: selectedDateStr,
            startTime: formattedStartTime,
            endTime: formattedEndTime
        };

        addScheduleMutation.mutate(payload);
    };

    // Calendar Calculations
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const canGoPrev = new Date(year, month - 1, 1) >= new Date(batchStart.getFullYear(), batchStart.getMonth(), 1);
    const canGoNext = new Date(year, month + 1, 1) <= new Date(batchEnd.getFullYear(), batchEnd.getMonth(), 1);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 p-1 bg-gray-50/50 rounded-xl">
            
            {/* LEFT SIDE: INCREASED SCHEDULE DETAILS COMPONENT PANEL */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm flex flex-col justify-between min-h-[350px]">
                <div>
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-600" />
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Schedule Information
                            </h4>
                        </div>
                        <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <ScheduleDetailsList 
                        activeSchedulesList={activeSchedulesList}
                        instructors={instructors}
                        batchId={batch.batchId}
                        isPending={isPending}
                        isBatchEnded={today > batchEnd}
                    />
                </div>
            </div>

            {/* RIGHT SIDE: COMPACT CALENDAR VIEW MATCHING ORIGINAL DESIGN */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={15} className="text-indigo-600" />
                            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                {monthNames[month]} {year}
                            </h5>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} disabled={!canGoPrev}>
                                <ChevronLeft size={12} />
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} disabled={!canGoNext}>
                                <ChevronRight size={12} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {blanksArray.map((blank) => <div key={`blank-${blank}`} className="h-8" />)}
                        
                        {daysArray.map((day) => {
                            const loopDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const targetDayDate = new Date(year, month, day);
                            const targetDayStart = new Date(year, month, day, 0, 0, 0, 0);
                            const targetDayEnd = new Date(year, month, day, 23, 59, 59, 999);
                            
                            const isOutOfBatchWindow = targetDayEnd < batchStart || targetDayStart > batchEnd;
                            const daySchedules = schedulesByDate[loopDateStr] || [];
                            const hasClasses = daySchedules.length > 0;
                            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                            
                            const isCompleted = targetDayEnd < today;
                            const isEntirelyCancelled = hasClasses && daySchedules.every(s => s.status === 'CANCELLED');
                            const showRedLayout = isCompleted || isEntirelyCancelled;

                            return (
                                <button
                                    key={`day-${day}`}
                                    type="button"
                                    disabled={isOutOfBatchWindow}
                                    onClick={() => !isOutOfBatchWindow && setSelectedDate(targetDayDate)}
                                    className={`h-8 rounded flex flex-col items-center justify-between p-1 transition-all text-[11px] font-medium relative border ${
                                        isOutOfBatchWindow 
                                            ? 'bg-gray-100/40 text-gray-300 border-none cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                                                : hasClasses 
                                                    ? showRedLayout
                                                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 font-semibold'
                                                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{day}</span>
                                    {hasClasses && !isOutOfBatchWindow && (
                                        <span className={`w-1 h-1 rounded-full mb-0.5 ${isSelected ? 'bg-white' : showRedLayout ? 'bg-red-400' : 'bg-indigo-500'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* EXPANDABLE INLINE NEW SESSION FORM */}
                <div className="mt-4 border-t pt-3">
                    {!isAddingClass ? (
                        <Button 
                            type="button"
                            onClick={() => setIsAddingClass(true)}
                            className="w-full h-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold gap-1.5 border border-indigo-200/60 rounded-lg shadow-none"
                        >
                            <Plus size={14} /> Add Class to {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Button>
                    ) : (
                        <form onSubmit={handleAddClassSubmit} className="bg-gray-50/80 rounded-lg border border-gray-200/60 p-3 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <div className="flex justify-between items-center border-b pb-1.5">
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">New Session Details</span>
                                <button type="button" onClick={() => setIsAddingClass(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="col-span-2">
                                    <label className="block text-gray-500 font-medium mb-1">Class/Topic Name</label>
                                    <input type="text" required placeholder="e.g., Introduction to Framework" value={newClassForm.className} onChange={(e) => setNewClassForm(p => ({ ...p, className: e.target.value }))} className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 font-medium mb-1">Start Time</label>
                                    <input type="time" required value={newClassForm.startTime} onChange={(e) => setNewClassForm(p => ({ ...p, startTime: e.target.value }))} className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 font-medium mb-1">End Time</label>
                                    <input type="time" required value={newClassForm.endTime} onChange={(e) => setNewClassForm(p => ({ ...p, endTime: e.target.value }))} className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-500 font-medium mb-1">Assign Initial Instructor (Optional)</label>
                                    <select value={newClassForm.staffId} onChange={(e) => setNewClassForm(p => ({ ...p, staffId: e.target.value }))} className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-white">
                                        <option value="">Leave Unassigned</option>
                                        {instructors.map((ins) => (
                                            <option key={ins.staffId} value={ins.staffId}>{`${ins.firstNm || ''} ${ins.lastNm || ''}`.trim() || ins.staffId}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-1.5 pt-1">
                                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px] px-2.5" onClick={() => setIsAddingClass(false)}>Cancel</Button>
                                <Button type="submit" size="sm" className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white px-3 gap-1" disabled={addScheduleMutation.isPending}>
                                    {addScheduleMutation.isPending && <Loader2 size={11} className="animate-spin" />} Save Session
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

BatchCalendarView.propTypes = {
    batch: PropTypes.shape({
        batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        courseName: PropTypes.string
    }).isRequired
};

export default BatchCalendarView;