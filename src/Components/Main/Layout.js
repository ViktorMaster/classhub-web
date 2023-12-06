import { Outlet, NavLink, Link, useOutletContext } from 'react-router-dom';
import { ReaderOutline, LogOutOutline, PersonOutline } from 'react-ionicons';
import logo from '../../Assets/img/logo.png'
import Cookies from 'js-cookie';

function Layout() {

    const logout = () => {
        Cookies.remove('jwt');
    }

    return (
        <div className='main'>
            <div className='sidebar'>
                <div style={{'flex': '1'}}>
                    <img src={logo} alt='' width={'100%'} />
                    <hr />
                    <NavLink to='/subjects'>
                        {({ isActive }) => {
                            return isActive
                            ? <ReaderOutline style={{'background-color': 'rgb(151, 23, 220, 1)'}} color={'#fff'} width={'80%'} height={''} />
                            : <ReaderOutline style={{'background-color': '#f0f0f0'}} color={'#000'} width={'80%'} height={''} />
                        }}
                    </NavLink>
                    {useOutletContext()?.role === 'ROLE_ADMINISTRATOR' &&
                    <NavLink to='/users'>
                        {({ isActive }) => {
                            return isActive
                            ? <PersonOutline style={{'background-color': 'rgb(151, 23, 220, 1)'}} color={'#fff'} width={'80%'} height={''} />
                            : <PersonOutline style={{'background-color': '#f0f0f0'}} color={'#000'} width={'80%'} height={''} />
                        }}
                    </NavLink>
                    }
                </div>

                <div style={{'marginTop': 'auto'}}>
                    <Link to='/sign-in' onClick={logout} replace>
                        <LogOutOutline  color={'#000000'} width={'80%'} height={''} />
                    </Link>
                </div>
            </div>
            <div className='content'>
                <Outlet context={{'role': useOutletContext()?.role, 'id': useOutletContext()?.id}} />
            </div>
        </div>
    );
}

export default Layout;