# What is this?

This is a bowling scoring REST API, written in Javascript using [express](https://expressjs.com/). It lets you keep track of bowling scores for multiple players on multiple lanes through "user-friendly" GET and POST requests.

## To set up:

* npm install
* npm install -g nodemon
* nodemon index.js

## To start a new lane:
* `curl -X POST "http://localhost:3000/lane"`

## To view active lanes:
* `curl -X GET "http://localhost:3000/lane"`

## To create a new player:
* `curl -X POST "http://localhost:3000/lane/LANEID/player/PLAYERID"`
* example: `curl -X POST "http://localhost:3000/lane/0/player/bob"`

## To view active players:
* `curl -X GET "http://localhost:3000/lane/LANEID/player"`

## To view a player's score card:
* `curl -X GET "http://localhost:3000/lane/LANEID/player/PLAYERID"`
* example: `curl -X GET "http://localhost:3000/lane/0/player/bob"`

## To throw the ball:
* `curl -X POST "http://localhost:3000/lane/LANEID/player/PLAYERID/throw/PINSKNOCKEDDOWN"`
* example: `curl -X POST "http://localhost:3000/lane/0/player/bob/throw/8"`

This will knock down 8 pins, and move bob to the next throw or frame. You can view the results immediately by viewing the scorecard.
