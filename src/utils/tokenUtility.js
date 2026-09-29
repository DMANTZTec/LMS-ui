import { jwtDecode } from 'jwt-decode';
import { useAtomValue } from 'jotai';
import { Navigate } from 'react-router-dom';
// claude generated code
import { RESET } from 'jotai/utils';
import appStore from '@/store/appStore';
import {
    LmsJwTtokenAtom,
    staffIdAtom,
    otpStaffAtom,
    otpUserAtom,
    stuRegDataAtom,
} from '@/store/atoms/authAtoms';




/* get token from the LmsJwTtokenAtom (jotai store) */
// claude generated code
export const getToken = () => {
// claude code generated
// console.log("token is: ",appStore.get(LmsJwTtokenAtom));
    return appStore.get(LmsJwTtokenAtom);
    //return appStore.get(LmsJwTtokenAtom) || useAtomValue(LmsJwTtokenAtom) || localStorage.getItem("LmsJwTtoken");
}

/* save token into the LmsJwTtokenAtom (jotai store); atomWithStorage keeps localStorage in sync */
// claude generated code
export const saveToken = (token) => {
    appStore.set(LmsJwTtokenAtom, token);
}

/* get/save the logged-in staff's id (staffIdAtom -> localStorage["staffId"]) */
// claude code generated
export const getStaffId = () => {
    return appStore.get(staffIdAtom);
}
// claude code generated
export const saveStaffId = (staffId) => {
    appStore.set(staffIdAtom, staffId);
}

/* get/save the staff OTP/login session payload (otpStaffAtom -> sessionStorage["otpStaff"]) */
// claude code generated
export const getOtpStaff = () => {
    return appStore.get(otpStaffAtom);
}
// claude code generated
export const saveOtpStaff = (data) => {
    appStore.set(otpStaffAtom, data);
}

/* get/save the student OTP/login session payload (otpUserAtom -> sessionStorage["otpUser"]) */
// claude code generated
export const getOtpUser = () => {
    return appStore.get(otpUserAtom);
}
// claude code generated
export const saveOtpUser = (data) => {
    appStore.set(otpUserAtom, data);
}

/* get/save the student registration/profile payload (stuRegDataAtom -> sessionStorage["stuRegData"]) */
// claude code generated
export const getStuRegData = () => {
    return appStore.get(stuRegDataAtom);
}
// claude code generated
export const saveStuRegData = (data) => {
    appStore.set(stuRegDataAtom, data);
}

/* Logout: reset every auth/session atom (RESET also deletes the underlying localStorage/sessionStorage key) */
// claude code generated
export const clearAllStorage = () => {
    appStore.set(LmsJwTtokenAtom, RESET);
    appStore.set(staffIdAtom, RESET);
    appStore.set(otpStaffAtom, RESET);
    appStore.set(otpUserAtom, RESET);
    appStore.set(stuRegDataAtom, RESET);
}

/* docode Token */
export const decodeToken = () => {
const token = getToken();
    
if(!token) {
    return null;
}

try {
return jwtDecode(token);
} catch(error) {
    // claude code generated
    // console.log("Invalid token");
return null;
}
};

/* check whether Token is expired */

export const isTokenExpired = () => {
const decode = decodeToken();
if(!decode || !decode.exp) {
    return true;
}

return decode.exp * 1000 < Date.now();
};

/* check whether user is logged in or not */

export const isAuthenticated = () => {
    const token = getToken();

    if(!token) {
        return null;
    }

    return !isTokenExpired();
}

export const getUserRole = () => {

const decode = decodeToken();
if(! decode) {
    return null;
}

return decode.role;
}