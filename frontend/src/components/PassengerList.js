import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineUserDelete } from 'react-icons/ai';

function PassengerList({passengers, requests, data}) {

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
            {/* Not using requests at the moment */}
            {/* <h2 className="pass-title">Requests</h2>
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
            </div> */}
            </>
        )
    
    
}

export default PassengerList