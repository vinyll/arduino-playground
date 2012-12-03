/**
Get lights alerts when getting new tweets.

## Requirements

- Mount your Arduino following the artwino.jpg photo schema.
- Get a Twitter dev account and create an app at https://dev.twitter.com/apps
- Customize this script (constants below) with your Twitter dev account keys

### Notes about the schema

In the script below and schema attached the button is wired to pin 7, green
light to pin 8, orange light to pin 10 and red light to pin 12.
The breadboard is wired up to ground and 5V.

## How it works

This program will :
- blink all lights if an authentication error occurs
- turn on green light when a receiving a new timeline tweet
- turn on orange light when receiving a new mention
- turn on green light when a new direct message is recieved

Pressing button will reset the lights until the next tweets recieved
*/
const CONSUMER_KEY = "",
    CONSUMER_SECRET = "",
    ACCESS_TOKEN_KEY = "",
    ACCESS_TOKEN_SECRET = "",
    SEARCH_REFRESH = 60, // search delay in seconds
    ledActions = ['UserTimeline', 'Mentions', 'DirectMessages'];

var twitter = require('ntwitter'),
    five = require('johnny-five'),
    board = new five.Board(),
    leds = [],
    latestTweetId = {'UserTimeline':0, 'Mentions':0, 'DirectMessages':0},
    boardReady = false,
    twitterAuthenticated = null
    ;

var twit = new twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
});


board.on('ready', function() {
    leds = [five.Led(8), five.Led(10), five.Led(12)];
    button = five.Button(7);
    board.repl.inject({
       leds: leds,
       button: button
    });

    button.on('down', reset);

    twit.verifyCredentials(function (err, data) {
        if(!err) {
            setInterval(checkNewTweets, SEARCH_REFRESH*1000);
            checkNewTweets();
        }
        else {
            alertError();
        }
    });
});


function checkNewTweets() {
    ledActions.forEach(function(action, i) {
        twit["get"+action]({}, function(err, results) {
            var hasNew = results && results[0].id_str > latestTweetId[action];
            if(hasNew) {
                latestTweetId[action] = results[0].id_str;
                leds[i].on();
            }
        });
    });
}

function alertError() {
    console.error("Error authenticating. Please check your Twitter API keys.");
    leds.forEach(function(led) {
        led.strobe(200);
    });
}

function reset() {
    console.log("resetting lights.");
    leds.forEach(function(led) {
        led.off();
    });
}