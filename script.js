var guess = '';
var rowNum = 0;
var playing = true;

var rows = 6;

var letters = ['✓', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⌫'];

var ansr = (Math.floor(Math.random() * 9000000000) + 1000000000) + '';

function showWord(num) {
    let wrdArray = num.split("");
    
    let i = 0;
    let activeRow = $(".game-container .row").eq(rowNum).find(".square");
    let activeLetter = $(activeRow).first();

    for (const letter of wrdArray) {
        $(activeLetter).text(letter);
        activeLetter = $(activeLetter).next();
        i++;
    }
    
    while (i<10) {
        $(activeLetter).text("");
        activeLetter = $(activeLetter).next();
        i++;
    }
}

function errorShake() {
    $(".game-container").animate({left: '+=1em'}, "fast");
    $(".game-container").animate({left: '-=2em'}, "fast");
    $(".game-container").animate({left: '+=2em'}, "fast");
    $(".game-container").animate({left: '-=1em'}, "fast");
}

function testWord(num_in) {
    let activeRow = $(".game-container .row").eq(rowNum).find(".square");
    let activeLetter = $(activeRow).first();
    let word_chars = num_in.split("");
    let ans_chars = ansr.split("");
    let occurrences = [];

    for (let i=0; i<10; i++) {
        occurrences.push(ans_chars.filter(x => x === ''+i).length);
    }

    for (let i=0; i<=10; i++) {
        if (ans_chars.includes(word_chars[i]) && word_chars[i] == ans_chars[i]) {
            $(activeLetter).css("background-color", "green");
            $($(".letters .lttr").eq(letters.indexOf(word_chars[i]))).css("background-color", "green");
            occurrences[parseInt(word_chars[i])]--;
        }
        activeLetter = $(activeLetter).next();
    }

    activeLetter = $(activeRow).first();
    for (let i=0; i<=10; i++) {
        if (ans_chars.includes(word_chars[i]) && word_chars[i] != ans_chars[i]) {
            if (occurrences[parseInt(word_chars[i])] > 0) {
                $(activeLetter).css("background-color", "yellow");
                if ($($(".letters .lttr").eq(letters.indexOf(word_chars[i]))).css("background-color") != 'rgb(0, 128, 0)') {
                    $($(".letters .lttr").eq(letters.indexOf(word_chars[i]))).css("background-color", "yellow");
                }
                occurrences[parseInt(word_chars[i])]--;
            } else if ($(activeLetter).css("background-color") == 'rgba(0, 0, 0, 0)') {
                $(activeLetter).css("background-color", "gray");
            } else {
                console.log($(activeLetter).css("background-color"));
            }
        } else if ($(activeLetter).css("background-color") == 'rgba(0, 0, 0, 0)') {
            $(activeLetter).css("background-color", "gray");
            $($(".letters .lttr").eq(letters.indexOf(word_chars[i]))).css("background-color", "gray");
        }
        activeLetter = $(activeLetter).next();
    }

    if (num_in == ansr) {
        $(".game-container").after("<div class=\"win popup\">You Win!<div class=\"word-reveal\">press enter to play again</div></div>");
        playing = false;
        return
    } 
    if (rowNum == rows-1) {
        playing = false;
        $(".game-container").after("<div class=\"lose popup\">You lose!<div class=\"word-reveal\">The number was: " + ansr + "</div><div class=\"word-reveal\">press enter to play again</div></div>");
        return;
    }

    $(".game-container .row").eq(rowNum).css("background-color", "white");
    rowNum++;
    guess = "";
    if (rowNum < rows) {
        $(".game-container .row").eq(rowNum).css("background-color", "lightgray");
    }

}

function GenerateBoard(height) {
    for (let r = 0; r < height; r++) {
        $(".game-container").append("<div class=\"row\"></div>");
        for (let r = 0; r < 10; r++) {
            $(".game-container .row").last().append("<div class=\"square\"></div>");
        }
    }

    $(".game-container .row").eq(rowNum).css("background-color", "lightgray");

    $(".game-container").after("<div class=\"letters\"><div>");

    letters.forEach(lttr => {
        $(".letters").append("<div class=\"lttr\">" + lttr + "</div>");
    });
}

$(document).ready(function () {
    GenerateBoard(rows);

    $("body").keydown(function (e) {
        if (playing) {
            if (e.which >= 48 && e.which <= 57 && guess.length < 10) {
                guess = guess + String.fromCharCode(e.which);
            } else if (e.which == 8) {
                guess = guess.slice(0, -1);
            } else if (e.which == 13) {
                if (rowNum < rows && guess.length == 10) {
                    testWord(guess);
                } else {
                    errorShake();
                }
            }
            showWord(guess);
        }
        else if (e.which == 13) {
            location.reload();
        }
    });
        
    $(".lttr").click(function (e) { 
        e.preventDefault();
        let letter = $(this).text();
        if (playing) {
            if (rowNum < rows) {
                if (letter == "✓") {
                    if (guess.length == 10) {
                        testWord(guess);
                        return;
                    } else {
                        errorShake();
                        return;
                    }
                }
                if (letter == "⌫") {
                    guess = guess.slice(0, -1);
                    showWord(guess);
                    return;
                }
                if (guess.length < 10) {
                    guess = guess + letter;
                    showWord(guess);
                }
            } else {
                errorShake();
            }
        } else if (letter == "✓" && playing == false) {
            location.reload();
        }
    });
});
