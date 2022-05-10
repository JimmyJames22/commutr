import { GiCancel } from 'react-icons/gi';
import { useState, forceUpdate } from 'react'
import axios from 'axios';

const PassengerEdit = ({passengers}) => {

    function deletePassenger(pass_id){
        axios({
            method: "POST",
            url: "http://localhost:8000/api/deletepassenger",
            data: {
                r_id: localStorage.getItem('route'), //To be replaced with data.route_id
                u_id:pass_id
            }
        }).then(() => {
            console.log("done deletion");
            window.location.reload(false); //james id: 6276bc4d1c5ff58e410661b7
        })
    }
        return (
            <>
            <div className="edit-pass-wrapper">
            {passengers.map((passenger) =>(
                <div className="edit-pass-div" onClick={()=> {if (window.confirm("Delete "+passenger.nameFirst+" from your carpool?")){ 
                    deletePassenger(passenger.id);
                }}}>
                <GiCancel className="delete-icon"/>
                <h3 key={passenger.id}>{passenger.nameFirst} {passenger.nameLast}</h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
                </div>
            ))}
            </div>
            </>
        )
    
    
}

export default PassengerEdit