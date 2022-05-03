import { useNavigate } from 'react-router-dom';

function ProfileButton() {

    const navigate = useNavigate();

    const toProfile =()=>{
        navigate("/profile");
    }

    return(
            <div className="profile-button-div">
                <button onClick={toProfile}>profile</button>
            </div>
    )
}

export default ProfileButton