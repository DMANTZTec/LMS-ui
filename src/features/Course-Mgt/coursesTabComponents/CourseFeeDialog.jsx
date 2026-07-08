import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IndianRupee, BookOpen, History } from 'lucide-react';
import { feeApi } from '@/api/course-fee-controller';
import toast from "react-hot-toast";


const DURATION_OPTIONS = [
    { value: "TWO_WEEKS", label: "2 Weeks" },
    { value: "FOUR_WEEKS", label: "4 Weeks" },
    { value: "SIX_WEEKS", label: "6 Weeks" },
    { value: "EIGHT_WEEKS", label: "8 Weeks" },
    { value: "TEN_WEEKS", label: "10 Weeks" },
    { value: "TWELVE_WEEKS", label: "12 Weeks" },
    { value: "FOURTEEN_WEEKS", label: "14 Weeks" },
    { value: "SIXTEEN_WEEKS", label: "16 Weeks" },
    { value: "EIGHTEEN_WEEKS", label: "18 Weeks" },
    { value: "TWENTY_WEEKS", label: "20 Weeks" },
];

const CourseFeeDialog = ({ course }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const queryClient = useQueryClient();

    const [formValues, setFormValues] = useState({
        fee: "0",
        discount: "0",
        duration: "TWO_WEEKS",
        effectiveDate: new Date().toISOString().split('T')[0]
    });

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const staffId = savedUser?.staffId || "SF00003";

  
    const { data: feeData, isLoading, refetch } = useQuery({
        queryKey: ['courseFee', course.courseId],
        queryFn: async () => {
            const response = await feeApi.getCourseFeeSetting(course.courseId);
            return response.data;
        },
        enabled: open, 
    });

    
    useEffect(() => {
        if (feeData) {
            setFormValues({
                fee: feeData.currentFee?.fee ?? "0",
                discount: feeData.currentFee?.discount ?? "0",
                duration: feeData.currentFee?.courseDuration ?? course.courseDuration ?? null,
                effectiveDate: feeData.currentFee?.effectiveDate ?? new Date().toISOString().split('T')[0]
            });
        }
    }, [feeData]);

    useEffect(() => {
        if (!open) {
            setIsEditing(false);
            setFormErrors({});
        } else {
            refetch();
        }
    }, [open, refetch]);

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
            errors.duration = "Select a course duration.";
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
            courseDuration: formValues.duration
        };

        try {
            if (feeData?.currentFee && feeData?.feeHistory?.length > 0) {
                await feeApi.updateCourseFee(course.courseId, staffId, payload);
            } else {
                await feeApi.createCourseFee(course.courseId, staffId, payload);
            }

            setIsEditing(false);
            setFormErrors({});
            toast.success("Course fee saved successfully.");
            // Invalidate cache context to force structural updates in dialog AND parent list cell automatically
            queryClient.invalidateQueries({ queryKey: ['courseFee', course.courseId] });
            setOpen(false);
        } catch (error) {
            console.error("Failed handling fee submission details:", error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const displayHistory = feeData?.feeHistory || [];

    const durationLabel = (value) => {
        if (!value) return "0 Weeks";
        return DURATION_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size="icon" title="Course Fee Settings">
                    <IndianRupee className="w-5 h-5 text-amber-600 cursor-pointer hover:scale-110 transition-transform" />
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white rounded-xl shadow-2xl">
                <div className="p-4 pb-4 border-b flex justify-between items-start bg-slate-50/50">
                    <div className="flex gap-3 items-center">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                            <DialogTitle className="font-inter font-semibold text-[15px] text-slate-800">
                                Course Fee Setting
                            </DialogTitle>
                            <p className="mt-0.5 font-normal text-[11.25px] text-muted-foreground">
                                Manage and update course pricing
                            </p>
                        </div>
                    </div>
                </div>

                {(isLoading || submitting) && (
                    <div className="p-8 text-center text-sm text-slate-500">Processing records...</div>
                )}

                {(!isLoading && !submitting) && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-[30%_70%] gap-4 text-xs">
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 font-medium">COURSE ID</Label>
                                <Input value={course.courseId} disabled className="bg-slate-50/70 border-slate-200 text-slate-700 disabled:opacity-100 h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 font-medium">COURSE NAME</Label>
                                <Input value={feeData?.courseTitle || course.courseTitle} disabled className="bg-slate-50/70 border-slate-200 text-slate-700 disabled:opacity-100 h-9" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 font-medium">SUBJECT</Label>
                                <Input value={feeData?.subjectNm || course.subjectNm} disabled className="bg-slate-50/70 border-slate-200 text-slate-700 disabled:opacity-100 h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 font-medium">COURSE DURATION</Label>
                                {isEditing ? (
                                    <Select
                                        value={formValues.duration ?? undefined}
                                        onValueChange={(value) => {
                                            setFormValues({ ...formValues, duration: value });
                                            if (formErrors.duration) setFormErrors({ ...formErrors, duration: undefined });
                                        }}
                                    >
                                        <SelectTrigger className={`h-9 w-full box-border font-medium bg-white shrink-0 ${formErrors.duration ? 'border-red-400' : 'border-blue-400'}`}>
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
                                        className="bg-slate-50/70 border-slate-200 text-slate-700 disabled:opacity-100 h-9"
                                    />
                                )}
                                {formErrors.duration && (
                                    <p className="text-red-500 text-[10px] font-normal">{formErrors.duration}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 font-medium">EFFECTIVE DATE</Label>
                                <Input 
                                    type="date"
                                    value={formValues.effectiveDate} 
                                    onChange={(e) => {
                                        setFormValues({...formValues, effectiveDate: e.target.value});
                                        if (formErrors.effectiveDate) setFormErrors({ ...formErrors, effectiveDate: undefined });
                                    }}
                                    disabled={!isEditing} 
                                    className={`h-9 font-medium transition-colors ${isEditing ? (formErrors.effectiveDate ? 'bg-white border-red-400' : 'bg-white border-blue-400') : 'bg-slate-50 text-slate-700 disabled:opacity-100'}`}
                                />
                                {formErrors.effectiveDate && (
                                    <p className="text-red-500 text-[10px] font-normal">{formErrors.effectiveDate}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs border-t pt-4">
                            <div className="space-y-1.5">
                                <Label className="text-slate-500 font-semibold">FEE (₹)</Label>
                                <Input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formValues.fee} 
                                    onChange={(e) => {
                                        setFormValues({...formValues, fee: e.target.value});
                                        if (formErrors.fee) setFormErrors({ ...formErrors, fee: undefined });
                                    }}
                                    disabled={!isEditing} 
                                    className={`h-9 font-medium transition-colors ${isEditing ? (formErrors.fee ? 'bg-white border-red-400' : 'bg-white border-blue-400') : 'bg-slate-50 text-slate-700 disabled:opacity-100'}`}
                                />
                                {formErrors.fee && (
                                    <p className="text-red-500 text-[10px] font-normal">{formErrors.fee}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-500 font-semibold">DISCOUNT (₹)</Label>
                                <Input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formValues.discount} 
                                    onChange={(e) => {
                                        setFormValues({...formValues, discount: e.target.value});
                                        if (formErrors.discount) setFormErrors({ ...formErrors, discount: undefined });
                                    }}
                                    disabled={!isEditing} 
                                    className={`h-9 font-medium transition-colors ${isEditing ? (formErrors.discount ? 'bg-white border-red-400' : 'bg-white border-blue-400') : 'bg-slate-50 text-slate-700 disabled:opacity-100'}`}
                                />
                                {formErrors.discount && (
                                    <p className="text-red-500 text-[10px] font-normal">{formErrors.discount}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 tracking-wide uppercase">
                                <History className="w-3.5 h-3.5" />
                                <span>Fee History</span>
                            </div>
                            
                            <div className="border rounded-lg overflow-hidden max-h-[160px] overflow-y-auto shadow-inner">
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 shadow-sm z-10">
                                        <TableRow className="text-[11px] font-medium text-slate-500 hover:bg-transparent">
                                            <TableHead className="h-8 text-slate-500">S/N</TableHead>
                                            <TableHead className="h-8 text-slate-500 ">EFFECTIVE DATE</TableHead>
                                            <TableHead className="h-8 text-right text-slate-500">FEE</TableHead>
                                            <TableHead className="h-8 text-right text-slate-500">DISCOUNT</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayHistory.length > 0 ? (
                                            displayHistory.map((history, i) => (
                                                <TableRow key={i} className="text-[11px] text-slate-500 border-b hover:bg-slate-50/50">
                                                    <TableCell className="py-2 font-mono">{String(history.serialNumber || i + 1).padStart(2, '0')}</TableCell>
                                                    <TableCell className="py-2 font-mono text-slate-900">{history.effectiveDate}</TableCell>
                                                    <TableCell className="py-2 text-right font-mono font-medium text-slate-900">₹{parseFloat(history.fee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                                    <TableCell className="py-2 text-right font-mono font-semibold text-emerald-600">₹{parseFloat(history.discount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-4 text-xs text-slate-400">No modification logs logged for this track profile</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4 mt-2">
                            <span className="text-xs text-slate-400 font-medium">
                                {displayHistory.length} records in history
                            </span>
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <Button 
                                            onClick={handleSave} 
                                            disabled={submitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 h-8 min-w-[70px] rounded-[7.5px] disabled:opacity-60"
                                        >
                                            {submitting ? "Saving..." : "Save"}
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormErrors({});
                                                if (feeData) {
                                                    setFormValues({
                                                        fee: feeData.currentFee?.fee ?? "0",
                                                        discount: feeData.currentFee?.discount ?? "0",
                                                        duration: feeData.currentFee?.courseDuration ?? course.courseDuration ?? null,
                                                        effectiveDate: feeData.currentFee?.effectiveDate ?? ""
                                                    });
                                                }
                                            }}
                                            className="bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs px-5 h-8 rounded-[7.5px]"
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
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 h-8 min-w-[70px] rounded-[7.5px]"
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            onClick={() => setOpen(false)}
                                            className="bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs px-5 h-8 rounded-[7.5px]"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CourseFeeDialog;