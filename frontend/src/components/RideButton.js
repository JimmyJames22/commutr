import { useNavigate } from 'react-router-dom';
import "../stylesheets/ButtonStyles.css"

function RideButton() {

    const navigate = useNavigate();

    const newRide =()=>{
        if (window.confirm("Start a ride?")){
            alert("Ride started!");
        }
    }
    return(
            <div className="ride-button-div">
                <button class="ride-btn" onClick={newRide}>Ride</button>
            </div>
    )
}

export default RideButton