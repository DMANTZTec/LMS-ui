import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserRole, isTokenExpired } from "@/utils/tokenUtility";

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



return <Outlet />;
}


export default  AuthGuard;