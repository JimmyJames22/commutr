import { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

import '../stylesheets/Login.css';

import LoginPage from './LoginPage';
import Toggle from './ToggleSwitch';

function SignupPage({Signup, error}) {

    const [details, setDetails] = useState({firstname:"", lastname:"", address:"", phone:"", status:false})

    const submitHandler = e => {
        e.preventDefault();

        Signup(details)
    }

    const responseSuccessGoogle = (response) => {
        console.log(response)
        Signup(details)
        // axios({
        //     method: "POST",
        //     url: "http://localhost:8000/api/googlelogin",
        //     data: {tokenID: response.tokenId}
        // }).then(response => {
        //     console.log(response);
        // })
    }

    const responseErrorGoogle = (response) => {
        console.log(response)
    }

    return(
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
                    <input type="text" name="address" id="address" onChange={e => setDetails({...details, address: e.target.value})} value={details.address}/>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="text" name="phone" id="phone" onChange={e => setDetails({...details, phone: e.target.value})} value={details.phone}/>
                </div>
                <div className="form-group">
                    <div className='status-group'>
                    <label htmlFor="status">I am a: <text>{details.status ? <text className='driver-label'>Driver </text>: <text className='passenger-label'>Passenger</text>}</text></label>
                    <Toggle className='toggle' onChange={e => setDetails({...details, status: e.target.checked})}/>
                    </div>
                </div>
                <div className="form-group">
                <div className='submit-container'>
                <div className='submit-center'>
                <GoogleLogin
                    className="google-login-button"
                    clientId="277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
                    buttonText="Sign up with google"
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
    )
}

export default SignupPage