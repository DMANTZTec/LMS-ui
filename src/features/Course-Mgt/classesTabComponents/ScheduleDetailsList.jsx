import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Ban, Loader2, Info, Video } from 'lucide-react';
import { cAdminControllerApi } from '@/api/class-admin-controller';
import { toast } from 'react-hot-toast';

const ScheduleDetailsList = ({ activeSchedulesList, instructors, batchId, isPending, isBatchEnded }) => {
    const queryClient = useQueryClient();
    const [pendingCancelId, setPendingCancelId] = useState(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);

    // Fetch standalone metadata details for selected row item link preview
    const { data: currentSelectedScheduleDetails = null, isPending: isDetailsPending } = useQuery({
        queryKey: ['scheduleDetails', selectedScheduleId],
        queryFn: async () => {
            if (!selectedScheduleId) return null;
            const result = await cAdminControllerApi.getScheduleById(selectedScheduleId);
            return result?.data || result;
        },
        enabled: !!selectedScheduleId,
        staleTime: 30 * 1000
    });

    // Sync highlighted selected row when schedule changes
    useEffect(() => {
        if (activeSchedulesList.length > 0) {
            setSelectedScheduleId(activeSchedulesList[0].scheduleId);
        } else {
            setSelectedScheduleId(null);
        }
    }, [activeSchedulesList]);

    // Cancel Mutation
    const cancelScheduleMutation = useMutation({
        mutationFn: async (scheduleId) => {
            return await cAdminControllerApi.cancelSchedule(scheduleId);
        },
        onSuccess: (_, scheduleId) => {
            toast.success(`Schedule session #${scheduleId} cancelled successfully.`);
            setPendingCancelId(null);
            queryClient.invalidateQueries({ queryKey: ['batchSchedules', batchId] });
            if (selectedScheduleId === scheduleId) {
                queryClient.invalidateQueries({ queryKey: ['scheduleDetails', scheduleId] });
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to cancel session.");
            setPendingCancelId(null);
        }
    });

    // Assign Instructor Mutation
    const assignInstructorMutation = useMutation({
        mutationFn: async ({ scheduleId, staffId }) => {
            return await cAdminControllerApi.assignInstructor(scheduleId, { staffId });
        },
        onSuccess: (_, variables) => {
            toast.success(`Instructor assigned successfully.`);
            queryClient.invalidateQueries({ queryKey: ['batchSchedules', batchId] });
            if (selectedScheduleId === variables.scheduleId) {
                queryClient.invalidateQueries({ queryKey: ['scheduleDetails', variables.scheduleId] });
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to assign instructor.");
        }
    });

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-12 text-gray-400 text-xs gap-2">
                <Loader2 size={14} className="animate-spin text-indigo-500" /> Fetching updates...
            </div>
        );
    }

    if (activeSchedulesList.length === 0) {
        return (
            <div className="text-center py-12 text-xs text-gray-400 italic">
                No classes or sessions scheduled on this date.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <Table>
                    <TableHeader className="bg-gray-50 text-[10px]">
                        <TableRow>
                            <TableHead className="h-8 py-1">ID</TableHead>
                            <TableHead className="h-8 py-1">TIMING</TableHead>
                            <TableHead className="h-8 py-1">STAFF INSTRUCTOR</TableHead>
                            <TableHead className="h-8 py-1">STATUS</TableHead>
                            <TableHead className="h-8 py-1 text-right">ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeSchedulesList.map((sch) => {
                            const isSchCancelled = sch.status === 'CANCELLED';
                            const isConfirmingCancel = pendingCancelId === sch.scheduleId;
                            const isRowHighlighted = selectedScheduleId === sch.scheduleId;

                            return (
                                <TableRow 
                                    key={sch.scheduleId} 
                                    onClick={() => setSelectedScheduleId(sch.scheduleId)}
                                    className={`text-[11px] cursor-pointer transition-colors ${
                                        isSchCancelled ? 'opacity-40 bg-gray-50/50' : ''
                                    } ${isRowHighlighted ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : ''}`}
                                >
                                    <TableCell className="font-mono font-bold text-gray-500 py-2">{sch.scheduleId}</TableCell>
                                    <TableCell className="font-medium text-gray-800 py-2 whitespace-nowrap">
                                        {sch.startTime} - {sch.endTime}
                                    </TableCell>
                                    
                                    <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                                        {sch.staffName || sch.staffId ? (
                                            <div>
                                                <div className="font-semibold text-gray-700">{sch.staffName}</div>
                                                <div className="text-[9px] text-gray-400">{sch.staffId}</div>
                                            </div>
                                        ) : isSchCancelled ? (
                                            <span className="text-gray-400 italic text-[10px]">Unassigned</span>
                                        ) : (
                                            <select
                                                defaultValue=""
                                                disabled={assignInstructorMutation.isPending}
                                                className="text-[10px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 max-w-[120px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        assignInstructorMutation.mutate({ 
                                                            scheduleId: sch.scheduleId, 
                                                            staffId: e.target.value 
                                                        });
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>Select Staff...</option>
                                                {instructors.map((ins) => (
                                                    <option key={ins.staffId} value={ins.staffId}>
                                                        {`${ins.firstNm || ''} ${ins.lastNm || ''}`.trim() || ins.staffId}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </TableCell>

                                    <TableCell className="py-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                                            isSchCancelled 
                                                ? 'bg-red-50 text-red-600 border border-red-100' 
                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        }`}>
                                            {sch.status}
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                        {isConfirmingCancel ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="xs" variant="destructive" className="h-5 px-1.5 text-[9px]" onClick={() => cancelScheduleMutation.mutate(sch.scheduleId)}>
                                                    Confirm
                                                </Button>
                                                <Button size="xs" variant="outline" className="h-5 px-1.5 text-[9px]" onClick={() => setPendingCancelId(null)}>
                                                    No
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                                disabled={isSchCancelled || cancelScheduleMutation.isPending || isBatchEnded}
                                                onClick={() => setPendingCancelId(sch.scheduleId)}
                                            >
                                                <Ban size={12} />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* DYNAMIC METADATA INFORMATION CARD FOOTER */}
            <div className="mt-4 border-t border-dashed border-gray-200">
                {isDetailsPending ? (
                    <div className="flex items-center justify-center py-4 text-gray-400 text-[11px] gap-1.5">
                        <Loader2 size={12} className="animate-spin text-indigo-500" />
                        <span>Loading session details...</span>
                    </div>
                ) : currentSelectedScheduleDetails ? (
                    <div className="pt-3 bg-gray-50/60 p-3 rounded-lg text-[11px] animate-in fade-in duration-150">
                        {currentSelectedScheduleDetails.meetingLink && currentSelectedScheduleDetails.meetingLink !== 'N/A' && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Video size={12} className="text-emerald-500 shrink-0" />
                                <span className="font-semibold text-gray-500">Live Link:</span>
                                <a 
                                    href={currentSelectedScheduleDetails.meetingLink} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-indigo-600 font-medium hover:underline truncate max-w-[400px]"
                                >
                                    {currentSelectedScheduleDetails.meetingLink}
                                </a>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </>
    );
};

ScheduleDetailsList.propTypes = {
    activeSchedulesList: PropTypes.array.isRequired,
    instructors: PropTypes.array.isRequired,
    batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isPending: PropTypes.bool.isRequired,
    isBatchEnded: PropTypes.bool.isRequired
};

export default ScheduleDetailsList;