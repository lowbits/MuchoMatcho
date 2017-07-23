module.exports = function(io) {

    var express = require('express');
    var router = express.Router();
    var models = require('../models');
    var highscore = models.highscore; //the connection to users database
    var movies = models.movies;
    var item_factor_values = models.item_factor_values;

    var playerWaiting = [];
    var playerIngame = [];
    var games = [];



    /* GET users listing. */
    router.get('/', function(req, res, next) {
        highscore.findAll({
            limit: 10,
            order: [['Points', 'DESC']]
        }).then(users => {
            res.render('users.ejs', {
                "users": users,
                "username": req.session.username
            });
        });

    });



    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        playerWaiting.push(socket);
        io.emit('totalPlayers', playerWaiting.length + playerIngame.length);

        while (playerWaiting.length > 1) {
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






            io.emit('playerWaitingWaiting', playerWaiting.length);




        });

        socket.on('joinLobby', function(msg) {
            console.log('message: ' + msg);
        });


    });

    function makeGame(playerOne, playerTwo) {
        console.log("Server: Starting game between " + playerOne.id + " and " + playerTwo.id);
        var game = {};
        game.gameID = playerOne.id + playerTwo.id;
        game.playerOne = playerOne;
        game.playerTwo = playerTwo;
        game.factorID = getRandomFactorID();
        games.push(game);

        playerOne.game = game;
        playerOne.join(game.gameID);
        playerTwo.game = game;
        playerTwo.join(game.gameID)

        playerIngame.push(playerOne);
        playerIngame.push(playerTwo);

        io.to(game.gameID).emit('startGame', game.gameID);
        io.to(game.gameID).emit('movies', getMovieSelection(game.factorID));


    }

    function endGame(game) {

        //remove Game
        var index = games.indexOf(game);
        if (index > -1) {
            games.splice(index, 1);


            console.log("Ending Game with id " + game.gameID);
            io.to(game.gameID).emit('endGame');


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

    function getRandomFactorID(){
    	return  Math.floor((Math.random() * 20) + 3);
    }

    function getMovieSelection(factorID){

    	  return movies.findAll({
            limit: 10,
            
         include: [item_factor_values]});

    }


    return router;
};