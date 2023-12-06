import './App.css';
import SignUp from './Components/Auth/SignUp.js';
import SignIn from './Components/Auth/SignIn.js';
import RequireAuth from './Components/Auth/RequireAuth.js';
import Subjects from './Components/Main/Subjects.js';
import Tasks from './Components/Main/Tasks.js';
import Users from './Components/Main/Users.js';
import StudentsGrades from './Components/Main/StudentsGrades.js';
import Registration from './Components/Main/Registration.js';
import Form from './Components/Main/Form.js';
import Layout from './Components/Main/Layout.js';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
    'Admin': 'ROLE_ADMINISTRATOR',
    'Student': 'ROLE_STUDENT',
    'Teacher': 'ROLE_TEACHER'
}

function App() {
  return (
    <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Student, ROLES.Teacher]} />} >
            <Route element={<Layout />} >
                <Route path='/subjects' element={<Subjects />} />
                <Route path='/subjects/:id/tasks' element={<Tasks />} / >
            </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Teacher]} />} >
            <Route element={<Layout />} >
                <Route path='/subjects/:id/tasks/:taskId' element={<StudentsGrades />} / >
                <Route path='/subjects/:id/tasks/add' element={<Form to='tasks' />} / >
            </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />} >
            <Route element={<Layout />} >
                <Route path='/users' element={<Users option='all' />} />
                <Route path='/users/register' element={<Registration />} />
                <Route path='/subjects/:id/assign' element={<Users option='assign' />} />
                <Route path='/subjects/add' element={<Form to='teachingSubject' />} />
                <Route path='/subjects/add/subject' element={<Form to='subject' />} />
                <Route path='/subjects/add/teaching-period' element={<Form to='teachingPeriod' />} />
            </Route>
        </Route>
    </Routes>
  );
}

export default App;
