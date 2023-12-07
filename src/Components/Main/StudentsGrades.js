import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AddOutline } from 'react-ionicons'

function StudentsGrades() {
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { id, taskId } = useParams();
    const location = useLocation();

    useEffect(() => {
        document.title = "Student`s grades";
    }, []);

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/teaching-subjects/${id}/students`);
                isMounted && setStudents(response.data);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
            }
        }

        const getGrades = async () => {
            try {
                const response = await axiosPrivate.get(`/tasks/${taskId}/grades`);
                isMounted && setGrades(response.data);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
            }
        }

        getUsers();
        getGrades();

        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <section>
            <div className='container'>
                <h1>{location.state}</h1>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                    </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.username}</td>
                            <td>
                                {grades?.find((e) => e.studentId === student.id)?.grade
                                ||
                                <Link to={`/subjects/${id}/tasks/${taskId}/${student.id}`}><AddOutline /></Link>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentsGrades;