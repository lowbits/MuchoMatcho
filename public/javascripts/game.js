var HOST = window.location.hostname + (location.port ? ':' + location.port : '');
var socket = io.connect(HOST);
var overlay = $("#overlay");
var overlayContent = $("#overlay-content");
var content = $("#content");
var movieGrid = $("#movieGrid");
var guessInput = $("#guessInput");
var guessForm = $("#guessForm");
var guessList = $("#guessList > ul");
var timer = $("#timer");
var team= $("#team");
var skip =$("#skip");
var playerCount = $("#playerCount");
var alreadyInitialized = false;
var highscore= $("#highscore");

socket.on('totalPlayers', function(count) {
    playerCount.html(count);
});

socket.on("connect_error", function(error) {
    overlayContent.text("Verbindung zum Server verloren... Warte auf Antwort");

    overlay.fadeIn();

});

socket.on('username', function() {
    if (alreadyInitialized) {
        location.reload();
    }
    overlayContent.html('Username:<br><form action="#"><input type="text" id="usernameInput" class="form-control" style="max-width:300px;display:inline-block;vertical-align: middle;" required autofocus><input type="submit" class="btn btn-primary btn-outline" value="OK"></form>');
    overlay.fadeIn();

});

socket.on('waiting', function() {

    overlayContent.text("Waiting for players...");
    overlay.fadeIn();
});

overlayContent.on('submit', 'form', function(e) {
    e.preventDefault();
    var username = $("#usernameInput").val();
    socket.emit("ready", username);
})

socket.on('startGame', function(gameID, matchNumber) {
    movieGrid.empty();
    guessList.empty();
    alreadyInitialized = true;

    overlayContent.text("Match! Starting game " + " with id " + gameID);

    setTimeout(function() {
        overlay.fadeOut();
        content.fadeIn();
    }, 1000);
    socket.emit('startGuessTime');
});

socket.on('endGame', function(score) {
    overlayContent.html("Game Over!<br><br>Score: " + score +'<br><br><button class="btn btn-primary btn-outline btn-lg" onclick="location.reload()">Neues Match...</button>');
    overlayContent.append(highscore.css({ 'color': 'black', "font-size": "50%", "width":"35%", "margin": "0 auto"}));
    overlay.fadeIn();

    socket.disconnect();
    socket.emit('stopGuessTime');
});

socket.on('movies', function(movie) {
    //console.log(movies);

    var directorsString = movie.directors[0].name;
    for (var i = 1; i < movie.directors.length; i++) {
        directorsString += ", " + movie.directors[i].name;
    };

    var actorsSring = movie.actors[0].name;
    for (var i = 1; i < movie.actors.length; i++) {
        actorsSring += ", " + movie.actors[i].name;
    };

    movieGrid.append('<div class="col-xs-6 col-md-4">\
    <div class="thumbnail">\
      <img src="' + movie.poster_link + '" alt="">\
      <div class="caption">\
        <h3>"' + movie.title + '"</h3>\
        <div class="panel-group">\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" href="#' + movie.movielens_id + 'plot" class="accordion-toggle collapsed">Plot</a>\
      </h4>\
    </div>\
    <div id="' + movie.movielens_id + 'plot" class="panel-collapse collapse">\
      <div class="panel-body">' + movie.plot + '</div>\
    </div>\
  </div>\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" href="#' + movie.movielens_id + 'trailer" class="accordion-toggle collapsed">Trailer</a>\
      </h4>\
    </div>\
    <div id="' + movie.movielens_id + 'trailer" class="panel-collapse collapse">\
      <div class="panel-body">\
<iframe id="ytplayer" style="width:100%" type="text/html" \
  src="https://www.youtube.com/embed/' + movie.trailer_youtube_id + '"\
  frameborder="0" allowfullscreen/>\
  </div>\
    </div>\
  </div>\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" href="#' + movie.movielens_id + 'directors" class="accordion-toggle collapsed">Directors</a>\
      </h4>\
    </div>\
    <div id="' + movie.movielens_id + 'directors" class="panel-collapse collapse">\
      <div class="panel-body">' + directorsString + '</div>\
    </div>\
  </div>\
   <div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" href="#' + movie.movielens_id + 'actors" class="accordion-toggle collapsed">Actors</a>\
      </h4>\
    </div>\
    <div id="' + movie.movielens_id + 'actors" class="panel-collapse collapse">\
      <div class="panel-body">' + actorsSring + '</div>\
    </div>\
  </div>\
</div>\
      </div>\
    </div>\
  </div>')

});

socket.on('wrongGuess', function(guess) {

    guessList.append('<li class="list-group-item"> <span class="glyphicon glyphicon-remove" style="color:darkred;margin-right:10px;"></span>' + guess + '</li>')
    var $t = guessList.parent();
    $t.scrollTop($t[0].scrollHeight);
    socket.emit('restartGuessTime');
});

socket.on('guessMatch', function(guess, time, score, globalScore) {

    overlayContent.html('Guess Match found!<br><br>' + guess + '<br>Time: ' + time +' seconds'+ '<br>Score: ' + score + '<br><br>Insgesamt: ' + globalScore + '<br><br>Nächste Runde startet in wenigen Sekunden...');

    overlay.fadeIn();
    // socket.disconnect();
    socket.emit('stopGuessTime');

});


var sec;
socket.on('globalTime', function(globalTime, score, globalScore, matchCount) {
  if(globalTime% 60<10){sec="0"+globalTime%60}else{sec=globalTime % 60}
    timer.html("<b>Verbleibende Zeit:</b> " + Math.floor(globalTime / 60) + ":" + globalTime% 60 + " - <b>Punkte:</b> " + score + " - <b>Insgesamt:</b> " + globalScore + " - <b>Matches:</b> " + matchCount);
});

socket.on('teamName', function(name) {
    team.html("<b>Team:</b> " + name);
});

guessForm.on("submit", function(e) {
    e.preventDefault();

    socket.emit("makeGuess", guessInput.val());

    guessInput.val("");
})

//Skip
skip.click(function(e){ 
  e.preventDefault();
  overlayContent.html("waiting for partners response...")
  overlay.fadeIn();
  socket.emit("skiprequest");
})
function abbrechen(){
  overlay.fadeOut();
   socket.emit('resume');
}
function skipping(){

  socket.emit("skipping");

}
socket.on('abgelehnt', function(){
  overlay.fadeOut();
})
socket.on('skipoverlay',function(){
  overlayContent.html('Ihr Partner möchte diese Runde Überspringen. Stimmen sie dem zu?<br><button type="button" class="btn btn-primary btn-outline btn-lg" id="agreetoskip" onclick="skipping();" style="vertical-align: middle;">Zustimmen</button><button type="button" class="btn btn-primary btn-outline btn-lg" id="abbrechen" onclick="abbrechen()" style="vertical-align: middle;margin-left:10px" >Abbrechen</button>');
  overlay.fadeIn();
})
socket.on('leeren', function(){
  overlay.fadeOut();
  movieGrid.empty();
  guessList.empty();
  socket.emit('restartGuessTime');
})
