import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react'
import '../stylesheets/Profile.css';
import Back from './BackButton';
import Logout from './LogoutButton';
import Settings from './SettingsButton';
import Passengers from './PassengerList';

function ProfilePage() {

    //This must eventually be replaced with a "get driver/get passenger function"
    const [passengers, setPassengers] = useState([
        {
            id: 1,
            nameFirst: 'James',
            nameLast: 'Millington',
            address: 'His House',
            phone:'(111)-111-1111',
            email: 'james_millington22@milton.edu'
        },
        {
            id: 2,
            nameFirst: 'Cameron',
            nameLast: 'Edgar',
            address: '11, Clamron Road',
            phone:'(222)-222-2222',
            email: 'cameron_edgar22@milton.edu'
        },
    ]
    )
    //This must eventually be replaced with a "get requests function" conditionally if status = driver
    const [requests, setRequests] = useState([
        {
            id: 1,
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
            id: 1,
            nameFirst: 'Gunner',
            nameLast: 'Peterson',
            address: '14 Old Farm Road',
            phone:'7814921706',
            isDriver:true,
            email: 'Gunnerpeterson14@gmail.com',
            ridesGiven:0,
            ridesTaken:0,
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
            <Passengers passengers={passengers} status={data.isDriver} requests={requests}/>
            </div>
            <Logout />
            </div>
        </div>
    )
}

export default ProfilePage