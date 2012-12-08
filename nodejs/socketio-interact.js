/**
Interact with an item inside a web page from your Arduino.

## Requirements

- Plug a potentiometer to pin A3 (see https://github.com/rwldrn/johnny-five/blob/master/docs/breadboard/potentiometer.png).


## How it works

1. Launch this script and open a web browser at http://localhost:8080
2. turn the potentiometer and see the shape inside the web page changing

*/
var server = require('http').createServer(serverHandler),
    fs = require('fs'),
    io = require('socket.io').listen(server),
    five = require('johnny-five'),
    board = new five.Board(),
    potentiometer,
    responseContent = ""
    potentiometerValue = 0;

server.listen(8080);

function serverHandler(request, response) {
    fs.readFile('./socketio-interact.html', function(err, content) {
        response.writeHead(200);
        return response.end(content);
    });
}

board.on("ready", function() {
    console.log("Server ready at http://localhost:8080");

    io.sockets.on('connection', function (socket) {
        potentiometer = new five.Sensor({
            pin: "A3",
            freq: 50
        });

        potentiometer.on("read", function( err, value ) {
            if(value == potentiometerValue) {
                return;
            }
            potentiometerValue = value;
            socket.emit('change', this.normalized);
        });
    });
});