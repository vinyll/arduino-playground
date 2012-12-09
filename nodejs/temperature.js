var five = require("johnny-five"),
    board, sensor;

board = new five.Board();

board.on("ready", function() {
  sensor = new five.Sensor({ pin: 8, freq: 250 });

  sensor.on("change", function(err, reading) {
    var voltage = reading * .004882814;

    // For Celsius
    var temperature = ((voltage - .5) * 100);

    // For Fahrenheit
    // var temperature = (((voltage - .5) * 100)*1.8) + 32;

    console.log( temperature );
  });
});