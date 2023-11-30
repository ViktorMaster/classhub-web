import './App.css';
import SignUp from './Components/Auth/SignUp.js';
import SignIn from './Components/Auth/SignIn.js';
import RequireAuth from './Components/Auth/RequireAuth.js';
import Subjects from './Components/Main/Subjects.js';
import Tasks from './Components/Main/Tasks.js';
import Users from './Components/Main/Users.js';
import Registration from './Components/Main/Registration.js';
import Form from './Components/Main/Form.js';
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
            <Route path='/subjects' element={<Subjects />} />
            <Route path='/subjects/:id/tasks' element={<Tasks />} / >
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Teacher]} />} >
            <Route path='/subjects/:id/tasks/:id' element={<Users />} / >
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />} >
            <Route path='/registration' element={<Registration />} />
            <Route path='/subjects/add' element={<Form to='subject' />} />
        </Route>
    </Routes>
  );
}

export default App;
