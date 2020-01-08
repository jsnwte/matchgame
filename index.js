const levels = [200, 180, 160, 140, 120, 100, 80, 60, 40, 20]; // 10 levels in 20 second decrements
const themes = ["Alpha", "Alphanumeric"];
const board = document.querySelector("#board");
const options = document.querySelector("#options");
const msg = document.querySelector("#msg");
const newgameopt = document.querySelectorAll("#newgameopt label");
const themeopt = document.querySelector("#themeopt");
const levelopt = document.querySelector("#levelopt");
const level = document.querySelector("#level");
const matches = document.querySelector("#matches");
const timer = document.querySelector("#timer");
let clock; // timer ref running setTimer() every second to update level time
let seconds; // tracking time left in level
let choice; // ref for first piece player clicks during gameplay

document.querySelector("#newgame").onclick = () => {
    if (msg.style.display != "none" && msg.innerText != "") { // msg is showing, hide and show new game options
        msg.style.display = "none";
        for (i = 0; i < newgameopt.length; i++) {
            newgameopt[i].style.display = "inline";
        }
        levelopt.focus();
    } else { // options selected, start the new game
        let choices = [];
        let pieces = [];
        let randomPiece;
        let randomChoice;
        let newDiv; // piece container
        let newSpan; // piece content

        matches.innerText = 0;
        level.innerText = levelopt.value;
        seconds = levels[Number(level.innerText) - 1];
        setTimer();

        // Get theme choices
        switch(Number(themeopt.value)) {
            case 0: // Alpha
                for (i = 65; i < 91; i++) {
                    choices.push(String.fromCharCode(i));
                }
                break;
            case 1: // Alphanumeric
                for (i = 65; i < 91; i++) {
                    choices.push(String.fromCharCode(i));
                }
                for (i = 0; i < 10; i++) {
                    choices.push(i.toString());
                }
                break;
            default:
                // placeholder for future themes
        }

        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        for (i = 1; i < 21; i++) {
            pieces.push(i);
            newDiv = document.createElement("div");
            newSpan = document.createElement("span");
            newDiv.setAttribute("piece", newSpan.innerText = i);
            newDiv.appendChild(newSpan);
            board.appendChild(newDiv);
            newDiv.onclick = clickPiece;
        }

        // Randomly assign theme choices to pieces
        while (pieces.length > 0) {
            if (pieces.length > 2) {
                randomChoice = Math.floor(Math.random() * choices.length);
                randomPiece = Math.floor(Math.random() * pieces.length);
                board.children[pieces[randomPiece] - 1].setAttribute("value", choices[randomChoice]);
                pieces.splice(randomPiece, 1);
                randomPiece = Math.floor(Math.random() * pieces.length);
                board.children[pieces[randomPiece] - 1].setAttribute("value", choices[randomChoice]);
                pieces.splice(randomPiece, 1);
                choices.splice(randomChoice, 1);
            } else {
                randomChoice = Math.floor(Math.random() * choices.length);
                board.children[pieces[0] - 1].setAttribute("value", choices[randomChoice]);
                board.children[pieces[1] - 1].setAttribute("value", choices[randomChoice]);
                pieces.splice(0, 2);
            }
        }

        options.style.display = "none";
        clock = setInterval(setTimer, 1000);
    }
}

function clickPiece(e) {
    /* This event handler fires regardless of which part of the piece user clicks which in testing caused some
    undesired effects. The following check and refs ensure we are modifying the intended part of the board piece */
    let div; let span;
    if (e.target.getAttribute("piece") != null) {
        div = e.target; span = e.target.firstChild;
    } else {
        div = e.target.parentNode; span = e.target;
    }

    if (div.getAttribute("matched") === null) {
        if (choice === "" || choice === undefined) {
            choice = div.getAttribute("piece");
        }
    }

}

function setTimer() {
    if (seconds - (Math.floor(seconds / 60) * 60) < 10) {
        // Seconds difference between minutes subtracted from total seconds left is less than 10, add prefixed 0
        timer.innerText = Math.floor(seconds / 60) + ":0" + (seconds - (Math.floor(seconds / 60) * 60));
    } else {
        timer.innerText = Math.floor(seconds / 60) + ":" + (seconds - (Math.floor(seconds / 60) * 60));
    }
    seconds--

    if (seconds < 0) {
        // game over, player didn't complete the board in time
        clearInterval(clock);
        for (i = 0; i < newgameopt.length; i++) {
            newgameopt[i].style.display = "none";
        }
        msg.innerText = "Game over, ran out of time!";
        msg.style.display = "block";
        options.style.display = "block";
    }
}

function setupGameOptions() {
    let newOption;

    // Setup level selection
    for (i = 0; i < levels.length; i++) {
        newOption = document.createElement("option");
        newOption.setAttribute("value", newOption.innerText = i + 1);
        levelopt.appendChild(newOption);
    }

    // Setup theme selection
    for (i = 0; i < themes.length; i++) {
        newOption = document.createElement("option");
        newOption.setAttribute("value", i);
        newOption.innerText = themes[i]
        themeopt.appendChild(newOption);
    }

    levelopt.focus();
}

setupGameOptions();