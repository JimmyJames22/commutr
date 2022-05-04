import { FaUserCircle } from 'react-icons/fa';
import '../stylesheets/Profile.css';

function ProfilePage() {

    const data = JSON.parse(localStorage.getItem('userData'))

    return(
        <div className="profile-wrapper">
            <div className="form-inner">
                <h2>{data.nameFirst} {data.nameLast}</h2>
                <h3>@{data.email}</h3>
            </div>
        </div>
    )
}

export default ProfilePage