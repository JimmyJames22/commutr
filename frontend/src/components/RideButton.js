import { useNavigate } from 'react-router-dom';
import "../stylesheets/ButtonStyles.css"
import { FaCar } from 'react-icons/fa';

function RideButton(props) {

    const navigate = useNavigate();

    const newRide =()=>{
        
        if (window.confirm("Start a ride?")){
            var dest = props.destination[0]
            var link = 'https://www.google.com/maps/dir/?api=1&origin='
            link += props.pos[0]+','+props.pos[1]+'&waypoints='
            console.log(link)
            console.log(props.passengers)
           
            for(var i=0;i<props.passengers.length;i++){
                if(props.passengers[i].lat_lng[0] != props.pos[0] && props.passengers[i].lat_lng[1] != props.pos[1]){
                    link+=props.passengers[i].lat_lng[0]+','+props.passengers[i].lat_lng[1]+'|'
                }
            }

            link+='&destination='+dest.lat_lng[0]+','+dest.lat_lng[1]+'&travelmode=driving'
            console.log(link)
            window.open(link, '_blank');

                // https://www.google.com/maps/dir/?api=1
                // &origin=48.819141912303,2.2297863639837
                // &waypoints=48.81863290356,2.2312122798508 | second lat_lng | third lat_lng
                // &destination=48.818734654467,2.2313515376389
                // &travelmode=driving
        }
    }
    return(
            <div className="ride-button-div">
                <button class="ride-btn" onClick={newRide}><FaCar /></button>
            </div>
    )
}

export default RideButton