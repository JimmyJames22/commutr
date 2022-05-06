import { useState } from 'react'
import '../stylesheets/Profile.css';
import Back from './BackButton';
import Quit from './QuitButton';
import Passengers from './PassengerEdit';

function SettingsPage() {

    function Capacity() {

        if (details.status == true) {
            return <div className="settings-form-group">
            <p className="settings-content-wrapper">
            <label htmlFor="capacity-label">Capacity: </label>
            </p>
            <p className="edit-wrapper">
            <input type="number" name="capacity" className="capacity_box" id="capacity_box" readOnly="true" onChange={e => setDetails({...details, carCapacity: e.target.value})} value={details.carCapacity}/>
            <button className="edit-btn" onClick={() => {document.getElementById('capacity_box').readOnly = !document.getElementById('capacity_box').readOnly;}}>edit</button>
            </p>
        </div>;
          }
    }

    const data = 
        {
            id: 1,
            nameFirst: 'Gunner',
            nameLast: 'Peterson',
            address: '14 Old Farm Road',
            phone:'7814921706',
            isDriver:true,
            email: 'Gunnerpeterson14@gmail.com',
            ridesGiven:0,
            ridesTaken:0,
            carCapacity:2,
        }
        const [passengers, setPassengers] = useState([
            {
                id: 1,
                nameFirst: 'James',
                nameLast: 'Millington',
                address: 'His House',
                phone:'(111)-111-1111',
                email: 'james_millington22@milton.edu'
            },
            {
                id: 2,
                nameFirst: 'Cameron',
                nameLast: 'Edgar',
                address: '11, Clamron Road',
                phone:'(222)-222-2222',
                email: 'cameron_edgar22@milton.edu'
            },
        ]
        )

    if(localStorage.getItem('userData') != null){ 
    const data = JSON.parse(localStorage.getItem('userData'))
    } 

    const [details, setDetails] = useState({firstname:data.nameLast, lastname:data.nameFirst, address:data.address, phone:data.phone, status:data.isDriver, carCapacity:data.carCapacity})

    return(
        <div className="settings-wrapper">
            <div className="form-inner">
            <div className="button-header">
            <Back />
            </div>
            <div className="settings-title">
               <h2>Settings</h2>
            </div>
            <div className="settings-subtitle">
               <h3>Change Information</h3>
            </div>
           </div>
           <div className="settings-info-wrapper">
            <div>
            <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="address-label">Address: </label>
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="address" className="address_box" id="address_box" readOnly="true" onChange={e => setDetails({...details, address: e.target.value})} value={details.address}/>
                    <button className="edit-btn" onClick={() => document.getElementById('address_box').readOnly = !document.getElementById('address_box').readOnly}>edit</button>
                    </p>
                </div>
                <br/>
                <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="phone-label">Phone: </label>
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="phone" className="phone_box" id="phone_box" readOnly="true" onChange={e => setDetails({...details, phone: e.target.value})} value={details.phone}/>
                    <button className="edit-btn" onClick={() => {document.getElementById('phone_box').readOnly = !document.getElementById('phone_box').readOnly;}}>edit</button>
                    </p>
                </div>
                <br/>
                <Capacity /> 
                <br/>
                <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="status-label">Status: </label>
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="phone" className="status_box" id="status_box" readOnly="true" value={data.isDriver ? ("Driver") : ("Passenger")}/>
                    <button className="edit-btn" onClick={() => alert("Please contact administrator if you wish to change your driving status")}>edit</button>
                    </p>
                </div>
                <br/> <br/>
                <div className="settings-subtitle">
                <h3>Change {data.isDriver ? ("Passenger") : ("Driver")}</h3>
                </div>
                <Passengers passengers={passengers} />
                <br/>
            </div>
            <Quit />
           </div>
        </div>
    )
}

export default SettingsPage