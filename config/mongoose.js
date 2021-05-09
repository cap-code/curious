const mongoose = require('mongoose');
require('dotenv').config();
module.exports = (app,dburi,port) =>{
    mongoose.connect(dburi, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(res => {
        console.log("connected");
        app.listen(port,()=>{console.log("http://localhost:3000")});
    }).catch(err => console.log(err));
    mongoose.Promise = global.Promise;
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGHUP", cleanup);
    if (app) {
        app.set("mongoose", mongoose);
    }
}
function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}