import { useNavigate } from 'react-router-dom';
import "../stylesheets/ButtonStyles.css"
import { FaCar } from 'react-icons/fa';

function RideButton() {

    const navigate = useNavigate();

    const newRide =()=>{
        if (window.confirm("Start a ride?")){
            alert("Ride started!");
        }
    }
    return(
            <div className="ride-button-div">
                <button class="ride-btn" onClick={newRide}><FaCar /></button>
            </div>
    )
}

export default RideButton