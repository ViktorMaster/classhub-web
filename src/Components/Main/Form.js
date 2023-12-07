import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Form ({ to }) {
    return (
        <div>
            { to === 'grade' && <GradeForm />}
            { to === 'tasks' && <TasksForm /> }
            { to === 'teachingSubject' && <TeachingSubjectForm /> }
            { to === 'subject' && <AddSubjectForm /> }
            { to === 'teachingPeriod' && <AddTeachingPeriodForm /> }
        </div>
    );
}

function TeachingSubjectForm() {
    const [subjects, setSubjects] = useState([]);
    const [teachingPeriods, setTeachingPeriods] = useState([]);
    const [currentTeachingPeriod, setCurrentTeachingPeriod] = useState('');
    const [currentSubject, setCurrentSubject] = useState('')
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post('/teaching-subjects',
                JSON.stringify({ subjectId: currentSubject, teachingPeriodId: currentTeachingPeriod }));
            setCurrentSubject('');
            setCurrentTeachingPeriod('');
            setScsMsg('You have created a teaching subject!');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response?.message);
            }
        }
    };

    useEffect(() => {
        document.title = "Add teaching subject";
    }, []);

    useEffect(() => {
        let isMounted = true;

        const getTeachingPeriods = async () => {
            try {
                const responseTeachingPeriods = await axiosPrivate.get(`/teaching-periods`);
                const responseSubjects = await axiosPrivate.get(`/subjects`);
                setTeachingPeriods(responseTeachingPeriods.data);
                isMounted && setSubjects(responseSubjects.data);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg(err.response?.message);
                }
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
                <h1>Add teaching subject</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
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
                    <div className='horizontalBlock'>
                        <Link style={{'width': '100%'}} to='/subjects/add/subject'><button style={{'margin': '5px 3px 0 0'}}>Add subject</button></Link>
                        <Link style={{'width': '100%'}} to='/subjects/add/teaching-period'><button style={{'margin': '5px 0 0 3px'}}>Add period</button></Link>
                    </div>
                </div>
            </form>
        </section>
    );
}

function AddSubjectForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        document.title = "Add subject";
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [name, description]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post('/subjects',JSON.stringify({ name, description }));
            setName('');
            setDescription('');
            setScsMsg('You have created a subject!');
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
                <h1>Add Subject</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className='inputbox'>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
                    <label for=''>Name</label>
                </div>
                <div className='inputbox'>
                    <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <label for=''>Description</label>
                </div>
                <button>Add</button>
            </form>
        </section>
    );
}

function AddTeachingPeriodForm() {
    const [year, setYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        document.title = "Add teaching period";
    }, []);

    useEffect(() => {
        setErrMsg('');
        setScsMsg('');
    }, [year, selectedSemester]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        var currentYear = new Date().getFullYear();

        if (isNaN(year)) {
            setErrMsg('Year must be a number');
            return;
        }

        if (year < currentYear) {
            setErrMsg('Enter current or next years')
            return;
        }

        try {
            await axiosPrivate.post('/teaching-periods',JSON.stringify({ year: year, semester: selectedSemester }));
            setYear('');
            setSelectedSemester('');
            setScsMsg('You have created a teaching period!')
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
                <h1>Add teaching period</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className='inputbox'>
                    <input type='number' value={year} onChange={(e) => setYear(e.target.value)} required />
                    <label for=''>Year</label>
                </div>
                <div className='horizontalBlock'>
                    <label>Semester:</label>
                    <label className='radio'>
                        <input
                            className='radio'
                            type="radio"
                            value='1'
                            name='semester'
                            checked={selectedSemester === '1'}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            required
                        />
                        <span>1</span>
                    </label>
                    <label className='radio'>
                        <input
                            className='radio'
                            type="radio"
                            value='2'
                            name='semester'
                            checked={selectedSemester === '2'}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                        />
                        <span>2</span>
                    </label>
                </div>
                <br/>
                <hr noshade='' />
                <button>Add</button>
            </form>
        </section>
    );
}

function TasksForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [scsMsg, setScsMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    useEffect(() => {
        document.title = "Add task";
    }, []);

    useEffect(() => {
        setErrMsg('');
        setScsMsg('');
    }, [title, description]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post('/tasks',JSON.stringify({ title, description, teachingSubjectId: id }));
            setTitle('');
            setDescription('');
            setScsMsg('You have created a task!');
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
                <h1>Add task</h1>
                <p className={scsMsg ? 'scsmsg' : 'offscreen'}>{scsMsg}</p>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className='inputbox'>
                    <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label for=''>Title</label>
                </div>
                <div className='inputbox'>
                    <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <label for=''>Description</label>
                </div>
                <button>Add</button>
            </form>
        </section>
    );
}

function GradeForm() {
    const [grade, setGrade] = useState();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { taskId, studentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Add grade";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (grade < 0) {
            setErrMsg('Grade must be a not-negative number')
        }

        try {
            await axiosPrivate.post('/grades', JSON.stringify({ grade, taskId, studentId }));
            setGrade('');
            navigate(-1);
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
                <h1>Grade</h1>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
                <div className='inputbox'>
                    <input type='number' value={grade} onChange={(e) => setGrade(e.target.value)} required />
                    <label for=''>Grade</label>
                </div>
                <button>Add</button>
            </form>
        </section>
    );
}

export default Form;