import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';


function ProfileButton() {

    const navigate = useNavigate();

    const toProfile =()=>{
        navigate("/profile");
    }

    return(
            <div className="profile-button-div">
                <button className="prof-btn" onClick={toProfile}>< FaUserCircle /></button>
            </div>
    )
}

export default ProfileButton