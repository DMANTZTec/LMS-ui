import  { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// claude code generated
const sessionStorageAdapter = createJSONStorage(() => sessionStorage);

// Stores the JWT token in localStorage under the key "LmsJwTtoken"
      export const LmsJwTtokenAtom = atomWithStorage('LmsJwTtoken', null, undefined, {getOnInit: true});
//export const LmsJwTtokenAtom = atomWithStorage('LmsJwTtoken', null);
// claude code generated
// Stores the logged-in staff's id in localStorage under the key "staffId"
export const staffIdAtom = atomWithStorage('staffId', null, undefined, { getOnInit: true });

// claude code generated
// Stores the staff OTP/login session payload in sessionStorage under the key "otpStaff"
      //export const otpStaffAtom = atomWithStorage('otpStaff', null, sessionStorageAdapter);
export const otpStaffAtom = atomWithStorage('otpStaff', null, sessionStorageAdapter, { getOnInit: true });
// claude code generated
// Stores the student OTP/login session payload in sessionStorage under the key "otpUser"
export const otpUserAtom = atomWithStorage('otpUser', null, sessionStorageAdapter, { getOnInit: true });

// claude code generated
// Stores the student registration/profile payload in sessionStorage under the key "stuRegData"
      //export const stuRegDataAtom = atomWithStorage('stuRegData', null, sessionStorageAdapter);
export const stuRegDataAtom = atomWithStorage('stuRegData', null, sessionStorageAdapter, { getOnInit: true });
// Stores the last successfully submitted student payload
export const studentDataAtom = atom(null);

// 'idle' | 'submitting' | 'success' | 'error'
export const student_registrationStatusAtom = atom("idle");

// Stores server-side error message (e.g. "Email already exists")
export const student_registrationServerErrorAtom = atom(null);
