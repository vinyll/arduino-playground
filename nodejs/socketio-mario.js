/**
Use your Arduino breadboard as a gamepad and play Mario in your browser.

## Requirements

- Plug a joystick to pin A1 and A2
- Plug a button to pin 8

See https://github.com/vinyll/arduino-playground/blob/master/nodejs/socketio-mario.png

## How it works

1. Launch this script and open a web browser at http://localhost:8080
2. press the button to start or jump. Move the joystick around to move.

*/
var server = require('http').createServer(serverHandler),
    fs = require('fs'),
    io = require('socket.io').listen(server),
    five = require('johnny-five'),
    board = new five.Board(),
    button,
    newStickValues = [0, 0],
    previousStickValues = [0, 0];

server.listen(8080);


function serverHandler(request, response) {
    url = "."+request.url
    if(url == './')
        url += 'socketio-mario.html'
    fs.readFile(url, function(err, content) {
        response.writeHead(200);
        return response.end(content);
    });
}

board.on("ready", function() {
    console.log("Server ready at http://localhost:8080");

    io.sockets.on('connection', function (socket) {
        joystick = new five.Joystick({
          pins: [ "A1", "A2" ],
          freq: 50
        });
        button = new five.Button(8);

        joystick.on("axismove", function( err, timestamp ) {
            newStickValues = [this.fixed.x, this.fixed.y];
            if(newStickValues[0] == previousStickValues[0] && newStickValues[1] == previousStickValues[1]) {
                return false;
            }
            previousStickValues = newStickValues;
            socket.emit('move', [-(newStickValues[0]-.5)*2, -(newStickValues[1]-.5)*2]);
        });
        button.on('down', function() {
            socket.emit('button', true);
        });
        button.on('up', function() {
            socket.emit('button', false);
        });
    });
});