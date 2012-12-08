/**
Control your Arduino from a browser web page.

## Requirements

- Plug a LED to pin 13.


## How it works

Launch this script and open a web browser at http://localhost:8080

This program will :
- turn light on or off from the web page.
- display light status.

Note that you may control the light status from your web browser's console.

*/
var server = require('http').createServer(serverHandler),
    fs = require('fs'),
    io = require('socket.io').listen(server),
    five = require('johnny-five'),
    board = new five.Board(),
    led,
    responseContent = "";

server.listen(8080);

function serverHandler(request, response) {
    fs.readFile('./socketio-led.html', function(err, content) {
        response.writeHead(200);
        return response.end(content);
    });
}

board.on("ready", function() {
    led = five.Led(13);
    console.log("Server ready at http://localhost:8080");
});

io.sockets.on('connection', function (socket) {
    socket.on('ledSwitch', function (data) {
        console.log("turning led ", data['action']);
        try {
            led[data['action']]();
        }
        catch(e) {
            console.log(e);
        }
        socket.emit('ledStatus', data['action']);
    });
});