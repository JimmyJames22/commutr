import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Map from './Map';
import Profile from './ProfileButton';
import Ride from './RideButton';

function HomePage() {

    const [name, setName] = useState("");
    const data = JSON.parse(localStorage.getItem('userData'))

    console.log(localStorage.getItem('userData'));

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }

    
    return(
        <form>
            <div className="form-inner">
            <h1 className='main-logo'>Commut<text className='r'>r</text></h1>
                <Map/>
                <Profile />
            </div>
                <Ride />
        </form>
    )
}

export default HomePage