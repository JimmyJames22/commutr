import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function QuitButton(props) {

    const navigate = useNavigate();

    const disconnect =()=>{
        if (window.confirm("Are you sure you want to disconnect?\n(ALL user data and driving pairings will be lost)")){
            if (window.confirm("Are you SUPER sure?")){
                console.log(props.id);
                if (window.confirm("Are you 110% positively sure you want to destroy the environment\n*jk, just wanna make sure you know what you're doing")){
                    axios({
                        method: "POST",
                        url: "http://localhost:8000/api/deleteuser",
                        data: {
                            user_id: props.id
                        }
                    }).then(() => {
                        console.log("done deletion");
                        localStorage.clear();
                        navigate("/login"); //james id: 6276bc4d1c5ff58e410661b7
                    })

                    
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