import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineUserDelete } from 'react-icons/ai';
import axios from "axios";

function PassengerList({passengers, requests, data}) {

    const addUser =()=>{
        axios({
            method: "POST",
            url: "http://localhost:8000/api/adduser",
            data: {
                user: {destination_id: data.destination_id, isDriver: data.isDriver, place_id: data.place_id, _id: data._id}
            }
        }).then(() => {
            alert("You're in the system!");
            window.location.reload(false); 
        })
    }

        return (
            <>
            <h2 className="pass-title">Your Route</h2>
            <div className="pass-wrapper">
            
            {passengers.map((passenger) =>(
                <div className="pass-div" style={{ background: passenger.id == data._id? '#98fb98': '#F8F0E3'}} >
                <h3 key={passenger.id}>{passenger.nameFirst} {passenger.nameLast} <text>{passenger.isDriver == true? '(Driver)':''}</text></h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
                </div>
            ))}
            </div>
         
            </>
        )
    
    
}

export default PassengerList