/**
This code required a free SendGrip user account.
See http://sendgrid.com for further informations.
*/
const SENDGRID_USERNAME = "",
      SENDGRID_PASSWORD = "";

var five = require("johnny-five"),
    request = require('request'),
    board, button,
    SendGrid = require('sendgrid').SendGrid,
    sg = new SendGrid(SENDGRID_USERNAME, SENDGRID_PASSWORD),
    mail_recipient = "vincent.agnano+jokemail@scopyleft.fr",
    mail_from = "vincent.agnano+arduinotest@scopyleft.fr";


board = new five.Board();

board.on("ready", function() {
  button = new five.Button(8);
  led = new five.Led(13);

  board.repl.inject({
    button: button,
    led: led
  });

  button.on("down", function() {
    var joke;
    request("http://www.twilioestevez.com/api/v1/jokes/random.json", function(err, resp, body){
        joke = JSON.parse(body);
        console.log(joke);
        sg.send({
            to: mail_recipient,
            from: mail_from,
            subject: joke.question,
            text: joke.answer
        },function(succ, resp) {
            console.log("mail response : "+resp);
            }
        );
        led.on();
    });
  });

  button.on("hold", function() {
    led.off();
  });
});