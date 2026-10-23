// claude code generated
// ───────────── ORIGINAL CODE (commented out; kept for rollback) ─────────────
// import { Navigate, Outlet } from "react-router-dom";
// import { getToken, getUserRole, isTokenExpired } from "@/utils/tokenUtility";
//
// const AuthGuard = ({allowedRole}) => {
//     const token = getToken();
//     const role = getUserRole();
//     // claude code generated
//     // console.log("allowedRole is: ",allowedRole);
//     // claude code generated
//     // console.log("token is deleted ?. ",token);
//
// if(!token) {
//   // claude code generated
//   // console.log("!token in AuthGuard.jsx");
//     return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
// }
//
// if(isTokenExpired()) {
// // claude code generated
// // console.log("isTokenExpired in AuthGuard.jsx");
// return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
// }
//
//
//
// return <Outlet />;
// }
//
//
// export default  AuthGuard;
// ───────────── END ORIGINAL CODE ─────────────

// claude code generated
// ───────────── NEW CODE: existing checks + role check against allowedRole ─────────────
import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserRole, isTokenExpired, getOtpStaff } from "@/utils/tokenUtility";

// claude code generated
// Which token roles each route group accepts (ADMIN users use the Staff dashboard)
const ROLE_ACCESS = {
    STAFF: ["STAFF", "ADMIN"],
    INSTRUCTOR: ["INSTRUCTOR"],
    STUDENT: ["STUDENT"],
};

// claude code generated
// Where to send a logged-in user who opens another role's page
const HOME_BY_ROLE = {
    STAFF: "/Staff-dashboard",
    ADMIN: "/Staff-dashboard",
    INSTRUCTOR: "/Instructor-dashboard",
    STUDENT: "/student-dashboard",
};

const AuthGuard = ({allowedRole}) => {
    const token = getToken();
    const role = getUserRole();
    // claude code generated
    // console.log("allowedRole is: ",allowedRole);
    // claude code generated
    // console.log("token is deleted ?. ",token);

if(!token) {
  // claude code generated
  // console.log("!token in AuthGuard.jsx");
    return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
}

if(isTokenExpired()) {
 // claude code generated
 // console.log("isTokenExpired in AuthGuard.jsx");
return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
}

// claude code generated
// Block users whose token role is not allowed on this route group
const userRole = Array.isArray(role) ? role[0] : role;
const normalizedUserRole = userRole?.toUpperCase();

const getSessionRoles = () => {
    try {
        const savedUser = getOtpStaff() || {};
        const roleInfo = savedUser?.role;
        if (!roleInfo) return [];
        if (Array.isArray(roleInfo)) {
            return roleInfo.filter(Boolean).map((r) => String(r).toUpperCase());
        }
        return [String(roleInfo).toUpperCase()];
    } catch {
        return [];
    }
};
const sessionRoles = getSessionRoles();

// Allow if token role matches OR if user has both roles in session and is switching
const allowedByToken = ROLE_ACCESS[allowedRole]?.includes(normalizedUserRole);
const allowedBySession = allowedRole === "STAFF" 
    ? (sessionRoles.includes("ADMIN") || sessionRoles.includes("STAFF"))
    : allowedRole === "INSTRUCTOR"
        ? sessionRoles.includes("INSTRUCTOR")
        : allowedByToken;

if (!allowedByToken && !allowedBySession) {
    return <Navigate to={HOME_BY_ROLE[normalizedUserRole] || "/"} replace />
}

return <Outlet />;
}


export default  AuthGuard;
// claude code generated
// ───────────── END NEW CODE ─────────────
