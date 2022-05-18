import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Map from './Map';
import Profile from './ProfileButton';
import Ride from './RideButton';
import axios from 'axios';

function HomePage() {

    useEffect(() => {
        getRoute();
    }, [])

    const [passengers, setPassengers] = useState([])

    function getRoute(){
        axios({
            method: "POST",
            url: "http://localhost:8000/api/findRoute",
            data: {
                _id: data._id,
            }
        }).then(response => {
            console.log("Got passengers:", response.data.routes);
            setPassengers([]);
            for (const item of response.data.routes){
                setPassengers(arr => [...arr, item]);
            }
            console.log("Passengers state:",passengers)
            //if data doesn't have route id in it save it to localstorage.
            if(localStorage.getItem('route') == null){
                localStorage.setItem('route', response.data.id);
                console.log("Saved id:", response.data.id);
            }
            
        })
    }

    console.log(localStorage.getItem('userData'));

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }

    const data = JSON.parse(localStorage.getItem('userData'))
    
    return(
    <div className='home-wrapper'>
       <div className='home-div'>
            <div className="form-inner">
                <Map pos={data.xy} passengers = {passengers}/>
                <h1 className='main-logo' onClick={() => {window.location.reload(false)}}>Commut<text className='r'>r</text></h1>
                <Profile passengers = {passengers}/>
            </div>
                <Ride />
    </div>
    </div>
    )
}

export default HomePage