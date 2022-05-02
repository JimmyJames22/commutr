import { Link } from 'react-router-dom';
import { componentDidUpdate } from 'react';
import GoogleLogin from 'react-google-login';


function LoginPage() {

    const responseSuccessGoogle = (response) => {
        console.log(response)
    }

    const responseErrorGoogle = (response) => {
        console.log(response)
    }
    return(
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
    )
}

export default LoginPage