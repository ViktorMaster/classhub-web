import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import { PersonAddOutline } from 'react-ionicons'

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const role = useOutletContext()?.role;
    const id = useOutletContext()?.id;
    const isAdmin = role === 'ROLE_ADMINISTRATOR';

    useEffect(() => {
        let isMounted = true;

        const getSubjects = async () => {
            try {
                if (role  === 'ROLE_ADMINISTRATOR') {
                    const response = await axiosPrivate.get(`/teaching-subjects`);
                    isMounted && setSubjects(response.data);
                } else if (role   === 'ROLE_TEACHER') {
                    const response = await axiosPrivate.get(`/teachers/${id}/subjects`);
                    isMounted && setSubjects(response.data);
                } else if (role  === 'ROLE_STUDENT') {
                    const response = await axiosPrivate.get(`/students/${id}/subjects`);
                    isMounted && setSubjects(response.data);
                } else {
                    navigate('/sign-in', { state: { from: location }, replace: true });
                }
            } catch (err) {
                navigate('/sign-in', { state: { from: location }, replace: true });
            }
        }

        getSubjects();
        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <section>
            <div className='container'>
                <h1>Subjects</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Year</th>
                        <th>Semester</th>
                        {/*isAdmin && <th>Additional Column</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td><Link to={`/subjects/${subject.id}/tasks`}>{subject.name}</Link></td>
                            <td>{subject.description}</td>
                            <td>{subject.year}</td>
                            <td>{subject.semester}</td>
                            {isAdmin && <td><Link to={`/subjects/${subject.id}/assign`}><PersonAddOutline /></Link></td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
                { isAdmin && <Link to='/subjects/add'><button>Add</button></Link> }
            </div>
        </section>
    );
}

export default Subjects;