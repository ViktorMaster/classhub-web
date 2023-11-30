import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useLocation, Navigate, Outlet} from 'react-router-dom';

function RequireAuth({ allowedRoles }) {
    const token = Cookies.get('jwt');
    const location = useLocation();
    if (token) {
        jwtDecode(token)?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to='/unauthorized' state={{ from: location }} replace />
    } else {
        <Navigate to='/sign-in' state={{ from: location }} replace />
    }
}