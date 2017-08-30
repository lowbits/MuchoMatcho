module.exports = function(io) {
    var Promise = require('bluebird');

    var express = require('express');
    var router = express.Router();
    var models = require('../models');
    var highscore = models.highscore;
    var movies = models.movies;
    var label = models.label;
    var directors = models.directors;
    var actors = models.actors;
    var item_factor_values = models.item_factor_values;
    var collected_data = models.collected_data;

    var factor_candidates= models.factor_candidates;

    var playerWaiting = [];
    var playerIngame = [];
    var games = [];

   // var factor_array=[];

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
        
        socket.emit("username");


        socket.on('ready', function(username) {

            socket.guesses = [];
            socket.username = username;

            console.log(socket.username + " waiting");
            socket.emit("waiting");
            playerWaiting.push(socket);

            if (playerWaiting.length > 1) {

                makeGame(playerWaiting.shift(), playerWaiting.shift());

       
            }

            io.emit('totalPlayers', (playerWaiting.length + playerIngame.length));
            
        })
        socket.guessTime=0;

        startGuessTimer = function(socket) {
            socket.guessTime=0;
            socket.guessTimer = setInterval(function() {
                socket.guessTime++;
            }, 1000);
        };

        stopGuessTimer = function(socket) {
            clearInterval(socket.guessTimer);
        };
      
        socket.on('disconnect', function() {
            console.log(this.id + ' disconnected');
            socket.game.factor_array=[];
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

                collected_data.create({
                    game_id: socket.game.gameID,
                    user: socket.username,
                    guess: guess,
                    guess_time: socket.guessTime,
                    matching_guess: guess,
                    matching_time:socket.game.matchTime,
                    already_matched:socket.game.matches,
                    factor_id: socket.game.factorID,
                    movie_1: socket.game.movielist[0].title,
                    movie_2: socket.game.movielist[1].title,
                    movie_3: socket.game.movielist[2].title,
                    skipped: false,
                    skip_time:"",
                });

                   
               // saveLabel(socket, guess);
                    
                socket.game.stopMatchTimer();
                
                socket.game.score += calculateScore(socket.game.matchTime);
                io.to(socket.game.gameID).emit('guessMatch', guess, socket.game.matchTime, calculateScore(socket.game.matchTime), socket.game.score);

                setTimeout(function() {
                    newRound(socket.game);

                }, 5000);

        
            } else {
                console.log("no guess match");
                collected_data.create({
                    game_id: socket.game.gameID,
                    user: socket.username,
                    guess: guess,
                    guess_time: socket.guessTime,
                    matching_guess: "",
                    matching_time:"",
                    already_matched:socket.game.matches,
                    factor_id: socket.game.factorID,
                    movie_1: socket.game.movielist[0].title,
                    movie_2: socket.game.movielist[1].title,
                    movie_3: socket.game.movielist[2].title,
                    skipped: false,
                    skip_time:"",
                
                });
                
                if (socket.guesses.indexOf(guess) > -1) {
                    console.log("duplicate guess");
                } else {
                    socket.guesses.push(guess);

                }

                socket.emit("wrongGuess", guess);

            }

        });

            
        //skip
        socket.on('skiprequest',function(){
           socket.broadcast.to(socket.game.gameID).emit('skipoverlay');
        });
        socket.on('resume',function(){
            socket.broadcast.to(socket.game.gameID).emit('abgelehnt');
        })
        socket.on('skipping', function(){
            socket.game.score-=250;
            io.to(socket.game.gameID).emit("leeren");
            
            console.log("skipped factorID: "+socket.game.factorID);
            socket.game.playerOne.guesses = [];
            socket.game.playerTwo.guesses = [];
        
            socket.game.stopMatchTimer();
            socket.game.startMatchTimer();
          collected_data.create({
                    game_id: socket.game.gameID,
                    user: "",
                    guess: "",
                    guess_time: "",
                    matching_guess: "",
                    matching_time:"",
                    already_matched:socket.game.matches,
                    factor_id: socket.game.factorID,
                    movie_1: socket.game.movielist[0].title,
                    movie_2: socket.game.movielist[1].title,
                    movie_3: socket.game.movielist[2].title,
                    skipped: true,
                    skip_time:socket.game.skipTime,
                });
          
            socket.game.factorID = getRandomFactorID(socket.game);
             getMovieSelection(socket.game.factorID).then(movies => {

            movies.forEach(movie => {
                Promise.all([getDirectors(movie.movielens_id), getActors(movie.movielens_id)]).spread(function(directors, actors) {
                    movie.dataValues.directors = directors;
                    movie.dataValues.actors = actors;
                    socket.game.movielist=movies;
                    io.to(socket.game.gameID).emit('movies', movie);

                })

            });
            
        });  

          socket.game.stopSkipTimer();       
          socket.game.startSkipTimer();
        })
        socket.on('startGuessTime',function(){
            startGuessTimer(socket);
        });
        socket.on('stopGuessTime',function(){
            stopGuessTimer(socket);
        })
        socket.on('restartGuessTime', function(){
            stopGuessTimer(socket);
            startGuessTimer(socket);
        })
      
    });

  


    function makeGame(playerOne, playerTwo) {
        console.log("Server: Starting game between " + playerOne.username + " and " + playerTwo.username);
        
        var game = {};
        game.gameID = playerOne.id + playerTwo.id;
        game.score = 0;
        game.matches = 0;
        game.playerOne = playerOne;
        game.playerTwo = playerTwo;
       
        game.movielist = [];
        game.factor_array=[];
        fillFactorArray(game);
        game.factorID = getRandomFactorID(game);
        game.getOtherPlayer = function(player) {
            if (game.playerOne == player)
                return playerTwo;
            else
                return playerOne;
        };

        game.globalTime = 300;
        game.matchTime = 0;
        game.skipTime = 0;

        game.startMatchTimer = function() {
            game.matchTime = 0;

            game.matchTimer = setInterval(function() {
                game.matchTime++;
                // io.to(game.gameID).emit('time', game.matchTime++, calculateScore(game.matchTime));
                io.to(game.gameID).emit('globalTime', game.globalTime--, calculateScore(game.matchTime), game.score, game.matches);

                if (game.globalTime < 0) {
                    endGame(game);
                    saveHighscore(game);
                }

            }, 1000)
        };
        game.stopMatchTimer = function() {
            clearInterval(game.matchTimer);

        };
        game.startSkipTimer = function() {
            game.skipTime = 0;

            game.skipTimer = setInterval(function() {
                game.skipTime++;
            
            }, 1000)
        };
        game.stopSkipTimer = function() {
            clearInterval(game.skipTimer);

        };
         

       
        games.push(game);

        playerOne.game = game;
        playerOne.join(game.gameID);
        playerTwo.game = game;
        playerTwo.join(game.gameID)

        playerIngame.push(playerOne);
        playerIngame.push(playerTwo);

        startGame(game);

    }

    function startGame(game) {
        game.startMatchTimer();
        game.startSkipTimer();

        io.to(game.gameID).emit('startGame', game.playerOne.username + " and " + game.playerTwo.username, game.matches);
        io.to(game.gameID).emit('teamName',game.playerOne.username + " and " + game.playerTwo.username, game.matches);
        getMovieSelection(game.factorID).then(movies => {

            movies.forEach(movie => {
                Promise.all([getDirectors(movie.movielens_id), getActors(movie.movielens_id)]).spread(function(directors, actors) {
                    movie.dataValues.directors = directors;
                    movie.dataValues.actors = actors;
                    game.movielist=movies;
                    io.to(game.gameID).emit('movies', movie);

                })

            });

        });
    }

    function newRound(game) {
        game.stopSkipTimer();
        game.matches++;
        game.factorID = getRandomFactorID(game);
        game.playerOne.guesses = [];
        game.playerTwo.guesses = [];
        startGame(game);

    }

    function endGame(game) {

        //remove Game
        game.stopMatchTimer();
        game.stopSkipTimer();
        io.to(game.gameID).emit('endGame', game.score);

        var index = games.indexOf(game);
        if (index > -1) {
            games.splice(index, 1);

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
 
    function fillFactorArray(game){
         for (var i = 3; i <= 10; i++) {
            game.factor_array.push(i);
        }
        shuffle(game.factor_array);
    }
    
    function getRandomFactorID(game) {
        if(game.factor_array.length<1){
        fillFactorArray(game);
        }
        var factor= game.factor_array[0];
        console.log(game.factor_array);
        game.factor_array.shift();
        console.log("shuffled: "+game.factor_array);
        console.log("current factorID: "+factor);
        // var factor= Math.floor((Math.random() * 7) + 3);
        // console.log(factor);
        return factor;
        
    }

    function getDirectors(movieID) {
        return directors.findAll({
            include: [{
                model: models.movies,
                where: {
                    'movielens_id': movieID
                }
            }]

        });
    }

    function getActors(movieID) {
        return actors.findAll({
            include: [{
                model: models.movies,
                where: {
                    'movielens_id': movieID
                }
            }]
        });
    }

    
    function getMovieSelection(factorID) {

        return movies.findAll({

            limit: 25,
             order: [
                [{
                     model: factor_candidates,
                     as: 'factor_value'
                }, 'rank', 'DESC']
             ],

            include: [{
                model: factor_candidates,
                as: 'factor_value',
                where: {
                    'factor_index': factorID
                }
            }]
        }).then(movies => {
            shuffle(movies);
            movies = movies.slice(0, 3);

            return movies;

        });

    }
    function saveLabel(socket, guess){
        var temp= socket.game.getOtherPlayer(socket).guesses.concat(socket.guesses);
        label.create({
            factor_index: socket.game.factorID,
            matching_input: guess,
            guesses: temp.toString()
        });
    }
    function saveHighscore(game){
        highscore.create({
            Points: game.score,
            Usernames: game.playerOne.username + " and " + game.playerTwo.username
            

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

    function calculateScore(time) {
        return parseInt(1000 * Math.pow(0.95, time / 10));
    }

    return router;
};