import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';


function QuitButton() {

    const navigate = useNavigate();

    const disconnect =()=>{
        if (window.confirm("Are you sure you want to disconnect?\n(ALL user data and driving pairings will be lost)")){
            if (window.confirm("Are you SUPER sure?")){
                if (window.confirm("Are you 110% positively sure you want to destroy the environment\n*jk, just wanna make sure you know what you're doing")){
                    localStorage.clear();
                    navigate("/login");
            }
            }
        }
    }
    return(
        <div className="quit-button-div">
        <button className="quit-button" onClick={disconnect}>Disconnect From Commutr Services</button>
    </div>
    )
}

export default QuitButton