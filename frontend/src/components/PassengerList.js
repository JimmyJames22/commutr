/** @format */
import { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUserDelete } from "react-icons/ai";
import axios from "axios";
import "../stylesheets/ButtonStyles.css";

function PassengerList({ passengers, requests, data, dest }) {
  const [loading, setLoading] = useState(true);

  let paired = false;
  if (dest.length > 0) {
    paired = dest[0].paired;
  }

  console.log("dest:", dest);
  const addUser = () => {
    if (window.confirm("Pair Me?")) {
      setLoading(false);
      axios({
        method: "POST",
        url: "http://localhost:8000/api/adduser",
        data: {
          user: {
            destination_id: data.destination_id,
            isDriver: data.isDriver,
            place_id: data.place_id,
            _id: data._id,
            lat_lng: data.lat_lng,
            arrival_times: data.arrivalTimes,
            departure_times: data.departureTimes,
          },
        },
      }).then((response) => {
        console.log(response);
        if (response.data == "User could not be added to any route") {
          alert(
            "No routes could be found based on your location and/or schedule. Please check again later."
          );
        } else {
          alert("You're in the system!");
          window.location.reload(false);
        }
      });
    }
  };

  return (
    <>
      <h2 className="pass-title">Your Route</h2>
      {paired & (passengers.length < 1) ? (
        <>
          {loading ? (
            <div className="user-add-wrapper">
              <p>Your route is empty :(</p>
              <button
                className="user-add-button"
                onClick={() => {
                  addUser();
                }}
              >
                Add me to the map! <AiOutlineUserAdd className="add-icon" />
              </button>
            </div>
          ) : (
            <h3>You are being paired. Check back in later.</h3>
          )}
        </>
      ) : (
        <>
          <div className="pass-wrapper">
            {passengers.map((passenger) => (
              <div
                className="pass-div"
                style={{
                  background: passenger.id == data._id ? "#98fb98" : "#F8F0E3",
                }}
              >
                <h3 key={passenger.id}>
                  {passenger.nameFirst} {passenger.nameLast}{" "}
                  <text>{passenger.isDriver == true ? "(Driver)" : ""}</text>
                </h3>
                <h4 key={passenger.id}>{passenger.address}</h4>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default PassengerList;
