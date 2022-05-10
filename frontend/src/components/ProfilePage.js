import { FaUserCircle } from 'react-icons/fa';
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Profile.css';
import Back from './BackButton';
import Logout from './LogoutButton';
import Settings from './SettingsButton';
import Passengers from './PassengerList';
import axios from 'axios';

function ProfilePage() {

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

    //This must eventually be replaced with a "get driver/get passenger function"
    

    //This must eventually be replaced with a "get requests function" conditionally if status = driver
    const [requests, setRequests] = useState([
        {
            _id: "1",
            nameFirst: 'Calvin',
            nameLast: 'Bonomo',
            address: 'Milton Academy',
            phone:'(333)-333-3333',
            email: 'calvin_bonomo22@milton.edu',
            timeAdded: '4'
        },
    ]
    )

    const data = 
        {
            _id: "6279117ed72496a2f1a50c09",
            nameFirst: 'Gunner',
            nameLast: 'Peterson',
            address: '14 Old Farm Road',
            phone:'7814921706',
            isDriver:true,
            email: 'Gunnerpeterson14@gmail.com',
            ridesGiven:0,
            ridesTaken:0,
            carCapacity:4
        }


    if(localStorage.getItem('userData') == null){
        const data = JSON.parse(localStorage.getItem('userData'))
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
            <Passengers passengers={passengers} data={data} requests={requests} />
            </div>
            <Logout />
            </div>
        </div>
    )
}

export default ProfilePage