import useAuth from "../hooks/useAuth";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedUserTypes }) => {
    const { auth } = useAuth();
    const location = useLocation();
    
    const isAllowed = auth?.userTypes?.some(userType => allowedUserTypes?.includes(userType));
    
    if (isAllowed) {
        return <Outlet />;
    } else if (auth?.user) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    } else {
        const isAdminRoute = allowedUserTypes.includes(5150) || allowedUserTypes.includes(1988);
        const redirectPath = isAdminRoute ? "/admin" : "/login";
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
};

export default RequireAuth;
