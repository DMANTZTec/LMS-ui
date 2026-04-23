import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

    const token = localStorage.getItem("token");
    const location = useLocation(); 


if(!token) {
    console.log("inside if block of protected route line 1");
    if (role === "STUDENT")
        return <Navigate to="/studentLogin" replace />
    if (role === "STAFF")
        return <Navigate to="/staffLogin" state={{ from: location }} replace />
console.log("inside if block of protected route");
}
console.log("outside if block of protected route line 2");
    return children;
};

export default ProtectedRoute;