import { GiCancel } from 'react-icons/gi';

const PassengerEdit = ({passengers}) => {

        return (
            <>
            <div className="edit-pass-wrapper">
            {passengers.map((passenger) =>(
                <div className="edit-pass-div" onClick={()=> {if (window.confirm("Delete "+passenger.nameFirst+" from your carpool?")){ 
                    alert("Deleted");
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