var Hubbers = [
{"name":"Dorien","avatar_url":"/images/memory/Dorien.png"},
{"name":"BFC", "avatar_url":"/images/memory/BFC.png"},
{"name":"Caro", "avatar_url":"/images/memory/Caro.png"},
{"name":"Eline", "avatar_url":"/images/memory/Eline.png"},
{"name":"Fekkes", "avatar_url":"/images/memory/Fekkes.png"},
{"name":"Fleur", "avatar_url":"/images/memory/Fleur.png"},
{"name":"Fredje", "avatar_url":"/images/memory/Fredje.png"},
{"name":"Julia", "avatar_url":"/images/memory/Julia.png"},
{"name":"Lore", "avatar_url":"/images/memory/Lore.png"},
{"name":"Robbe", "avatar_url":"/images/memory/Robbe.png"},
{"name":"Roxan", "avatar_url":"/images/memory/Roxan.png"},
{"name":"Sofie", "avatar_url":"/images/memory/Sofie.png"},
{"name":"Vincent", "avatar_url":"/images/memory/Vincent.png"},
{"name":"Ward", "avatar_url":"/images/memory/Ward.png"}
];


var matchingGame = {
    elapsedTime: 0
};

matchingGame.deck = []

function getHubbers(callback) {
    window.data = shuffle(Hubbers).slice(0,1);
    callback(window.data);
}

// http://stackoverflow.com/a/2450976/1420197
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function selectCard() {
	if ($(".card-flipped").size() > 1) {
		return;
	}
	$(this).addClass("card-flipped");
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,1400);
	}
}

function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
	if ($(".card").length == 0) {
		gameover();
	}
}

function gameover() {
	clearInterval(matchingGame.timer);
	$(".score").html($("#elapsed-time").html());

	var lastScore = localStorage.getItem("last-score");
	var lastScoreObj = JSON.parse(lastScore);
	if (lastScoreObj == null) {
		lastScoreObj = {"savedTime": "no record", "score": 0};
	}
	var lastElapsedTime = lastScoreObj.score;
	var minute = Math.floor(lastElapsedTime / 60);
	var second = lastElapsedTime % 60;
	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$(".last-score").html(minute+":"+second);
	var savedTime = lastScoreObj.savedTime;
	$(".saved-time").html(savedTime);

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	var seconds = currentTime.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	var now = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
	var obj = {
		"savedTime": now,
		"score": matchingGame.elapsedTime
	};
	localStorage.setItem("last-score", JSON.stringify(obj));

	if (lastElapsedTime == 0 || matchingGame.elapsedTime < lastElapsedTime) {
		$(".ribbon").removeClass("hide");
	}

	$("#popup").removeClass("hide");
}

function countTimer() {
	matchingGame.elapsedTime++;
	var minute = Math.floor(matchingGame.elapsedTime / 60);
	var second = matchingGame.elapsedTime % 60;

	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$("#elapsed-time").html(minute+":"+second);
}

var template = {};

$(() => {
  template.card = $('.card:first-child').remove(); 
});

function commenceTheMemory(){
    $("#popup").addClass('hide');
    $('#memoryview').show();

    var $cards = $("#cards");
    var $loader = $("#loader");

    $cards.hide();
    getHubbers(function (hubbers) {
        matchingGame.deck = [];
        matchingGame.elapsedTime = 0;
        for (var i = 0; i < hubbers.length; ++i) {
            matchingGame.deck.push(hubbers[i], hubbers[i]);
        }
        shuffle(matchingGame.deck);
        for(var i=0;i<2;i++){
            template.card.clone().appendTo($cards);
        }
        $cards.children().each(function(index) {
            var $this = $(this);
            $this.css({
                'left': ($this.width() + 15) * (index % 4),
                'top': ($this.height() + 15) * Math.floor(index / 4)
            });

            var Hubber = matchingGame.deck.pop();

            // This is some shit - we are going to dynamically apply css to the card(s).
            $this
                .css("background", "#efefef url(" + Hubber.avatar_url + ")")
                .css("background-size", "128px 128px")

            $this.attr('data-pattern', Hubber.name);
            $this.find(".name").text(Hubber.name);

            $this.click(selectCard);
        });
        $cards.fadeIn();
        $loader.fadeOut();
        matchingGame.timer = setInterval(countTimer, 1000);
    });
}
