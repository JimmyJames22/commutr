/** @format */

import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { GiCancel } from "react-icons/gi";

import "../stylesheets/AdminStyles.css";

function AdminSignup({ showModal, setShowModal }) {
  const navigate = useNavigate();

  const signIn = (response) => {
    console.log(response.tokenId);

    axios({
      method: "POST",
      url: "http://localhost:8000/api/googleloginadmin",
      data: {
        tokenId: response.tokenId,
      },
    }).then((response) => {
      if (response.data.user != "NA") {
        console.log("Google login success:", response);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            nameFirst: response.data.user.nameFirst,
            nameLast: response.data.user.nameLast,
            email: response.data.user.email,
            phone: response.data.user.phone,
            org_id: response.data.user.org_id,
            hasPaired: response.data.user.hasPaired,
            org_name: response.data.user.org_name,
            org_place_id: response.data.user.org_place_id,
          })
        );
        navigate("/admin");
      } else {
        alert("You are not an admin.");
      }
    });
  };

  const responseErrorGoogle = (response) => {
    console.log("Google login failure:", response);
  };

  return (
    <>
      {showModal ? (
        <div className="admin-login-app">
          <div className="close-wrapper">
            <button
              className="close-modal"
              onClick={() => setShowModal((prev) => !prev)}
            >
              <GiCancel />
            </button>
          </div>
          <div className="logo-div"></div>
          <h2>Admin Login</h2>
          <div className="form-group">
            <div className="submit-container">
              <div className="submit-center">
                <GoogleLogin
                  className="admin-login-button"
                  clientId="277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
                  buttonText="Admin Login with google"
                  onSuccess={signIn}
                  onFailure={responseErrorGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
            </div>
          </div>
          <div className="form-group"></div>
        </div>
      ) : null}
    </>
  );
}

export default AdminSignup;
