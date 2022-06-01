import { GiCancel } from 'react-icons/gi';
import axios from 'axios';

const PassengerEdit = ({passengers, data}) => {

    function deletePassenger(pass_id){
        axios({
            method: "POST",
            url: "http://192.168.50.129:8000/api/removeuserfromroute",
            data: {
                user_id: pass_id
            }
        }).then(() => {
            console.log("done deletion");
            window.location.reload(false); //james id: 6276bc4d1c5ff58e410661b7
        })
    }
    if(data.isDriver){
        return (
            <>
            <div className="edit-pass-wrapper">
            {passengers.map((passenger) =>(
                <div className="edit-pass-div" onClick={()=> {if (window.confirm("Delete "+passenger.nameFirst+" from your carpool?")){ 
                    deletePassenger(passenger.id); //Deleting selected passenger
                }}}>
                <GiCancel className="delete-icon"/>
                <h3 key={passenger.id}>{passenger.nameFirst} {passenger.nameLast}</h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
                </div>
            ))}
            </div>
            </>
        )
    }else{
        return (
            <>
            <div className="edit-pass-wrapper">
                <div className="edit-pass-div" onClick={()=> {if (window.confirm("Drop your route?")){ 
                    deletePassenger(data._id); //Deleting yourself
                }}}>
                <GiCancel className="delete-icon"/>
                <h3>Drop your route</h3>
                <h4>{data.address} to Milton Academy</h4>
                </div>
            </div>
            </>
        )
    }
        
    
    
}

export default PassengerEdit