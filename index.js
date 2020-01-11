const levels = [300, 270, 240, 210, 180, 150, 120, 90, 60, 30]; // 10 levels in 30 second decrements
const themes = ["Colors", "Alpha", "Alphanumeric", "Technology"];
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

document.querySelector("#about").onclick = () => {
    document.querySelector("#about").style.display = "none";
    msg.style.textAlign = "left";
    showMsg("Can you match all pieces on the board before time runs out? Select from " + themes.length + " themes and " + levels.length + " levels of matching fun. This game was developed by Justin White using HTML, CSS, Javascript, Flexbox, and Grid. Check out the code on <a target='_blank' href='https://github.com/jsnwte/matchgame'>GitHub</a>.");
}

document.querySelector("#newgame").onclick = () => {
    msg.style.textAlign = "center";
    if (msg.style.display != "none" && msg.innerText != "") { // msg is showing, hide and show new game options
        document.querySelector("#about").style.display = "inline";
        msg.style.display = "none";
        for (i = 0; i < newgameopt.length; i++) {
            newgameopt[i].style.display = "inline";
        }
        levelopt.focus();
    } else { // options selected, start the new game
        matches.innerText = 0;
        level.innerText = levelopt.value;
        newGame();
        options.style.display = "none";
    }
}

function showMsg(message) {
    for (i = 0; i < newgameopt.length; i++) {
        newgameopt[i].style.display = "none";
    }
    msg.innerHTML = message;
    msg.style.display = "block";
    options.style.display = "block";
}

function newGame() {
    let choices = [];
    let pieces = [];
    let randomPiece;
    let randomChoice;
    let newDiv; // piece container
    let newSpan; // piece content

    seconds = levels[Number(level.innerText) - 1];
    setTimer();

    // Get theme choices
    switch(Number(themeopt.value)) {
        case 0: // Colors
            choices = ["blue", "yellow", "green", "orange", "gray", "black", "white", "red", "purple", "pink"];
            break;
        case 1: // Alpha
            for (i = 65; i < 91; i++) {
                choices.push(String.fromCharCode(i));
            }
            break;
        case 2: // Alphanumeric
            for (i = 65; i < 91; i++) {
                choices.push(String.fromCharCode(i));
            }
            for (i = 0; i < 10; i++) {
                choices.push(i.toString());
            }
            break;
        case 3: // Technology
            for (i = 1; i < 33; i++) {
                choices.push("themes/Technology/" + i.toString() + ".png");
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
        newDiv.setAttribute("class", "buttonStyle");
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

    clock = setInterval(setTimer, 1000);
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

    // Run only if piece wasn't previously matched or selected as the choice
    if (div.getAttribute("matched") === null && choice != div) {
        // Display content correctly based on theme
        switch (Number(themeopt.value)) {
            case 0: // Colors
                span.style.backgroundColor = div.getAttribute("value");
                span.innerText = div.getAttribute("value");
                break;
            case 1: // Alpha
            case 2: // Alphanumeric
                span.innerText = div.getAttribute("value");
                break;
            default: // Technology
                span.innerHTML = "<img src='" + div.getAttribute("value") + "' width='50px' height='50px'>";
        }

        if (choice === "" || choice === undefined) {
            choice = div;
            div.style.border = "1.5px solid blue";
        } else if (choice.getAttribute("value") === div.getAttribute("value")) {
            matches.innerText = Number(matches.innerText) + 1;
            choice.setAttribute("matched", "");
            choice.style.backgroundColor = "rgb(136, 115, 9)";
            choice.style.border = "none";
            choice.firstChild.style.color = "rgb(48, 43, 17)";
            choice = "";

            div.setAttribute("matched", "");
            div.style.backgroundColor = "rgb(136, 115, 9)";
            span.style.color = "rgb(48, 43, 17)";
        } else {
            setTimeout(hidePieces, 1000, choice, div);
            div.style.border = choice.style.border = "1.5px solid red";
            choice = "";
        }
    }

    // Advance to the next level or end game if player has won
    if (Number(levelopt.value) * Number(matches.innerText) === Number(level.innerText) * (board.children.length / 2) || Number(matches.innerText) === Number(level.innerText) * (board.children.length / 2)) {
        clearInterval(clock);
        if (Number(levelopt.value) * Number(matches.innerText) === levels.length * (board.children.length / 2) || Number(matches.innerText) === levels.length * (board.children.length / 2)) {
            showMsg("Game over, you won!");
        } else {
            level.innerText = Number(level.innerText) + 1;
            newGame();
        }
    }
}

function hidePieces(first, second) {
    // Player guessed wrong. Reset the clicked pieces if player hasn't since reslected them as a new choice or matched them with something else
    if (first != choice && first.getAttribute("matched") === null) {
        first.firstChild.innerText = first.getAttribute("piece");
        first.firstChild.style.backgroundColor = "inherit";
        first.style.border = "none";
    }
    if (second != choice && second.getAttribute("matched") === null) {
        second.firstChild.innerText = second.getAttribute("piece");
        second.firstChild.style.backgroundColor = "inherit";
        second.style.border = "none";
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
        showMsg("Game over, ran out of time!");
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