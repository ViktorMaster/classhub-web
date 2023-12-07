import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Users({ option }) {
    return (
        <div>
            { option === 'all' && <All /> }
            { option === 'assign' && <AssignToSubject /> }
        </div>
    );
}

function All() {
    const [users, setUsers] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        document.title = "Users";
    }, []);

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/users`);
                isMounted && setUsers(response.data.filter((user) => user.role !== 'ROLE_ADMINISTRATOR'));
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
            }
        }

        getUsers();

        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <section>
            <div className='container'>
                <h1>Users list</h1>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Link to='/users/register'><button>Add</button></Link>
            </div>
        </section>
    );
}

function AssignToSubject() {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`users`);
                isMounted && setUsers(response.data.filter((user) => user.role !== 'ROLE_ADMINISTRATOR'));
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
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
                    await axiosPrivate.post('/students-subjects', JSON.stringify({ teachingSubjectId: id, studentId: userId}));
                } else if (role === 'ROLE_TEACHER') {
                    await axiosPrivate.post('/teaching-subject/teacher', JSON.stringify({ teacherId: userId, subjectId: id}));
                }
            };
            setSelectedIds([]);
            setScsMsg('You assigned users!!!');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response?.message);
            }
        }
    };

    return (
        <section>
            <div className='container'>
                <h1>Assign student/teacher to subject {location.state}</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
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
                            <td><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={handleSubmit}>Assign</button>
            </div>
        </section>
    );
}

export default Users;