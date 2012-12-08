var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function() {
  var sensor = new five.Sensor({
      pin: "A0",
      freq: 500
  });

  board.repl.inject({
    sensor: sensor
  });

  sensor.on("read", function() {
    console.log(this.normalized);
  });
});