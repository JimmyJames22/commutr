import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Map from './Map';
import Profile from './ProfileButton';
import Ride from './RideButton';

function HomePage() {

    const [name, setName] = useState("");
    

    console.log(localStorage.getItem('userData'));

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }

    
    return(
    <div className='home-wrapper'>
       <div className='home-div'>
            <div className="form-inner">

                <Map/>
                <h1 className='main-logo' onClick={() => window.location.reload(false)}>Commut<text className='r'>r</text></h1>
                <Profile />
            </div>
                <Ride />
    </div>
    </div>
    )
}

export default HomePage