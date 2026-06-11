import  { atom } from 'jotai';

// Stores the last successfully submitted student payload
export const studentDataAtom = atom(null);

// 'idle' | 'submitting' | 'success' | 'error'
export const student_registrationStatusAtom = atom("idle");

// Stores server-side error message (e.g. "Email already exists")
export const student_registrationServerErrorAtom = atom(null);
