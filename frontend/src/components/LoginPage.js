import { Link, useNavigate } from 'react-router-dom';
import { componentDidUpdate } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

function LoginPage() {

    const navigate = useNavigate();

    const responseSuccessGoogle = (response) => {
        axios({
            method: "POST",
            url: "http://localhost:8000/api/googlelogin",
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
                "isDriver":response.data.user.isDriver
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
                </div>
            </div>
        </form>
        </div>
    )
}

export default LoginPage