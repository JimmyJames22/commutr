const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,

    useUnifiedTopology: true,

}).then(() => console.log("DB connection established"))
.catch(err => console.log("DB connection error:", err));