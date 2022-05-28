import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Map from './Map';
import Profile from './ProfileButton';
import Ride from './RideButton';
import axios from 'axios';

function HomePage() {

    const [passengers, setPassengers] = useState([])

    useEffect(() => {
        if(localStorage.getItem('userData')!= null){
            getRoute();
        }
    }, [passengers])



    
    const [destination, setDestination] = useState([])

    function getRoute(){
        
        axios({
            method: "POST",
            url: "http://localhost:8000/api/findRoute",
            data: {
                _id: data._id,
            }
        }).then(response => {
            console.log("Got passengers:", response.data.routes);
            if(passengers.length != response.data.routes.length){
            setPassengers([]);
            setDestination([]);
            for (const item of response.data.routes){
                setPassengers(arr => [...arr, item]);
            }
            for (const item of response.data.dest){
                setDestination(arr => [...arr, item]);
            }
           
            console.log("destination state:", destination);
            console.log("Passengers state:",passengers)
            //if data doesn't have route id in it save it to localstorage.
            if(localStorage.getItem('passengers') == null){
                localStorage.setItem('passengers', passengers);
                console.log("Saved passengers:", passengers);
            }
        }

            
        })
    }
    const data = JSON.parse(localStorage.getItem('userData'))
    console.log(data)

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }

    if(data.org_id!= null){
        return <Navigate to="/admin" />;
    }

    
    
    return(
    <div className='home-wrapper'>
       <div className='home-div'>
            <div className="form-inner">
                <Map pos={data.lat_lng} passengers = {passengers} destination = {destination}/>
                <h1 className='main-logo' onClick={() => {window.location.reload(false)}}>Commut<text className='r'>r</text></h1>
                <Profile passengers = {passengers}/>
            </div>
                <Ride pos = {data.lat_lng} passengers = {passengers} destination = {destination}/>
    </div>
    </div>
    )
}

export default HomePage