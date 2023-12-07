import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link, useOutletContext } from 'react-router-dom';
import { PersonAddOutline } from 'react-ionicons'

function Subjects() {
    const [subjects, setSubjects] = useState([{id: 1, name: 'VM', description: 'JJJJJJJОООООООООООООООО', year: 2023, semester: 1}]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const role = useOutletContext()?.role;
    const id = useOutletContext()?.id;
    const isAdmin = role === 'ROLE_ADMINISTRATOR';

    useEffect(() => {
        document.title = "Subjects";
    }, []);

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
                }
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
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
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Year</th>
                        <th>Semester</th>
                    </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td><Link to={`/subjects/${subject.id}/tasks`} state={subject.name}>{subject.name}</Link></td>
                            <td>{subject.description}</td>
                            <td>{subject.year}</td>
                            <td>{subject.semester}</td>
                            {isAdmin && <td><Link state={subject.name} to={`/subjects/${subject.id}/assign`}><PersonAddOutline /></Link></td>}
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