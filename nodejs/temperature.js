var five = require("johnny-five"),
    board, sensor;

board = new five.Board();

board.on("ready", function() {
  sensor = new five.Sensor({ pin: 8, freq: 250 });
  board.repl.inject({
    sensor: sensor
  });

  sensor.on("change", function(err, reading) {
    var voltage = reading * .004882814;

    // For Fahrenheit
    // var temperature = (((voltage - .5) * 100)*1.8) + 32;

    // For Celsius
    var temperature = ((voltage - .5) * 100);

    console.log( arguments );
  });
});