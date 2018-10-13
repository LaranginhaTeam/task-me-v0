var app = require('express')();

let bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


let port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log("port at: "+ port);
});

module.exports = app;