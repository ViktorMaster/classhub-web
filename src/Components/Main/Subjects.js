import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSubjects = async () => {
            try {
                const userId = jwtDecode(Cookies.get('jwt').id);
                const response = await axiosPrivate.get(`/${userId}/subjects`, {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setSubjects(response.data);
            } catch (err) {
                console.error(err);
                navigate('/sign-in', { state: { from: location }, replace: true });
            }
        }

        getSubjects();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    console.log(subjects)
    return (
        <div className='container'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) =>
                        <tr><td>{subject.name}</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Subjects;