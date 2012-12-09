var five = require("johnny-five"),
    board = new five.Board()
    red, green, blue;

board.on("ready", function() {
  var red = new five.Led(12);
  var green = new five.Led(10);
  var blue = new five.Led(8);

  var leds = new five.Leds();

  board.repl.inject({
    leds: leds
  });

  leds.pulse();
});