import { useState, useEffect } from 'react';
import { AtOutline, LockClosedOutline } from 'react-ionicons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Form ({ to }) {
    return <TeachingSubjectForm />
}

function TeachingSubjectForm() {
    const [subjects, setSubjects] = useState([{id: 1, name: 'VM'}, {id: 2, name: 'OP'}]);
    const [teachingPeriods, setTeachingPeriods] = useState([{id: 1, year: '2022', semester: '1'}, {id: 2, year: '2022', semester: '2'}]);
    const [currentTeachingPeriod, setCurrentTeachingPeriod] = useState('');
    const [currentSubject, setCurrentSubject] = useState('')
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(currentSubject);
            console.log(currentTeachingPeriod);
            const response = await axiosPrivate.post('/teaching-subject',
                                              JSON.stringify({ subjectId: currentSubject, teachingPeriodId: currentTeachingPeriod }));
            setCurrentSubject('');
            setCurrentTeachingPeriod('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response?.message);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;

        const getTeachingPeriods = async () => {
            try {
                const responseTeachingPeriods = await axiosPrivate.get(`/teaching-periods`);
                const responseSubjects = await axiosPrivate.get(`/subjects`);
                setTeachingPeriods(responseTeachingPeriods.data);
                setSubjects(responseSubjects.data);
            } catch (err) {
                navigate('/sign-in', { state: { from: location }, replace: true });
            }
        }

        getTeachingPeriods();
        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <h1>Add subject</h1>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className="form-row">
                    <select style={{'marginTop': '20px'}} name="Teaching periods" onChange={(e) => setCurrentTeachingPeriod(e.target.value)}>
                        <option disabled selected value> -- select an option -- </option>
                        {teachingPeriods.map((teachingPeriod) => (
                            <option key={teachingPeriod.id} value={teachingPeriod.id}>{`${teachingPeriod.year}-${teachingPeriod.semester}`}</option>
                        ))}
                    </select>

                    <select name="Subjects" onChange={(e) => {setCurrentSubject(e.target.value)}}>
                        <option disabled selected value> -- select an option -- </option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>

                    <button>Create</button>
                </div>
            </form>
        </section>
    );
}

//function SubjectForm() {
//    const [username, setUsername] = useState('');
//    const [password, setPassword] = useState('');
//    const [errMsg, setErrMsg] = useState('');
//
//    useEffect(() => {
//        setErrMsg('');
//    }, [username, password]);
//
//    useEffect(() => {
//        document.title = "Add Subject";
//    }, []);
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            const response = await axios.post('/auth/sign-up',
//                                              JSON.stringify({ username: username, pwd: password}),
//                                              {
//                                                headers: { 'Content-Type': 'application/json' }
//                                              });
//            console.log(response.data);
//            setUsername('');
//            setPassword('');
//        } catch (err) {
//            if (!err?.response) {
//                setErrMsg('No Server Response');
//            } else {
//                setErrMsg(err.response?.message);
//            }
//        }
//    };
//
//    return (
//        <section>
//            <form onSubmit={handleSubmit}>
//                <h1>Sign Up</h1>
//                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
//                <div className='inputbox'>
//
//                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
//                    <label for=''>Username</label>
//                </div>
//                <div className='inputbox'>
//                    <LockClosedOutline className='ion-icon' color={'#000000'} width={'1.4rem'} height={'1.4rem'} />
//                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
//                    <label for=''>Password</label>
//                </div>
//                <button>Sign up</button>
//                <div className='register'>
//                    <p>Already have an account? <Link to='/sign-in'>Sign In</Link></p>
//                </div>
//            </form>
//        </section>
//    );
//};

export default Form;