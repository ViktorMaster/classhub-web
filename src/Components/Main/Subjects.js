import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef } from 'react';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    let role = '';

    useEffect(() => {
        let isMounted = true;

        const getSubjects = async () => {
            try {
                const decoded = jwtDecode(Cookies.get('jwt'));
                role = decoded.roles;
                if (role === 'ROLE_ADMINISTRATOR') {
                    const response = await axiosPrivate.get(`/teaching-subjects`);
                    isMounted && setSubjects(response.data);
                } else if (role  === 'ROLE_TEACHER') {
                    const response = await axiosPrivate.get(`/teachers/${decoded.id}/subjects`);
                    isMounted && setSubjects(response.data);
                } else if (role === 'ROLE_STUDENT') {
                    const response = await axiosPrivate.get(`/students/${decoded.id}/subjects`);
                    isMounted && setSubjects(response.data);
                } else {
                    console.error("aaaaaaaaaaaaab");
                    navigate('/sign-in', { state: { from: location }, replace: true });
                }
            } catch (err) {
                console.error(err);
                navigate('/sign-in', { state: { from: location }, replace: true });
            }
        }

        getSubjects();

        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <div className='container'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) =>
                        <tr>
                            <td>{subject.name}</td>
                            <td>{subject.description}</td>
                            if (role === 'ROLE_ADMINISTRATOR') {
                                <td>AAAAAAAAAAAA</td>
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Subjects;