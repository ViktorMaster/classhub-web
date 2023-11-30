import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

function RequireAuth({ allowedRoles }) {
    const token = Cookies.get('jwt');
    const location = useLocation();

    try {
        if (allowedRoles?.includes(jwtDecode(token)?.roles)) {
            return <Outlet />;
        } else if (jwtDecode(token)?.sub) {
            return <Navigate to='/unauthorized' state={{ from: location }} replace />;
        } else {
            console.error("aaaaaaaaaaaaaaaaaaa");
            return <Navigate to='/sign-in' state={{ from: location }} replace />;
        }
    } catch(err) {
        console.error(err);
        return <Navigate to='/sign-in' state={{ from: location }} replace />;
    }
}

export default RequireAuth;