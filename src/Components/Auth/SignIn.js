import './Auth.css'
import { useState, useEffect } from 'react';
import { AtOutline, LockClosedOutline } from 'react-ionicons';
import axios from '../../api/axios';
import Cookies from 'js-cookie';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/subjects";

    useEffect(() => {
        document.title = "Sign In";
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/sign-in',
                                              JSON.stringify({ username: username, pwd: password}),
                                              {
                                                headers: { 'Content-Type': 'application/json' }
                                              });
            Cookies.set('token', response.data.jwt, { expires: 7, secure: true });
            setUsername('');
            setPassword('');
            navigate(from, { replace: true});
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
                <h1>Sign In</h1>
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
                <button>Sign In</button>
                <div className='register'>
                    <p>Don't have an account yet? <Link to='/sign-up'>Sign Up</Link></p>
                </div>
            </form>
        </section>
    );
};

export default SignIn;