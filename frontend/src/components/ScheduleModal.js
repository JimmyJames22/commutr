import axios from 'axios';
import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { GiCancel } from 'react-icons/gi';



import '../stylesheets/ModalStyles.css';



function ScheduleModal({showModal, setShowModal, details, setDetails}) {

    const navigate = useNavigate();

    const checkTimes = (response) => {
        let error = false
        for (const i of details.arrivalTimes){
            if((!isNaN(i.time) && i.commuting == false) || (isNaN(i.time) && i.commuting == true)){
                alert("If you have selected a day to commute, you must fill out times for that day");
                error = true
                return false;
            }}
        for (const i of details.departureTimes){
            if(( !isNaN(i.time) && i.commuting == false) || (isNaN(i.time) && i.commuting == true)){
                alert("If you have selected a day to commute, you must fill out times for that day");
                error = true
                return false;
            }}
        if(error == false){
                console.log(details)
                console.log(response)
                    // Signup(details)
                
                    axios({
                        method: "POST",
                        url: "http://localhost:8000/api/googlelogin",
                        data: {
                            tokenId: response.tokenId,
                            nameFirst: details.firstname,
                            nameLast: details.lastname,
                            destination_id: "6276c1571c5ff58e410661c2",
                            phone: details.phone,
                            arrivalTimes: details.arrivalTimes,
                            departureTimes: details.departureTimes,
                            address: details.address,
                            place_id: details.place_id,
                            lat_lng: details.xy,
                            isDriver: details.status,
                            carCapacity: details.carCapacity
                        }
                    }).then(response => {
                        console.log("Google login success:", response);
                        navigate('/');
                    })
            }
        }
        
        
    
    
    const responseSuccessGoogle = (response) => {
        console.log(details)
        console.log(response)
            // Signup(details)
        
            axios({
                method: "POST",
                url: "http://localhost:8000/api/googlelogin",
                data: {
                    tokenId: response.tokenId,
                    nameFirst: details.firstname,
                    nameLast: details.lastname,
                    destination_id: "6276c1571c5ff58e410661c2",
                    phone: details.phone,
                    arrivalTimes: details.arrivalTimes,
                    departureTimes: details.departureTimes,
                    address: details.address,
                    place_id: details.place_id,
                    lat_lng: details.xy,
                    isDriver: details.status,
                    carCapacity: details.carCapacity
                }
            }).then(response => {
                console.log("Google login success:", response);
                navigate('/');
            })
    }

    const responseErrorGoogle = (response) => {
        console.log(details)
        console.log("Google login failure:", response)
    }

    const convTime = (time) => {
        let hrs = parseInt(time)*60;
        let timearr = time.split(":")
        hrs += parseInt(timearr[1])
        return hrs
    };

    function changeElement(name1, name2, index){
        let chkid = name1+'-chk'
        document.getElementById(name1).disabled = !document.getElementById(name1).disabled;
        document.getElementById(name1).value = '--:--';
        document.getElementById(name2).disabled = !document.getElementById(name2).disabled;
        document.getElementById(name2).value = '--:--';
        document.getElementById(chkid).disabled = !document.getElementById(chkid).disabled;
        details.arrivalTimes[index].commuting = !details.arrivalTimes[index].commuting
        details.departureTimes[index].commuting = !details.departureTimes[index].commuting
        if(details.arrivalTimes[index].commuting == false){
            details.arrivalTimes[index].time = NaN
            details.departureTimes[index].time = NaN
        }
    };

function changePref(name1, name2, index){

        document.getElementById(name1).disabled = !document.getElementById(name1).disabled;
        document.getElementById(name2).disabled = !document.getElementById(name2).disabled;
    
        document.getElementById(name1).value = '--:--'
        document.getElementById(name2).value = '--:--'

        details.arrivalTimes[index].time = -1
        details.departureTimes[index].time = -1
    };
    return(
        <>

            {showModal ? 
            <div className="modal-container">
            <div className="modal-app">
            <form>
            
            <div className="form-inner">
            <div className="close-wrapper"><button className="close-modal" onClick={() => setShowModal(prev => !prev)}><GiCancel/></button></div>
            <div className='logo-div'>
            <h1 className='logo'>Commut<text className='r'>r</text></h1>
            </div>
                
                <div className="form-group">

                <input type="checkbox" id="mon-check" name="mon-check" value="Monday" onChange={()=>{changeElement("mon-arr-time","mon-dep-time",0)}}/>
                <label htmlFor="mon">Monday:</label> 

                <label className="sub-label" htmlFor="mon">Arrival:</label>
                
                <input type="time" id="mon-arr-time" disabled onChange={e => {details.arrivalTimes[0].time = convTime(e.target.value)}}></input>
                <label className="sub-label" htmlFor="mon">Departure:</label>
                <input type="time" id="mon-dep-time" disabled onChange={e => {details.departureTimes[0].time = convTime(e.target.value)}} ></input>

                <div className="pref-wrapper">
                <input type="checkbox" className="pref-check" id="mon-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("mon-arr-time","mon-dep-time",0)}} disabled/>
                <label htmlFor="pref" className="pref-label">No Preference</label>
                </div>
                
                </div>

                <div className="form-group">
                
                <input type="checkbox" id="tue-check" name="tue-check" value="Tuesday" onChange={()=>{changeElement("tue-arr-time","tue-dep-time",1)}}/>
                <label htmlFor="tue">Tuesday:</label>

                <label className="sub-label" htmlFor="mon">Arrival:</label>
                <input type="time" id="tue-arr-time" disabled onChange={e => {details.arrivalTimes[1].time = convTime(e.target.value)}}></input>
                <label className="sub-label" htmlFor="mon" >Departure:</label>
                <input type="time" id="tue-dep-time" disabled onChange={e => {details.departureTimes[1].time = convTime(e.target.value)}}></input>

                <div className="pref-wrapper">
                <input type="checkbox" className="pref-check" id="tue-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("tue-arr-time","tue-dep-time",1)}} disabled/>
                <label htmlFor="pref" className="pref-label">No Preference</label> 
                </div>

                </div>
                <div className="form-group">
                    
                    <input type="checkbox" id="wed-check" name="wed-check" value="Wednesday" onChange={()=>{changeElement("wed-arr-time","wed-dep-time",2)}}/>
                    <label htmlFor="wed">Wednesday:</label>  

                    <label className="sub-label" htmlFor="mon">Arrival:</label>
                    <input type="time" id="wed-arr-time" disabled onChange={e => {details.arrivalTimes[2].time = convTime(e.target.value)}}></input>
                    <label className="sub-label" htmlFor="mon" >Departure:</label>
                    <input type="time" id="wed-dep-time" disabled onChange={e => {details.departureTimes[2].time = convTime(e.target.value)}}></input>

                    <div className="pref-wrapper">
                    <input type="checkbox" className="pref-check" id="wed-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("wed-arr-time","wed-dep-time",2)}} disabled/>
                    <label htmlFor="pref" className="pref-label">No Preference</label> 
                    </div>

                </div>
                <div className="form-group">

                    <input type="checkbox" id="thu-check" name="thu-check" value="Thursday" onChange={()=>{changeElement("thu-arr-time","thu-dep-time",3)}}/>
                    <label htmlFor="thu">Thursday:</label>

                    <label className="sub-label" htmlFor="mon">Arrival:</label>
                    <input type="time" id="thu-arr-time" disabled onChange={e => {details.arrivalTimes[3].time = convTime(e.target.value)}}></input>
                    <label className="sub-label" htmlFor="mon" >Departure:</label>
                    <input type="time" id="thu-dep-time" disabled onChange={e => {details.departureTimes[3].time = convTime(e.target.value)}}></input>

                    <div className="pref-wrapper">
                    <input type="checkbox" className="pref-check" id="thu-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("thu-arr-time","thu-dep-time",3)}} disabled/>
                    <label htmlFor="pref" className="pref-label">No Preference</label> 
                    </div>
                
                </div>
                <div className="form-group">

                    <input type="checkbox" id="fri-check" name="fri-check" value="Friday" onChange={()=>{changeElement("fri-arr-time","fri-dep-time",4)}}/>
                    <label htmlFor="fri">Friday:</label>

                    <label className="sub-label" htmlFor="mon">Arrival:</label>
                    <input type="time" id="fri-arr-time" disabled onChange={e => {details.arrivalTimes[4].time = convTime(e.target.value)}}></input>
                    <label className="sub-label" htmlFor="mon" >Departure:</label>
                    <input type="time" id="fri-dep-time" disabled onChange={e => {details.departureTimes[4].time = convTime(e.target.value)}}></input>

                    <div className="pref-wrapper">
                    <input type="checkbox" className="pref-check" id="fri-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("fri-arr-time","fri-dep-time",4)}} disabled/>
                    <label htmlFor="pref" className="pref-label">No Preference</label> 
                    </div>

                </div>
                <div className="form-group">

                    <input type="checkbox" id="sat-check" name="sat-check" value="Saturday" onChange={()=>{changeElement("sat-arr-time","sat-dep-time",5)}}/>
                    <label htmlFor="fri">Saturday:</label>

                    <label className="sub-label" htmlFor="mon">Arrival:</label>
                    <input type="time" id="sat-arr-time" disabled onChange={e => {details.arrivalTimes[5].time = convTime(e.target.value)}}></input>
                    <label className="sub-label" htmlFor="mon">Departure:</label>
                    <input type="time" id="sat-dep-time" disabled onChange={e => {details.departureTimes[5].time = convTime(e.target.value)}}></input>

                    <div className="pref-wrapper">
                    <input type="checkbox" className="pref-check" id="sat-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("sat-arr-time","sat-dep-time",5)}} disabled/>
                    <label htmlFor="pref" className="pref-label">No Preference</label> 
                    </div>

                </div>
                <div className="form-group">

                    <input type="checkbox" id="sun-check" name="sun-check" value="Sunday" oonChange={()=>{changeElement("sun-arr-time","sun-dep-time",6)}}/>
                    <label htmlFor="fri">Sunday:</label>

                    <label className="sub-label" htmlFor="mon">Arrival:</label>
                    <input type="time" id="sun-arr-time" disabled onChange={e => {details.arrivalTimes[6].time = convTime(e.target.value)}}></input>
                    <label className="sub-label" htmlFor="mon">Departure:</label>
                    <input type="time" id="sun-dep-time" disabled onChange={e => {details.departureTimes[6].time = convTime(e.target.value)}}></input>

                    <div className="pref-wrapper">
                    <input type="checkbox" className="pref-check" id="sun-arr-time-chk" name="pref-check" value="PrefCheck" onChange={()=>{changePref("sun-arr-time","sun-dep-time",6)}} disabled/>
                    <label htmlFor="pref" className="pref-label">No Preference</label> 
                    </div>

                </div>
                <div className="form-group">
                <div className='submit-container'>
                <div className='submit-center'>
                
                 <GoogleLogin
                 className="google-login-button"
                 clientId="277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
                 buttonText="Sign up with google"
                 onSuccess={checkTimes}
                 onFailure={responseErrorGoogle}
                 cookiePolicy={'single_host_origin'}
                />
                </div>
                </div>
                </div>
                <div className="form-group">
                </div>
            </div>
            
        </form>
        </div></div>:null}
        </>
    )
}


export default ScheduleModal