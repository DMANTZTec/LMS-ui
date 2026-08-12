import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IndianRupee, History } from 'lucide-react';
import { programFeeApi } from '@/api/program-fee-controller';
import toast from "react-hot-toast";

export const DURATION_OPTIONS = [
    { value: "ONE_MONTH", label: "1 Month" },
    { value: "TWO_MONTHS", label: "2 Months" },
    { value: "THREE_MONTHS", label: "3 Months" },
    { value: "FOUR_MONTHS", label: "4 Months" },
    { value: "FIVE_MONTHS", label: "5 Months" },
    { value: "SIX_MONTHS", label: "6 Months" },
    { value: "TWELVE_MONTHS", label: "12 Months" },
];

export const durationLabel = (value) => {
    if (!value) return "#NA";
    return DURATION_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
};

const ProgramFeeDialog = ({ program, onViewProgram, onSaveSuccess }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const queryClient = useQueryClient();

    const emptyForm = {
        fee: "",
        discount: "0",
        duration: undefined,
        effectiveDate: new Date().toISOString().split('T')[0]
    };

    const [formValues, setFormValues] = useState(emptyForm);
    // const staffId = "SF00003";
    const staffId = JSON.parse(localStorage.getItem("staffId"));

    const { data: feeData, isLoading, refetch } = useQuery({
        queryKey: ['programFee', program.programId],
        queryFn: async () => {
            const response = await programFeeApi.getProgramFeeSetting(program.programId);
            return response.data;
        },
        enabled: open,
    });

    const resetFormToLatestData = () => {
        if (!feeData) {
            setFormValues(emptyForm);
            return;
        }
        const history = feeData.feeHistory || [];
        if (history.length > 0) {
            const lastRecord = history[history.length - 1];
            setFormValues({
                fee: lastRecord.fee ?? "",
                discount: lastRecord.discount ?? "0",
                duration: lastRecord.duration ?? undefined,
                effectiveDate: lastRecord.effectiveDate ?? new Date().toISOString().split('T')[0]
            });
        } else if (feeData.currentFee) {
            setFormValues({
                fee: feeData.currentFee.fee ?? "",
                discount: feeData.currentFee.discount ?? "0",
                duration: feeData.currentFee.duration ?? undefined,
                effectiveDate: feeData.currentFee.effectiveDate ?? new Date().toISOString().split('T')[0]
            });
        } else {
            setFormValues(emptyForm);
        }
    };

    useEffect(() => {
        if (open) {
            setFormErrors({});
            setIsEditing(false);
            refetch();
        } else {
            setFormValues(emptyForm);
            setIsEditing(false);
        }
    }, [open, refetch]);

    useEffect(() => {
        if (open && feeData) {
            resetFormToLatestData();
        }
    }, [feeData, open]);

    const validateForm = () => {
        const errors = {};
        const feeNum = parseFloat(formValues.fee);
        const discountNum = parseFloat(formValues.discount);

        if (formValues.fee === "" || formValues.fee === null || isNaN(feeNum)) {
            errors.fee = "Enter a valid fee amount.";
        } else if (feeNum < 0) {
            errors.fee = "Fee cannot be negative.";
        } else if (feeNum === 0) {
            errors.fee = "Fee must be greater than zero.";
        }

        if (formValues.discount === "" || formValues.discount === null || isNaN(discountNum)) {
            errors.discount = "Enter a valid discount amount.";
        } else if (discountNum < 0) {
            errors.discount = "Discount cannot be negative.";
        } else if (!isNaN(feeNum) && discountNum > feeNum) {
            errors.discount = "Discount cannot exceed the fee.";
        }

        if (!formValues.effectiveDate) {
            errors.effectiveDate = "Effective date is required.";
        }

        if (!formValues.duration || !DURATION_OPTIONS.some((opt) => opt.value === formValues.duration)) {
            errors.duration = "Select a duration.";
        }

        return errors;
    };

    const handleSave = async () => {
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error(Object.values(errors)[0]);
            return;
        }

        setSubmitting(true);
        const payload = {
            effectiveDate: formValues.effectiveDate,
            fee: parseFloat(formValues.fee) || 0,
            discount: parseFloat(formValues.discount) || 0,
            duration: formValues.duration
        };

        try {
            const hasExistingRecords = feeData?.feeHistory && feeData.feeHistory.length > 0;

            if (hasExistingRecords) {
                await programFeeApi.updateProgramFee(program.programId, staffId, payload);
            } else {
                await programFeeApi.createProgramFee(program.programId, staffId, payload);
            }

            toast.success("Program fee saved successfully.");
            queryClient.invalidateQueries({ queryKey: ['programFee', program.programId] });
            onSaveSuccess?.();
            
            setIsEditing(false); 
            setOpen(false); 
        } catch (error) {
            console.error("Failed handling program fee submission:", error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const displayHistory = feeData?.feeHistory || [];

    const getInputClassName = (hasError) => `
        h-9 w-full box-border rounded-lg font-medium transition-colors focus-visible:ring-1
        ${isEditing 
            ? 'bg-white border-blue-400 text-slate-900 focus-visible:ring-indigo-500' 
            : 'bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-100 cursor-not-allowed select-none'
        } 
        ${hasError ? 'border-red-400 focus-visible:ring-red-400' : ''}
    `.trim();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size="icon" title="Set Program Fee">
                    <IndianRupee className="w-5 h-5 text-indigo-600 cursor-pointer hover:scale-110 transition-transform" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] p-0 overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
                
                {/* Header Section */}
                <div className="p-4 sm:p-6 pb-4 sm:pb-5 border-b flex justify-between items-start flex-shrink-0">
                    <div className="flex gap-3 items-center">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hidden sm:block">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="font-semibold text-base sm:text-lg text-slate-900">
                                Set Program Fee
                            </DialogTitle>
                            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                                Configure pricing and duration
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="overflow-hidden p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1">
                    {isLoading && (
                        <div className="p-8 text-center text-sm text-slate-500">Loading program fee details...</div>
                    )}

                    {!isLoading && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 pb-5 sm:pb-6 border-b">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">PROGRAM ID</Label>
                                    <Input
                                        value={program.programId}
                                        disabled
                                        className="bg-slate-50 border-slate-200 text-slate-500 font-mono font-medium disabled:opacity-100 h-9"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">PROGRAM NAME</Label>
                                    <Input
                                        value={feeData?.programTitle || program.programTitle}
                                        disabled
                                        className="bg-slate-50 border-slate-200 text-slate-500 font-medium disabled:opacity-100 h-9"  
                                    />
                                </div>
                            </div>

                            {/* Row 2 Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">FEE (INR)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formValues.fee}
                                        disabled={!isEditing || isLoading}
                                        onChange={(e) => {
                                            setFormValues({ ...formValues, fee: e.target.value });
                                            if (formErrors.fee) setFormErrors({ ...formErrors, fee: undefined });
                                        }}
                                        className={getInputClassName(formErrors.fee)}
                                    />
                                    {formErrors.fee && (
                                        <p className="text-red-500 text-xs font-normal mt-1">{formErrors.fee}</p>
                                    )}
                                </div>
                                
                                {/* Refactored Course Duration Conditional Field */}
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">COURSE DURATION</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formValues.duration ?? undefined}
                                            onValueChange={(value) => {
                                                setFormValues({ ...formValues, duration: value });
                                                if (formErrors.duration) setFormErrors({ ...formErrors, duration: undefined });
                                            }}
                                        >
                                            <SelectTrigger className={`h-9 w-full box-border font-medium bg-white shrink-0 ${formErrors.duration ? 'border-red-400 focus-visible:ring-red-400' : 'border-blue-400 focus-visible:ring-indigo-500'}`}>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DURATION_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            value={feeData?.currentFee?.courseDurationLabel || durationLabel(formValues.duration)}
                                            disabled
                                            className="bg-slate-50 border-slate-200 text-slate-600 font-medium disabled:opacity-100 cursor-not-allowed select-none h-9"
                                        />
                                    )}
                                    {formErrors.duration && (
                                        <p className="text-red-500 text-xs font-normal mt-1">{formErrors.duration}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3 Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">DISCOUNT (INR)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formValues.discount}
                                        disabled={!isEditing || isLoading}
                                        onChange={(e) => {
                                            setFormValues({ ...formValues, discount: e.target.value });
                                            if (formErrors.discount) setFormErrors({ ...formErrors, discount: undefined });
                                        }}
                                        className={getInputClassName(formErrors.discount)}
                                    />
                                    {formErrors.discount && (
                                        <p className="text-red-500 text-xs font-normal mt-1">{formErrors.discount}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">EFFECTIVE DATE</Label>
                                    <Input
                                        type="date"
                                        value={formValues.effectiveDate}
                                        disabled={!isEditing || isLoading}
                                        onChange={(e) => {
                                            setFormValues({ ...formValues, effectiveDate: e.target.value });
                                            if (formErrors.effectiveDate) setFormErrors({ ...formErrors, effectiveDate: undefined });
                                        }}
                                        className={getInputClassName(formErrors.effectiveDate)}
                                    />
                                    {formErrors.effectiveDate && (
                                        <p className="text-red-500 text-xs font-normal mt-1">{formErrors.effectiveDate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Table History Area */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 tracking-wide uppercase">
                                    <History className="w-4 h-4" />
                                    <span>Fee History</span>
                                </div>

                                <div className="border rounded-lg max-h-[137px] overflow-y-auto overflow-x-auto w-full base-scroll">
                                    <Table className="min-w-[500px] sm:min-w-full">
                                        <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                            <TableRow className="text-[11px] font-semibold text-slate-500 hover:bg-transparent">
                                                <TableHead className="h-9 whitespace-nowrap">EFF. DATE</TableHead>
                                                <TableHead className="h-9 whitespace-nowrap">FEE</TableHead>
                                                <TableHead className="h-9 whitespace-nowrap">DURATION</TableHead>
                                                <TableHead className="h-9 whitespace-nowrap">DISCOUNT</TableHead>
                                                <TableHead className="h-9 whitespace-nowrap">SET BY</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {displayHistory.length > 0 ? (
                                                displayHistory.map((history, i) => (
                                                    <TableRow key={i} className="text-xs sm:text-sm text-slate-700 border-b hover:bg-slate-50/50">
                                                        <TableCell className="py-2 font-mono text-slate-500 whitespace-nowrap">{history.effectiveDate}</TableCell>
                                                        <TableCell className="py-2 font-mono font-semibold text-slate-900 whitespace-nowrap">₹{parseFloat(history.fee || 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell className="py-2 text-slate-500 whitespace-nowrap">{history.durationLabel || durationLabel(history.duration)}</TableCell>
                                                        <TableCell className="py-2 font-mono text-slate-500 whitespace-nowrap">₹{parseFloat(history.discount || 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell className="py-2 text-slate-700 whitespace-nowrap">{history.setBy || '—'}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-4 text-xs text-slate-400">No fee history recorded for this program</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t bg-slate-50/70 px-4 sm:px-6 py-3.5 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 italic text-center sm:text-left">
                        Changes take effect on the specified effective date.
                    </span>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isEditing ? (
                            <>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 h-8 min-w-[70px] rounded-[7.5px] disabled:opacity-60"
                                >
                                    {submitting ? "Saving..." : "Save"}
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormErrors({});
                                        resetFormToLatestData();
                                    }}
                                    className="bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs px-4 h-8 rounded-[7.5px]"
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    onClick={() => {
                                        setIsEditing(true);
                                        setFormErrors({});
                                    }} 
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 h-8 min-w-[70px] rounded-[7.5px] disabled:opacity-60"
                                >
                                    Edit
                                </Button>
                                <Button 
                                    onClick={() => setOpen(false)}
                                    className="bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs px-4 h-8 rounded-[7.5px]"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProgramFeeDialog;