import { useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/AdminStyles.css'
import Logout from './LogoutButton';

function AdminPage() {

    useEffect(() => {
        getDrivers();
    }, [])

    const [drivers, setDrivers] = useState([])

    const data = JSON.parse(localStorage.getItem('userData'));

    if(localStorage.getItem('userData')== null){ //Real coode
        return <Navigate to="/login" />;
    }

    if(data.org_id == null){
        console.log(data)
        return <Navigate to="/" />;
    }

    const pairAlg = () => {
        alert("paired"); //James' pairing algorithm goes here
    }
    
    function getDrivers(){
        axios({
            method: "GET",
            url: "http://192.168.50.129:8000/api/getdrivers",
            data: {
            }
        }).then(response => {
            console.log("Got drivers:", response.data.drivers);
            setDrivers([]);

            for (const item of response.data.drivers){
                setDrivers(arr => [...arr, item]);
            }

            console.log("Drivers state confirmation:",drivers)
        
        })
    }


    return(
        
        <div className="admin-wrapper">
            <h1 className="welcome-title">Welcome {data.org_name} Admin</h1>
            <h2 className="drivers-title">Top Drivers</h2>
           <div className="drivers-board-div">
           <table className="drivers-tablewrap">
                <thead>
                <tr className="drivers-header">
                  <th>Name</th>
                  <th>Rides Given</th>
                </tr>
                </thead>
                <tbody>
                {drivers.map((driver) => ( 
                <tr>
                  <td>{driver.name} <p className="drivers-email">{driver.email}</p></td>
                  <td>{driver.ridesGiven}</td>
                </tr>
                ))}
                </tbody>
              </table>
           </div>

           <div className="pair-button-wrapper">
           {data.hasPaired == false?
                <div className="form-group">
                    <button className="pair-button" onClick={pairAlg}> Run Pairings </button>
                </div>: <></>}
           </div>
           <Logout />
        </div>
    )
}

export default AdminPage