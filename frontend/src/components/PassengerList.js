import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineUserDelete } from 'react-icons/ai';

function PassengerList({passengers, requests, status}) {

    const addPass =(id, name)=>{
        if (window.confirm("Add "+name+" to your carpool?")){ 
            alert("Added");
        }
    }

    const denyPass =(id, name)=>{
        if (window.confirm("Deny "+name+" from your carpool?")){ 
            alert("Denied");
        }
    }

    if (status){
        return (
            <>
            <h2 className="pass-title">Passengers</h2>
            <div className="pass-wrapper">
            {passengers.map((passenger) =>(
                <div className="pass-div">
                <h3 key={passenger.id}>{passenger.nameFirst} {passenger.nameLast}</h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
                </div>
            ))}
            </div>
            <h2 className="pass-title">Requests</h2>
            <div className="pass-wrapper">
            {requests.map((req) =>(
                <div className="req-div">
                <p className="req-content">
                <h3 key={req.id}>{req.nameFirst} {req.nameLast}</h3>
                <h4 key={req.id}>{req.address}, +{req.timeAdded} minutes</h4>
                </p>
                <p className="req-btns">
                <button onClick={() => addPass(req.id, req.nameFirst)} className="confirm-btn" ><AiOutlineUserAdd /></button>
                <button onClick={() => denyPass(req.id, req.nameFirst)} className="deny-btn" ><AiOutlineUserDelete /></button>
                </p>
                </div>
            ))}
            </div>
            </>
        )
    } else {
        return (
            <>
            <h2 className="pass-title">Driver</h2>
            <div className="pass-wrapper">
            {passengers.map((passenger) =>(
                <div className="pass-div">
                <h3 key={passenger.id}>{passenger.nameFirst} {passenger.nameLast}</h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
                </div>
            ))}
            </div>
            </>
        )
    }
    
}

export default PassengerList