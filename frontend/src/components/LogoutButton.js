import { useNavigate } from 'react-router-dom';

function LogoutButton() {

    const navigate = useNavigate();

    const logOut =()=>{
        if (window.confirm("Sign Out?")){
        localStorage.clear();
        navigate("/login");
        }
    }
    return(
            <div className="logout-button-div">
                <button className="logout-button" onClick={logOut}>Sign Out</button>
            </div>
    )
}

export default LogoutButton