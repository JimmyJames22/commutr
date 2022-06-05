import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import '../stylesheets/Profile.css';
import Back from './BackButton';
import Quit from './QuitButton';
import Passengers from './PassengerEdit';
import axios from'axios';
import Modal from './ScheduleModal';

function SettingsPage() {


    function Capacity() {

        if (details.status == true) {
            return <div className="settings-form-group">
            <p className="settings-content-wrapper">
            <label htmlFor="capacity-label">Capacity: </label>
            </p>
            <p className="edit-wrapper">
            <input type="number" name="capacity" className="capacity_box" id="capacity_box" readOnly="true" onChange={e => setDetails({...details, carCapacity: e.target.value})} value={details.carCapacity}/>
            <button className="edit-btn" onClick={() => {changeElement('capacity_box', details.carCapacity, 'carCapacity')}}>edit</button>
            </p>
        </div>;
        }
    }

    

    const [passengers, setPassengers] = useState([]);
    const [destination, setDestination] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getRoute();
    }, [])

    function getRoute(){
        axios({
            method: "POST",
            url: "http://localhost:8000/api/findRoute",
            data: {
                _id: data._id,
                destination_id: data.destination_id
            }
        }).then(response => {
            console.log("Got passengers:", response.data.routes);
            if(passengers.length != response.data.routes.length){
            setPassengers([]);
            setDestination([]);
            for (const item of response.data.routes){
                setPassengers(arr => [...arr, item]);
            }
            for (const item of response.data.dest){
                setDestination(arr => [...arr, item]);
            }
           
            console.log("destination state:", destination);
            console.log("Passengers state:",passengers)
            //if data doesn't have route id in it save it to localstorage.
            if(localStorage.getItem('passengers') == null){
                localStorage.setItem('passengers', passengers);
                console.log("Saved passengers:", passengers);
            }
        }
        })
    }

    function openModal(){
        setShowModal(prev => !prev)
        console.log(showModal)
    }

    

    // const data = 
    // {
    //     _id: "6279117ed72496a2f1a50c09",
    //     nameFirst: 'Gunner',
    //     nameLast: 'Peterson',
    //     address: '14 Old Farm Road',
    //     phone:'7814921706',
    //     isDriver:true,
    //     email: 'Gunnerpeterson14@gmail.com',
    //     ridesGiven:0,
    //     ridesTaken:0,
    //     carCapacity:4,
    // }
    
    function changeElement(name, item, field){
        document.getElementById(name).readOnly = !document.getElementById(name).readOnly;
        if(document.getElementById(name).readOnly == true){
            axios({
                method: "POST",
                url: "http://localhost:8000/api/changeinfo",
                data: {
                    id: data._id,
                    loc: field,
                    info:item
                }
            }).then(response => {
                console.log(response)
            })
        }
    }
    
    const data = JSON.parse(localStorage.getItem('userData'));
    console.log(data);
    const [details, setDetails] = useState({firstname:data.nameLast, lastname:data.nameFirst, address:data.address, phone:data.phone, arrivalTimes: data.arrivalTimes, departureTimes: data.departureTimes, status:data.isDriver, carCapacity:data.carCapacity})

    if(localStorage.getItem('userData')== null){
        return <Navigate to="/login" />;
    }
    if(data.org_id!= null){
        return <Navigate to="/admin" />;
    }

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
                    {/* fix address */}
                    <label htmlFor="address-label">Address: </label> 
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="address" className="address_box" id="address_box" readOnly="true" onChange={e => setDetails({...details, address: e.target.value})} value={details.address}/>
                    <button className="edit-btn" onClick={() => {changeElement('address_box', details.address, 'address')}}>edit</button>
                    </p>
                </div>
                <br/>
                <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="phone-label">Phone: </label>
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="phone" className="phone_box" id="phone_box" readOnly="true" onChange={e => setDetails({...details, phone: e.target.value})} value={details.phone}/>
                    <button className="edit-btn" onClick={() => {changeElement('phone_box', details.phone, 'phone')}}>edit</button>
                    </p>
                </div>
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
             
                {/* <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="status-label">Commute Name: </label>
                    </p>
                    <p className="edit-wrapper">
                    <input type="text" name="phone" className="status_box" id="status_box" readOnly="true" value={data.isDriver ? ("Driver") : ("Passenger")}/>
                    <button className="edit-btn" onClick={() => alert("Please contact administrator if you wish to change your driving status")}>edit</button>
                    </p>
                </div>
                <br/>   <br/> */}
                <div className="settings-form-group">
                    <p className="settings-content-wrapper">
                    <label htmlFor="status-label">Schedule: </label>
                    </p>
                    <div classNmae="form-inner">
                    <p className="schedule-edit-wrapper">
                    <button className="modal-button" onClick={() => {openModal()}}>Change Schedule</button>
                    <div className="modal-wrapper"><Modal showModal={showModal} setShowModal={setShowModal} details={details} setDetails={setDetails} settings ={true} id={data._id}/></div>
                    </p>
                    </div>
                </div>

                <br/> <br/> <br/>
                <div className="settings-subtitle">
                <h3>{data.isDriver ? ("Change Passenger") : ("Drop Route")}</h3>
                </div>
                <Passengers passengers={passengers} data={data} dest={destination[0]}/>
                <br/>
            </div>
            
            <Quit id={data._id}/>
            
           </div>
           
        </div>
    )
}

export default SettingsPage