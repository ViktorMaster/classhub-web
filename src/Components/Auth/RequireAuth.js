import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

function RequireAuth({ allowedRoles }) {
    const token = Cookies.get('jwt');
    const location = useLocation();

    try {
        const decoded = jwtDecode(token);
        if (allowedRoles?.includes(decoded?.roles)) {
            return <Outlet context={{ role: decoded?.roles, id: decoded?.id }}/>;
        } else if (jwtDecode(token)?.sub) {
            return <Navigate to='/unauthorized' state={{ from: location }} replace />;
        } else {
            return <Navigate to='/sign-in' state={{ from: location }} replace />;
        }
    } catch(err) {
        return <Navigate to='/sign-in' state={{ from: location }} replace />;
    }
}

export default RequireAuth;