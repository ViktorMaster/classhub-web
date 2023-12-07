import { useState, useEffect } from 'react';
import { useLocation, Link, useOutletContext, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [grades, setGrades] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const role = useOutletContext()?.role;
    const location = useLocation();
    const isAllowed = role === 'ROLE_ADMINISTRATOR' || role === 'ROLE_TEACHER';
    const isStudent = role === 'ROLE_STUDENT';
    const context = useOutletContext();

    useEffect(() => {
        document.title = "Tasks";
    }, []);

    useEffect(() => {
        let isMounted = true;

        const getTasks = async () => {
            try {
                const response = await axiosPrivate.get(`/tasks/subjects/${id}`);
                isMounted && setTasks(response.data);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
            }
        }

        const getGrades = async () => {
            if (isStudent) {
                try {
                    const response = await axiosPrivate.get(`/grades/student/${context?.id}`);
                    isMounted && setTasks(response.data);
                } catch (err) {
                    if (!err?.response) {
                        setErrMsg('No Server Response');
                    } else {
                        setErrMsg(err.response?.message);
                    }
                }
            }
        }

        getTasks();
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
                        <th>Title</th>
                        <th>Description</th>
                        {isStudent && <th>Grade</th>}
                    </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                        <tr key={task.id}>
                            {isAllowed && <td><Link to={`/subjects/${id}/tasks/${task.id}`} state={task.title}>{task.title}</Link></td>}
                            {!isAllowed && <td>{task.title}</td>}
                            <td>{task.description}</td>
                            {isStudent && <td>{grades.find((e) => e.taskId === task.id).grade}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {isAllowed && <Link to={`/subjects/${id}/tasks/add`}><button>Add</button></Link>}
            </div>
        </section>
    );
}

export default Tasks;