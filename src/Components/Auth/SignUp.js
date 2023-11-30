import './Auth.css'
import { useState, useEffect } from 'react';
import { AtOutline, LockClosedOutline } from 'react-ionicons';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    useEffect(() => {
        document.title = "Sign Up";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/sign-up',
                                              JSON.stringify({ username: username, pwd: password}),
                                              {
                                                headers: { 'Content-Type': 'application/json' }
                                              });
            console.log(response.data);
            setUsername('');
            setPassword('');
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
                <h1>Sign Up</h1>
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
                <button>Sign up</button>
                <div className='register'>
                    <p>Already have an account? <Link to='/sign-in'>Sign In</Link></p>
                </div>
            </form>
        </section>
    );
};

export default SignUp;