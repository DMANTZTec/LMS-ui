import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';





/* get token from localStorage */

export const getToken = () => {
    return localStorage.getItem("LmsJwTtoken");
}

/* save token into localStorage */

export const saveToken = (token) => {
localStorage.setItem("LmsJwTtoken",token);
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
    console.log("Invalid token");
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