const accountSid = 'ACe107dd9cb9df02909432ffb982eeae31'; 
const authToken = 'f90f72a0e9e0b383b20a565db1e12078'; 

const client = require('twilio')(accountSid, authToken); 

exports.driveRequest = (req, res) => {
    const {phoneNumber} = req.body;

    client.messages 
      .create({ 
         body: 'Time to go! One of your passengers has requested a ride.',  
         messagingServiceSid: 'MGa43ec52b58d76e21189658edc0e95fa3', 
         to: phoneNumber
       }) 
      .then(message => {console.log(message.sid);
            res.json({
                message: message.sid
            })}
      ) 
      .done();
}

exports.driveNotification = (req, res) => {
    const {phoneNumber, timeEst} = req.body;
    
    client.messages
      .create({ 
         body: 'Your driver has begun a route. Estimated time: '+timeEst+' minutes',  
         messagingServiceSid: 'MGa43ec52b58d76e21189658edc0e95fa3', 
         to: phoneNumber
       }) 
      .then(message => {console.log(message.sid);
                        res.json({
                            message: message.sid
                })}
      ) 
      .done();
}