// claude code generated
// Role-based guard for the two staff profile pages:
//   ADMIN               -> /staffProfile      (StaffProfile)
//   STAFF / INSTRUCTOR  -> /staffProfile_new  (StaffProfile_new)
// Token/expiry/role checks are still done by the existing AuthGuard.
import { Navigate } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import { getOtpStaff } from "@/utils/tokenUtility";

const StaffProfileGuard = ({ adminOnly = false }) => {
    // Same role reading as StaffNavbarAvatar (role may be a string or an array)
    const roles = [].concat(getOtpStaff()?.role ?? []).map((r) => String(r).toUpperCase());
    const isAdmin = roles.includes("ADMIN");

    if (adminOnly && !isAdmin) return <Navigate to="/staffProfile_new" replace />;
    // ADMIN + INSTRUCTOR users may open /staffProfile_new (from the instructor dashboard)
    // if (!adminOnly && isAdmin) return <Navigate to="/staffProfile" replace />;
    if (!adminOnly && isAdmin && !roles.includes("INSTRUCTOR")) return <Navigate to="/staffProfile" replace />;

    // Instructor-only users are checked as INSTRUCTOR, everyone else as STAFF
    const allowedRole = isAdmin || roles.includes("STAFF") ? "STAFF" : "INSTRUCTOR";
    return <AuthGuard allowedRole={allowedRole} />;
};

export default StaffProfileGuard;
