import { useNavigate } from 'react-router-dom';

function LogoutButton() {

    const navigate = useNavigate();

    const logOut =()=>{
        localStorage.clear();
        navigate("/login");
    }
    return(
            <div className="logout-button-div">
                <button onClick={logOut}>logout</button>
            </div>
    )
}

export default LogoutButton