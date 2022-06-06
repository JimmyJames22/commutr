/** @format */

import { GiCancel } from "react-icons/gi";
import axios from "axios";

const PassengerEdit = ({ passengers, data, dest }) => {
  function deletePassenger(pass_id) {
    axios({
      method: "POST",
      url: "http://localhost:8000/api/removeuserfromroute",
      data: {
        user_id: pass_id,
      },
    }).then(() => {
      console.log("done deletion");
      window.location.reload(false); //james id: 6276bc4d1c5ff58e410661b7
    });
  }

  console.log("dest:");

  if (data.isDriver) {
    return (
      <>
        {passengers.length > 1 ? (
          <div className="edit-pass-wrapper">
            {passengers.map((passenger) => (
              <>
                {passenger.id != data._id ? (
                  <div
                    className="edit-pass-div"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete " +
                            passenger.nameFirst +
                            " from your carpool?"
                        )
                      ) {
                        deletePassenger(passenger.id); //Deleting selected passenger
                      }
                    }}
                  >
                    <GiCancel className="delete-icon" />
                    <h3 key={passenger.id}>
                      {passenger.nameFirst} {passenger.nameLast}
                    </h3>
                    <h4 key={passenger.id}>{passenger.address}</h4>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        ) : (
          <h2>You have no passengers</h2>
        )}
      </>
    );
  } else {
    return (
      <>
        {passengers.length > 1 ? (
          <div className="edit-pass-wrapper">
            <div
              className="edit-pass-div"
              onClick={() => {
                if (window.confirm("Drop your route?")) {
                  deletePassenger(data._id); //Deleting yourself
                }
              }}
            >
              <GiCancel className="delete-icon" />
              <h3>Drop your route</h3>
              <h4>
                {data.address} to {dest.address}
              </h4>
            </div>
          </div>
        ) : (
          <h2>You are not assigned to a route</h2>
        )}
      </>
    );
  }
};

export default PassengerEdit;
