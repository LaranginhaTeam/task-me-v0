var express =require('express');
var app = express();
var http = require('http').Server(app);
var cors = require('cors')

let bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit:'10mb', extended: false}));

let port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log("port at: "+ port);
});

module.exports = app;