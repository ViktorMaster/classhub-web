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

    const role = useRef(jwtDecode(Cookies.get('jwt')).roles) ;

//    useEffect(() => {
//        let isMounted = true;
//
//        const getSubjects = async () => {
//            try {
//                const decoded = jwtDecode(Cookies.get('jwt'));
//                role.current = decoded.roles;
//                if (role.current  === 'ROLE_ADMINISTRATOR') {
//                    const response = await axiosPrivate.get(`/teaching-subjects`);
//                    isMounted && setSubjects(response.data);
//                } else if (role.current   === 'ROLE_TEACHER') {
//                    const response = await axiosPrivate.get(`/teachers/${decoded.id}/subjects`);
//                    isMounted && setSubjects(response.data);
//                } else if (role.current  === 'ROLE_STUDENT') {
//                    const response = await axiosPrivate.get(`/students/${decoded.id}/subjects`);
//                    isMounted && setSubjects(response.data);
//                } else {
//                    navigate('/sign-in', { state: { from: location }, replace: true });
//                }
//            } catch (err) {
//                navigate('/sign-in', { state: { from: location }, replace: true });
//            }
//        }
//
//        getSubjects();
//        return () => {
//            isMounted = false;
//        }
//    }, []);

    const addSubject = async () => {

    };


    return (
        <div className='container'>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    {role.current === 'ROLE_ADMINISTRATOR' && <th>Additional Column</th>}
                </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                    <tr key={subject.id}>
                        <td>{subject.name}</td>
                        <td>{subject.description}</td>
                        <td>{subject.year}</td>
                        <td>{subject.semester}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            { role.current  === 'ROLE_ADMINISTRATOR' && <button>Add</button> }
        </div>
    );
}

export default Subjects;