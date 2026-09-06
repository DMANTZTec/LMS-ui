import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserRole, isTokenExpired } from "@/utils/tokenUtility";

const AuthGuard = ({allowedRole}) => {
    const token = getToken();
    const role = getUserRole();
    console.log("allowedRole is: ",allowedRole);
    console.log("token is deleted ?. ",token);
    
if(!token) {
  
    return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
}

if(isTokenExpired()) {

return <Navigate to={allowedRole === "STUDENT" ? "/studentLogin": "/staffLogin"} replace />
}   



return <Outlet />;
}


export default  AuthGuard;