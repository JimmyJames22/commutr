const User = require('../models/user');

exports.signup = (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    User.findOne({email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({error: "User with this email already exists."});
        }
        let newUser = new User({name, email, password});
        newUser.save((err, success) => {
            if(err) {
                console.log("Error in signup: ", err);
                return res.status(400), json({error: err})
            }
            res.json({
                message: "Signup success!"
            })
        })
    })
}