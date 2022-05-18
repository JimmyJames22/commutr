import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";


import '../stylesheets/Login.css';

import Toggle from './ToggleSwitch';


function SignupPage({Signup, error}) {

    const [details, setDetails] = useState({firstname:"", lastname:"", address:"", place_id:"", xy:[], phone:"", status:false, carCapacity:0})
    // const [place_id, setPlace_id] = useState("")
    // const [xy, setXY] = useState([])

    const submitHandler = e => {
        e.preventDefault();

        Signup(details)
    }




    const navigate = useNavigate();

    const responseSuccessGoogle = (response) => {
        console.log(details)
        if(CheckForms()){
            console.log(response)
            // Signup(details)
            axios({
                method: "POST",
                url: "http://localhost:8000/api/googlelogin",
                data: {
                    tokenId: response.tokenId,
                    nameFirst: details.firstname,
                    nameLast: details.lastname,
                    address: details.address,
                    place_id: details.place_id,
                    xy: details.xy,
                    phone: details.phone,
                    isDriver: details.status,
                    carCapacity: details.carCapacity
                }
            }).then(response => {
                console.log("Google login success:", response);
                navigate('/');
            })
        }
    }

    const responseErrorGoogle = (response) => {
        console.log(details)
        console.log("Google login failure:", response)
    }


    

    // const AddressBox = () => {
    
    //     const {
    //         ready,
    //         value,
    //         setValue,
    //         suggestions: {status, data},
    //         clearSuggestions,
    //     } = usePlacesAutocomplete();

        
        
    //     const handleSelect = async (address) => {

    //         await setValue(address, false);
    //         clearSuggestions();

    //         await getGeocode({address}).then( results => {
    //             const {lat, lng} = getLatLng(results[0]);
    //             console.log(results[0])
    //             const place_id = results[0].place_id
    //             const formatted_address = results[0].formatted_address;
    //             setStates([lat, lng], place_id, formatted_address)
    //         })
    //     }
        
        
    //     return <div> 
    //         <Combobox onSelect={handleSelect}>
    //         <ComboboxInput
    //         value={value}
    //         onChange={ e => setValue(e.target.value)}
    //         disabled={!ready}
    //         className="combobox-input"
    //         placeholder="Search an address"
    //         />
    //         <ComboboxPopover>
    //             <ComboboxList>
    //                 {status === "OK" && 
    //                 data.map(({place_id, description}) => (
    //                     <ComboboxOption key= {place_id} value={description} />
    //                 ))}
    //             </ComboboxList>
    //         </ComboboxPopover>
    //         </Combobox>
    //     </div>;
    // }
    
    // function Capacity() {

    //     if (details.status == true) {
    //         return <div className="form-group">
    //         <label htmlFor="capacity">Car Capacity:</label>
    //         <input type="number" name="capacity" id="capacity" onChange={e => setDetails({...details, carCapacity: e.target.value})} value={details.carCapacity}/>
    //         </div>;
    //       }
    // }


    function CheckForms() {
        if(details.firstname == "" || details.lastname == ""){
            alert("Enter name");
            // window.location.reload(false);
            return false;
        } else if(details.address == "" || details.xy == [] || details.place_id == ""){
            alert("Enter address");
            // window.location.reload(false);
            return false;
        } else if(details.phone == ""){
            alert("Enter valid phone number");
            // window.location.reload(false);
            return false;
        } else if(details.carCapacity < 1 && details.status == true){
            alert("Car capacity cannot be less than 1");
            // window.location.reload(false);
            return false;
        } else{
           return true
        }
    }

    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    
    
    const handleSelect = async (address) => {

        await setValue(address, false);
        clearSuggestions();

        await getGeocode({address}).then( results => {
            const {lat, lng} = getLatLng(results[0]);
            const place_id = results[0].place_id
            const formatted_address = results[0].formatted_address;
            console.log([lat,lng], place_id, formatted_address)
            return [[lat,lng], place_id, formatted_address]
        }).then(arr => {
            details.xy = arr[0]
            details.place_id = arr[1]
            setDetails({...details, address: arr[2]})
        })
    }

    return(
        <div className="login-app">
        <form onSubmit={submitHandler}>
           
            <div className="form-inner">
            <div className='logo-div'>
            <h1 className='logo'>Commut<text className='r'>r</text></h1>
            </div>
                <h2>Sign Up</h2>
                
                <div className="form-group">
                    <label htmlFor="first-name">First Name:</label>
                    <input type="text" name="first-name" id="first-name" onChange={e => setDetails({...details, firstname: e.target.value})} value={details.firstname} />
                </div>
                <div className="form-group">
                    <label htmlFor="last-name">Last Name:</label>
                    <input type="text" name="last-name" id="last-name" onChange={e => setDetails({...details, lastname: e.target.value})} value={details.lastname}/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <div> 
                    <Combobox onSelect={handleSelect}>
                        <ComboboxInput
                        value={value}
                        onChange={ e => setValue(e.target.value)}
                        disabled={!ready}
                        className="combobox-input"
                        placeholder="Search an address"
                        />
                        <ComboboxPopover>
                            <ComboboxList>
                            {status === "OK" && 
                            data.map(({place_id, description}) => (
                            <ComboboxOption key= {place_id} value={description} />
                            ))}
                            </ComboboxList>
                        </ComboboxPopover>
                    </Combobox>
                </div>
                    {/* <input type="text" name="address" id="address" onChange={e => setDetails({...details, address: e.target.value})} value={details.address}/> */}
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="text" name="phone" id="phone" onChange={e => setDetails({...details, phone: e.target.value})} value={details.phone}/>
                </div>
                <div className="form-group">
                    <div className='status-group'>
                    <label htmlFor="status">I am a: <text>{details.status ? <text className='driver-label'>Driver </text>: <text className='passenger-label'>Passenger</text>}</text></label>
                    <Toggle className='toggle' onChange={e => {setDetails({...details, status: e.target.checked}); console.log(details)}}/>
                    </div>
                </div>
                {details.status == true?
                <div className="form-group">
                    <label htmlFor="capacity">Car Capacity:</label>
                    <input type="number" name="capacity" id="capacity" onChange={e => setDetails({...details, carCapacity: e.target.value})} value={details.carCapacity}/>
                </div>: <></>}
                <div className="form-group">
                <div className='submit-container'>
                <div className='submit-center'>
                <GoogleLogin
                    className="google-login-button"
                    clientId="277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
                    buttonText="Sign up with google"
                    onRequest={CheckForms}
                    onSuccess={responseSuccessGoogle}
                    onFailure={responseErrorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                </div>
                </div>
                </div>
                <div className="form-group">
                <label htmlFor="signup-label">Already have an account? <Link className = "login-link" to="/login">Log in!</Link></label> 
                </div>
            </div>
        </form>
        </div>
    )
}

export default SignupPage