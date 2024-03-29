import { FaUserCircle } from 'react-icons/fa';
import { useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import '../stylesheets/Profile.css';
import Back from './BackButton';
import Logout from './LogoutButton';
import Settings from './SettingsButton';
import Passengers from './PassengerList';

import axios from 'axios';

function ProfilePage() {

    useEffect(() => {
        console.log("Userdata:", localStorage.getItem('userData'));
        if(localStorage.getItem('userData')!= null){
            getRoute();
        }
    }, [])

    const [passengers, setPassengers] = useState([])
    const [dest, setDest] = useState([])

    const data = JSON.parse(localStorage.getItem('userData')) //Real code

    if(localStorage.getItem('userData')== null){ //Real coode
        return <Navigate to="/login" />;
    }

    if(data.org_id!= null){
        return <Navigate to="/admin" />;
    }


    
    
    function getRoute(){
        axios({
            method: "POST",
            url: "http://localhost:8000/api/findRoute",
            data: {
                _id: data._id,
                destination_id: data.destination_id
            }
        }).then(response => {

            setPassengers([]);

            for (const item of response.data.routes){
                setPassengers(arr => [...arr, item]);
            }
            console.log()
           
            console.log("Got passengers:", response.data.dest);
            setDest(response.data.dest)
            console.log("Dest:",dest);
            console.log("Passengers state:",passengers)
            //if data doesn't have route id in it save it to localstorage.
            if(localStorage.getItem('passengers') == null){
                localStorage.setItem('passengers', passengers);
                console.log("Saved passengers:", passengers);
            }

            
        })
    }


    return(
        <div className="profile-wrapper">
            <div className="form-inner">
            <div className="button-header">
                <Back />
                <Settings />
            </div>
            <div className="icon-wrapper">
            < FaUserCircle className ="user-icon"/>
            </div>
            <div className="name-wrapper">
                <h2>{data.nameFirst} {data.nameLast}</h2>
                <h3>@{data.email}</h3>
            </div>
            <div className="info-wrapper">

            <p className="info-label">Rides Given:</p>
            <p className="info-content">{data.ridesGiven}</p>
            <br/><br/>
            <p className="info-label">Rides Taken:</p>
            <p className="info-content">{data.ridesTaken}</p>
            <br/><br/>
            <p className="info-label">Carbon Emissions Saved:</p>
            <p className="info-content">100</p>
            </div>
            <br/>
            <div>
            <Passengers passengers={passengers} data={data} dest={dest}/>
            </div>
            <Logout />
            </div>
        </div>
    )
}

export default ProfilePage