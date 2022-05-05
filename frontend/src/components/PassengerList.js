const PassengerList = ({passengers, status}) => {

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