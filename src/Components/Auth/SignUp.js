import {useState, useEffect} from 'react';
import {AtOutline, LockClosedOutline} from 'react-ionicons';
import axios from '../../api/axios';
import {Link} from 'react-router-dom';
import {TailSpin} from 'react-loader-spinner'

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('You have successfully signed up!');

    useEffect(() => {
        setErrMsg('');
        setScsMsg('');
    }, [username, password]);

    useEffect(() => {
        document.title = "Sign Up";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.length < 4 || username.length > 32) {
            setErrMsg('Username must be from 4 to 32 characters');
            return;
        }
        if (password.length < 6 || password.length > 32) {
            setErrMsg('Password must be from 6 to 32 characters');
            return;
        }

        try {
            await axios.post('/auth/sign-up',
                JSON.stringify({username: username, pwd: password}),
                {
                    headers: {'Content-Type': 'application/json'}
                });
            setScsMsg('You have successfully signed up!');
            setUsername('');
            setPassword('');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err?.response?.message) {
                setErrMsg(err.response?.message);
            } else {
                setErrMsg(`Code: ${err.response?.code}`)
            }
        }

    };

    return (
        <div className='main'>
            <div className='content'>
                <section>
                    <form onSubmit={handleSubmit}>
                        <h1>Sign Up</h1>
                        <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
                        <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                        <div className='inputbox'>
                            <AtOutline className='ion-icon' color={'#000000'} width={'1.4rem'} height={'1.4rem'}/>
                            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            <label for=''>Username</label>
                        </div>
                        <div className='inputbox'>
                            <LockClosedOutline className='ion-icon' color={'#000000'} width={'1.4rem'}
                                               height={'1.4rem'}/>
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}
                                   required/>
                            <label for=''>Password</label>
                        </div>
                        <button>Sign up</button>
                        <div className='register'>
                            <p>Already have an account? <Link to='/sign-in'>Sign In</Link></p>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SignUp;