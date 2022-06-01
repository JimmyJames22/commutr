import { useNavigate } from 'react-router-dom';
import "../stylesheets/ButtonStyles.css"
import { FaCar } from 'react-icons/fa';
import axios from 'axios';

function RideButton(props) {

    const navigate = useNavigate();

    const newRide =()=>{
        
        if(props.isDriver){
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
                //text message passengers
                window.open(link, '_blank');
                
            }
        } else{
            if (window.confirm("Request a ride from your driver?")){
                axios({
                    method: "POST",
                    url: "http://localhost:8000/api/drivereq",
                        data: {
                            phoneNumber: '+17814921706'
                        }
                            }).then(response => {
                                console.log(response);
                                alert("Drive Requested");
                            })
                }
            }
        }

    return(
            <div className="ride-button-div">
                <button class="ride-btn" onClick={newRide}><FaCar /></button>
            </div>
    )
}

export default RideButton