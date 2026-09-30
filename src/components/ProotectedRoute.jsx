import { Navigate, useLocation, Outlet } from "react-router-dom";
// claude code generated
import { getToken } from "@/utils/tokenUtility";

const ProtectedRoute = ({ role }) => {

    // const token = localStorage.getItem("token");
    // claude code generated
    const token = getToken();
    const location = useLocation();


if(!token) {
    // claude code generated
    // console.log("inside if block of protected route line 1");
    if (role === "STUDENT")
        return <Navigate to="/studentLogin" replace />
    if (role === "STAFF")
        return <Navigate to="/staffLogin" state={{ from: location }} replace />
// claude code generated
// console.log("inside if block of protected route");
}
// claude code generated
// console.log("outside if block of protected route line 2");
    return <Outlet />;
};

export default ProtectedRoute;