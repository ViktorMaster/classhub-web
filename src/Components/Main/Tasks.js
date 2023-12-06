import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useOutletContext, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Tasks() {
    const [tasks, setTasks] = useState([{id: 1, title: 'lab1', description: 'wtf'}]);
    const [grades, setGrades] = useState([{taskId: 2, grade: 1}, {taskId: 1, grade: 5}]);
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const role = useOutletContext()?.role;
    const isAllowed = role === 'ROLE_ADMINISTRATOR' || role === 'ROLE_TEACHER';
    const isStudent = role === 'ROLE_STUDENT';
    const context = useOutletContext();

    useEffect(() => {
        let isMounted = true;

        const getTasks = async () => {
            try {
                const response = await axiosPrivate.get(`/tasks/subjects/${id}`);
                isMounted && setTasks(response.data);
            } catch (err) {
                navigate('/sign-in', { state: { from: location }, replace: true });
            }
        }

        const getGrades = async () => {
            if (isStudent) {
                try {
                    const response = await axiosPrivate.get(`/grades/student/${context?.id}`);
                    isMounted && setTasks(response.data);
                } catch (err) {
                    navigate('/sign-in', { state: { from: location }, replace: true });
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
        <div className='container'>
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
                        {isAllowed && <td><Link to={`/subjects/${id}/tasks/${task.id}`}>{task.title}</Link></td>}
                        {!isAllowed && <td>{task.title}</td>}
                        <td>{task.description}</td>
                        {isStudent && <td>{grades.find((e) => e.taskId === task.id).grade}</td>}
                    </tr>
                ))}
                </tbody>
            </table>
            {isAllowed && <Link to={`/subjects/${id}/tasks/add`}><button>Add</button></Link>}
        </div>
    );
}

export default Tasks;