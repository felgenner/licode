/*global require, __dirname, console*/
var express = require('express'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    morgan = require('morgan'),
    net = require('net'),
    N = require('./nuve'),
    fs = require("fs"),
    https = require("https"),
        config = require('./../../licode_config');

var options = {
    key: fs.readFileSync('cert/private.key').toString(),
    cert: fs.readFileSync('cert/certificate_bundled.crt').toString()
};

var app = express();

// app.configure ya no existe
"use strict";
app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, 'http://localhost:3000/');

app.post('/createToken/', function(req, res) {
    "use strict";
    var needRoom = req.body.room,
        username = req.body.username,
        role = req.body.role;

    var myRoom = null;

    N.API.getRooms(function(roomlist) {
        "use strict";
        var rooms = JSON.parse(roomlist);

        for (var room in rooms) {
            if (rooms[room].name === needRoom){
                myRoom = rooms[room]._id;
            }
        }
        if (!myRoom) {
            N.API.createRoom(needRoom, function(roomID) {
                console.log('Created room ', roomID);
                createToken(roomID._id, username, role, res)
            });
        } else {
            console.log('Using room', needRoom);
            createToken(myRoom, username, role, res)
        }
    });
});

function createToken(roomId, username, role, res) {
    N.API.createToken(roomId, username, role, function(token) {
        console.log(token);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
        res.header('Access-Control-Allow-Headers', 'origin, content-type');
        res.send(token);
    });
}

app.use(function(req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});



app.listen(3001);

var server = https.createServer(options, app);
server.listen(3004);
