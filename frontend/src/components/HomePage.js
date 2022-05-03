import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Map from './Map';

function HomePage() {

    const [name, setName] = useState("");
    const data = JSON.parse(localStorage.getItem('userData'))

    console.log(localStorage.getItem('userData'));

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }

    
    return(
        <form>
            <div className="form-inner">
                <h2>Hello: {data.nameFirst} {data.nameLast}</h2>
                <Map/>
                <LogoutButton />
            </div>
        </form>
    )
}

export default HomePage