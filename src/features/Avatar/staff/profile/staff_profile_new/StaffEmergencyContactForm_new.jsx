import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffApi } from "@/api/staff-controller.api";

import { StaffEmergencyContactSchema } from "./StaffProfileScheema_new";

const simulateRequest = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FIELDS = [
  { name: "emergencyContactNm", label: "Contact name", placeholder: "Full name" },
  { name: "emergencyContactNum", label: "Phone number", placeholder: "+91 91234 56780", inputMode: "tel" },
];

const toFormValues = (staff) =>
  Object.fromEntries(FIELDS.map(({ name }) => [name, staff?.[name] ?? ""]));

// The update endpoint is a PUT that replaces the whole record, so send every field and override only the emergency contact
const buildPayload = (staff, values) => ({
  firstNm: staff.firstNm,
  lastNm: staff.lastNm,
  emailId: staff.email,
  mobileNum: staff.mobileNum,
  gender: staff.gender,
  dob: staff.dob,
  designation: staff.designation,
  dateOfJoining: staff.dateOfJoining,
  roles: Array.from(staff.roles ?? []),
  addr1: staff.addr1,
  addr2: staff.addr2,
  city: staff.city,
  state: staff.state,
  country: staff.country,
  pin: staff.pin,
  emergencyContactNm: values.emergencyContactNm,
  emergencyContactNum: values.emergencyContactNum,
});

/**
 * Inline edit form for the "Emergency contact" section of the staff profile.
 * demoMode: simulate the save instead of calling the backend; onSaved still receives the new values.
 */
export default function StaffEmergencyContactForm({ staff, staffId, demoMode = false, onSaved, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(StaffEmergencyContactSchema),
    defaultValues: toFormValues(staff),
    mode: "onTouched",
  });

  const saveMutation = useMutation({
    mutationFn: (values) =>
      demoMode ? simulateRequest(1000) : staffApi.updateStaff1(staffId, buildPayload(staff, values)),
    onSuccess: (_, values) => {
      toast.success("Emergency contact updated.");
      onSaved?.(values);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update emergency contact.");
    },
  });

  const isSaving = saveMutation.isPending;

  return (
    <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))} noValidate>
      <div className="space-y-3">
        {FIELDS.map(({ name, label, placeholder, inputMode }) => {
          const id = `emergency-${name}`;
          const error = errors[name]?.message;
          return (
            <div key={name}>
              <Label htmlFor={id} className="mb-1.5 text-slate-600">
                {label}
              </Label>
              <Input
                id={id}
                placeholder={placeholder}
                inputMode={inputMode}
                disabled={isSaving}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className="h-9 bg-white text-slate-900"
                {...register(name)}
              />
              {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
