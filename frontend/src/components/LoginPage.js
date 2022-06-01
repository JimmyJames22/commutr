import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import AdminModal from './AdminSignup';
import '../stylesheets/AdminStyles.css'

function LoginPage() {

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false)

    const openModal = (e) => {
        e.preventDefault();
        setShowModal(prev => !prev);
    }

    const responseSuccessGoogle = (response) => {
        axios({
            method: "POST",
            url: "http://192.168.50.129:8000/api/googlelogin",
            data: {
                tokenId: response.tokenId
            }
        }).then(response => {
            console.log("Google login success:", response);
            console.log(response.data.user.address)
            localStorage.setItem('userData',JSON.stringify({
                "nameFirst":response.data.user.nameFirst,
                "nameLast":response.data.user.nameLast,
                "email":response.data.user.email,
                "address":response.data.user.address,
                "phone":response.data.user.phone,
                "isDriver":response.data.user.isDriver,
                "arrivalTimes":response.data.user.arrivalTimes,
                "departureTimes":response.data.user.departureTimes,
                "ridesTaken":response.data.user.ridesTaken,
                "ridesGiven":response.data.user.ridesGiven,
                "_id":response.data.user._id,
                "lat_lng":response.data.user.lat_lng,
                "place_id":response.data.user.place_id
            }))
            navigate('/');
        }).catch(
            function (error) {
              alert("Account not found")
              return Promise.reject(error)
            }
          )
    }

    const responseErrorGoogle = (response) => {
        console.log(response)
    }
    return(
        <div className="login-app">
        <form>
            <div className="form-inner">
            <div className='logo-div'>
            <h1 className='logo'>Commut<text className='r'>r</text></h1>
            </div>
                <h2>Login</h2>
                <div className="form-group">
                <div className='submit-container'>
                <div className='submit-center'>
                <GoogleLogin
                    className="google-login-button"
                    clientId="277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
                    buttonText="Login with google"
                    onSuccess={responseSuccessGoogle}
                    onFailure={responseErrorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                </div>
                </div>
                </div>
                <div className="form-group">
                <label htmlFor="signup-label">Don't have an account? <Link className = "login-link" to="/signup" >Sign up!</Link> </label>
                <button className="admin-button" onClick={openModal}>For Administrators</button>
                <div className="admin-wrapper"><AdminModal showModal={showModal} setShowModal={(e) => {setShowModal(e)}}/></div> 
                </div>
            </div>
        </form>
        </div>
    )
}

export default LoginPage