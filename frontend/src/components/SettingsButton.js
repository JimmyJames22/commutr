import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';


function SettingsButton() {

    const navigate = useNavigate();

    const toSettings =()=>{
        navigate("/settings");
    }

    return(
            <div className="button-div">
                <div className="set-btn-div">
                <button className="settings-btn" onClick={toSettings}>< FiSettings /></button>
                </div>
            </div>
    )
}

export default SettingsButton