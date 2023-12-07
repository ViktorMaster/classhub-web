import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AtOutline, LockClosedOutline } from 'react-ionicons';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        document.title = "Registration";
    }, []);

    useEffect(() => {
        setErrMsg('');
        setScsMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'ROLE_STUDENT') {
                await axiosPrivate.post('/admins/sign-student', JSON.stringify({ username: username, pwd: password }));
            } else {
                await axiosPrivate.post('/admins/sign-teacher', JSON.stringify({ username: username, pwd: password }));
            }
            setUsername('');
            setPassword('');
            setRole('');
            setScsMsg('You have registered a new user!!!');
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
            <form onSubmit={handleSubmit}>
                <h1>Register user</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className='inputbox'>
                    <AtOutline className='ion-icon' color={'#000000'} width={'1.4rem'} height={'1.4rem'} />
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <label for=''>Username</label>
                </div>
                <div className='inputbox'>
                    <LockClosedOutline className='ion-icon' color={'#000000'} width={'1.4rem'} height={'1.4rem'} />
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label for=''>Password</label>
                </div>
                <div className='horizontalBlock'>
                    <label>Role</label>
                    <label className='radio'>
                        <input
                            className='radio'
                            type="radio"
                            value='ROLE_STUDENT'
                            name='role'
                            checked={role === 'ROLE_STUDENT'}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                        <span>Student</span>
                    </label>
                    <label className='radio'>
                        <input
                            className='radio'
                            type="radio"
                            value='ROLE_TEACHER'
                            name='role'
                            checked={role === 'ROLE_TEACHER'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <span>Teacher</span>
                    </label>
                </div>
                <br/>
                <hr noshade='' />
                <button>Register</button>
            </form>
        </section>
    );
}

export default Registration;