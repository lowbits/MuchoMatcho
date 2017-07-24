module.exports = function(io) {

    var express = require('express');
    var router = express.Router();
    var models = require('../models');
    var highscore = models.highscore;
    var movies = models.movies;
    var directors = models.directors;
    var item_factor_values = models.item_factor_values;

    var playerWaiting = [];
    var playerIngame = [];
    var games = [];




    router.get('/', function(req, res, next) {
        highscore.findAll({
            limit: 10,
            order: [
                ['Points', 'DESC']
            ]
        }).then(highscores => {
            res.render('index.ejs', {
                "highscores": highscores
            });
        });

    });



    io.on('connection', function(socket) {

        console.log(socket.id + ' connected');
        socket.guesses = [];

        socket.emit("waiting");
        playerWaiting.push(socket);

        if (playerWaiting.length > 1) {


            makeGame(playerWaiting.shift(), playerWaiting.shift());


        }



        socket.on('disconnect', function() {
            console.log(this.id + ' disconnected');

            if (this.game) {
                endGame(this.game);
            } else {
                var index = playerWaiting.indexOf(this);
                if (index > -1) {
                    playerWaiting.splice(index, 1);
                };

            }






            io.emit('totalPlayers', (playerWaiting.length + playerIngame.length));




        });




        socket.on('makeGuess', function(guess) {
            guess = guess.toLowerCase().trim();
            console.log(socket.id + ' made guess: ' + guess);
            if (socket.game.getOtherPlayer(socket).guesses.indexOf(guess) > -1) {
                console.log("guess match found!");
                socket.game.stopTimer();
                io.to(socket.game.gameID).emit('guessMatch', guess, socket.game.time, calculateScore(socket.game.time));
                highscore.build({Points: calculateScore(socket.game.time)}).save();

            } else {
                console.log("no guess match");
                if (socket.guesses.indexOf(guess) > -1) {
                    console.log("duplicate guess");
                } else {
                    socket.guesses.push(guess);

                }

                socket.emit("wrongGuess", guess);

            }
        });

        io.emit('totalPlayers', (playerWaiting.length + playerIngame.length));

    });

    function makeGame(playerOne, playerTwo) {
        console.log("Server: Starting game between " + playerOne.id + " and " + playerTwo.id);
        var game = {};
        game.gameID = playerOne.id + playerTwo.id;
        game.playerOne = playerOne;
        game.playerTwo = playerTwo;
        game.factorID = getRandomFactorID();
        game.getOtherPlayer = function(player) {
            if (game.playerOne == player)
                return playerTwo;
            else
                return playerOne;
        };
        game.time = 0;

        game.timer = setInterval(function() {
            io.to(game.gameID).emit('time', game.time++, calculateScore(game.time));


        }, 1000);

        game.stopTimer = function() {
            clearInterval(game.timer);
        };
        games.push(game);

        playerOne.game = game;
        playerOne.join(game.gameID);
        playerTwo.game = game;
        playerTwo.join(game.gameID)



        playerIngame.push(playerOne);
        playerIngame.push(playerTwo);

        io.to(game.gameID).emit('startGame', game.gameID);
        //    game.startTimer();

        getMovieSelection(game.factorID).then(movies => {
            io.to(game.gameID).emit('movies', movies);
        });


    }

    function endGame(game) {

        //remove Game
        io.to(game.gameID).emit('endGame');

        var index = games.indexOf(game);
        if (index > -1) {
            games.splice(index, 1);
            game.stopTimer();


            console.log("Ending Game with id " + game.gameID);


            index = playerIngame.indexOf(game.playerOne);
            if (index > -1) {
                playerIngame.splice(index, 1);
            };
            index = playerIngame.indexOf(game.playerTwo);
            if (index > -1) {
                playerIngame.splice(index, 1);
            };
        }

    };

    function getRandomFactorID() {
        return Math.floor((Math.random() * 20) + 3);
    }

    function getMovieSelection(factorID) {

        return item_factor_values.findAll({

            where: {
                factor_index: factorID
            },
            limit: 100,
            order: [
                ['value', 'DESC']
            ],

            include: [{
            model: movies,
            required: false

            // include: [{
            //     model: directors,
            //      where: {},
            //      required: false
            // }]
        }]
        }).then(movies => {
            console.log(movies.length);
            shuffle(movies);
            movies = movies.slice(0, 3);
            movies.forEach(function(movie) {
                // console.log(Object.getOwnPropertyNames(movie));
            });
            return movies;

        });

    }

    function shuffle(array) {
        var i = 0,
            j = 0,
            temp = null

        for (i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    function calculateScore(time){
        return parseInt(1000 * Math.pow(0.95, time/10));
    }


    return router;
};