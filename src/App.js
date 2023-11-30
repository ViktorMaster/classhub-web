import './App.css';
import SignUp from './Components/Auth/SignUp.js';
import SignIn from './Components/Auth/SignIn.js';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
    </Routes>
  );
}

export default App;
