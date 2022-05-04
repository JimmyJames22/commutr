import { FaUserCircle } from 'react-icons/fa';
import '../stylesheets/Profile.css';
import Back from './BackButton';

function ProfilePage() {

    const data = JSON.parse(localStorage.getItem('userData'))

    return(
        <div className="profile-wrapper">
            <div className="form-inner">
                <Back />
            <div className="icon-wrapper">
            < FaUserCircle className ="user-icon"/>
            </div>
            <div className="name-wrapper">
                <h2>{data.nameFirst} {data.nameLast}</h2>
                <h3>@{data.email}</h3>
            </div>
            <div className="info-wrapper">
            <h2>Rides Given: {data.ridesGiven}</h2>
            <h2>Rides Taken: {data.ridesTaken}</h2>
            </div>
            </div>
        </div>
    )
}

export default ProfilePage