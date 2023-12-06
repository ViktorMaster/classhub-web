import {useState, useEffect} from 'react';
import {useNavigate, useLocation, Link, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Users({option}) {
    return (
        <div>
            {option === 'all' && <All/>}
            {option === 'assign' && <AssignToSubject/>}
        </div>
    );
}

function All() {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/users`);
                isMounted && setUsers(response.data);
            } catch (err) {
                navigate('/sign-in', {state: {from: location}, replace: true});
            }
        }

        getUsers();

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
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Link to='/users/register'>
                <button>Add</button>
            </Link>
        </div>
    );
}

function AssignToSubject() {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedIds, setSelectedIds] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const {id} = useParams();

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`users`);
                isMounted && setUsers(response.data);
            } catch (err) {
                navigate('/sign-in', {state: {from: location}, replace: true});
            }
        }

        getUsers();

        return () => {
            isMounted = false;
        }
    }, []);

    const handleCheckboxChange = (id) => {
        const updatedIds = [...selectedIds];

        const index = updatedIds.indexOf(id);

        if (index !== -1) {
            updatedIds.splice(index, 1);
        } else {
            updatedIds.push(id);
        }

        setSelectedIds(updatedIds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            for (const userId of selectedIds) {
                const role = users.find((user) => user.id === userId).role;
                if (role === 'ROLE_STUDENT') {
                    await axiosPrivate.post('/student-subjects', JSON.stringify({
                        teachingSubjectId: id,
                        studentId: userId
                    }));
                } else if (role === 'ROLE_TEACHER') {
                    await axiosPrivate.post('/teaching-subjects/teacher', JSON.stringify({
                        teacherId: userId,
                        subjectId: id
                    }));
                }
            }
            setSelectedIds([]);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response?.message);
            }
        }
    };

    return (
        <div className='container'>
            <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td><input type="checkbox" checked={selectedIds.includes(user.id)}
                                   onChange={() => handleCheckboxChange(user.id)}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handleSubmit}>Assign</button>
        </div>
    );
}

export default Users;