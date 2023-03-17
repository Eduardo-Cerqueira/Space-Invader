var musicMenu = new Audio("ressources/menu.mp3");
var musicGame = new Audio("ressources/music_game.mp3")
var musicTest = new Audio("ressources/test_audio.mp3")

const grid = document.querySelector('.grid');

const invaderDefault = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

let invaderPosition = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

const playerDefault = 370;

let playerPosition = playerDefault;

let invaderSpeed;

let gridSize = 400;

let borderSeparation = 20;

let jumpLine = 20;

let cooldownShoot = 400;

let game = true;

let direction = 1

let reverse = false;

let lastClick = 0;

let score = 0;

let username;

let volume = 0.5;

// Generate grid using number of squares needed
function gridGen(e) {
    let nextLeftBorder = borderSeparation;
    let nextRightBorder = borderSeparation - 1;


    div = document.createElement('div');
    div.setAttribute("id", "0")
    div.setAttribute("data-left", "true")
    grid.appendChild(div)

    for (let i = 1; i < e; i++) {
        if (i == nextLeftBorder) {
            div = document.createElement('div');
            div.setAttribute("id", `${i}`)
            div.setAttribute("data-left", "true");
            nextLeftBorder += borderSeparation
            grid.appendChild(div)
        } else if (i == nextRightBorder) {
            div = document.createElement('div');
            div.setAttribute("id", `${i}`)
            div.setAttribute("data-right", "true")
            nextRightBorder += borderSeparation
            grid.appendChild(div)
        } else {
            div = document.createElement('div');
            div.setAttribute("id", `${i}`)
            grid.appendChild(div)
        }
    }
}

gridGen(gridSize);

// Get all squares in the grid into array
gamezone = document.querySelectorAll('.grid div');

gamezone[playerPosition].classList.add('spaceship');

// Player Movement
if (game == true) {
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                if (playerPosition - jumpLine >= (gridSize - 60)) {
                    gamezone[playerPosition].classList.remove('spaceship');
                    playerPosition -= jumpLine;
                    gamezone[playerPosition].classList.add('spaceship');
                }
                break;
            case "ArrowDown":
                if (playerPosition + jumpLine < gridSize) {
                    gamezone[playerPosition].classList.remove('spaceship');
                    playerPosition += jumpLine;
                    gamezone[playerPosition].classList.add('spaceship');
                }
                break;
            case "ArrowLeft":
                if (!gamezone[playerPosition].getAttribute("data-left")) {
                    gamezone[playerPosition].classList.remove('spaceship');
                    playerPosition -= 1;
                    gamezone[playerPosition].classList.add('spaceship');
                }
                break;
            case "ArrowRight":
                if (!gamezone[playerPosition].getAttribute("data-right")) {
                    gamezone[playerPosition].classList.remove('spaceship');
                    playerPosition += 1;
                    gamezone[playerPosition].classList.add('spaceship');
                }
                break;
            case " ":
                shoot();
            default:
                break;
        }
    });
}
/*
let cooldownBonus = 10000;

function spawnBonus() {
    if (lastClick >= (Date.now() - cooldownBonus))
        return;
    lastClick = Date.now();

    bonus = Math.floor(Math.random() * ((gridSize - 60) - gridSize + 1)) + gridSize;

    if (bonus == playerPosition) {
        bonus = Math.floor(Math.random() * ((gridSize - 60) - gridSize + 1)) + gridSize;
    }
    gamezone[bonus].classList.add('bonus')
}

if (gamezone[playerPosition].classList.contains('bonus')) {
    cooldownShoot = cooldownShoot / 2
}*/

function spawnEnemies(array) {
    for (let i = 0; i < array.length; i++) {
        gamezone[array[i]].classList.add('invader')
    }
}

function removeEnemies(array) {
    for (let i = 0; i < array.length; i++) {
        gamezone[array[i]].classList.remove('invader')
    }
}

function moveEnemies(array) {
    for (let i = 0; i < array.length; i++) {
        array[i] += direction
    }
}

// Enemy Movement
function enemyMove() {

    removeEnemies(invaderPosition);

    if (reverse == true) {
        direction = -1;
    } else if (reverse == false) {
        direction = 1;
    }

    for (let i = 0; i < invaderPosition.length; i++) {
        if (invaderPosition[i] > (gridSize - borderSeparation)) {
            localStorage.setItem(Date.now(), `${username} - ${score}`);
            clearInterval(enemyActive);
            game = false;
            document.getElementById("message").innerHTML = "Game Over";
            document.getElementById("replay-popup").style.display = 'flex';
        }
        if (reverse == false && gamezone[invaderPosition[i]].getAttribute("data-right")) {
            reverse = true;
            direction = jumpLine;
            moveEnemies(invaderPosition);
        } else if (reverse == true && gamezone[invaderPosition[i]].getAttribute("data-left")) {
            reverse = false;
            direction = jumpLine;
            moveEnemies(invaderPosition);
        }
    }

    moveEnemies(invaderPosition);

    //spawnBonus();
    spawnEnemies(invaderPosition);

    if (gamezone[playerPosition].classList.contains('invader')) {
        localStorage.setItem(Date.now(), `${username} - ${score}`);
        clearInterval(enemyActive);
        game = false;
        document.getElementById("message").innerHTML = "Game Over";
        document.getElementById("replay-popup").style.display = 'flex';
    } else if (invaderPosition.length == 0) {
        localStorage.setItem(Date.now(), `${username} - ${score}`);
        clearInterval(enemyActive);
        game = false;
        document.getElementById("message").innerHTML = "You Win";
        document.getElementById("replay-popup").style.display = 'flex';
    }
}

function resetGrid() {

    gamezone[playerPosition].classList.remove('spaceship');
    removeEnemies(invaderPosition);
    for (let i = 0; i < invaderDefault.length; i++) {
        invaderPosition[i] = invaderDefault[i]
    }
    playerPosition = playerDefault;
    spawnEnemies(invaderPosition);
    gamezone[playerPosition].classList.add('spaceship');
    direction = 1;
    reverse = false;
    document.getElementById("score").innerHTML = score;
}

function play(difficulty) {
    document.getElementById("home").style.display = "none"
    document.getElementById("game").style.display = "block"
    document.getElementById("message").innerHTML = "";
    document.getElementById("replay-popup").style.display = 'none';
    resetGrid();
    game = true;

    if (difficulty == 1) {
        invaderSpeed = 600
    } else if (difficulty == 2) {
        invaderSpeed = 400
    } else if (difficulty == 3) {
        invaderSpeed = 200
    }

    musicMenu.pause();

    musicGame.play();
    musicGame.volume = volume / 2

    enemyActive = setInterval(enemyMove, invaderSpeed);
}


let laserPosition = []
let interval = false;
let bulletSpeed = 75;
let explosion = [];

function clearExplosion() {
    if (explosion.length != 0) {
        for (let i = 0; i < laserPosition.length; i++) {
            gamezone[explosion].classList.remove('explosion');
            explosion.splice(i, 1);
        }
    }
}

explosionClear = setInterval(clearExplosion, 200)

function shoot() {
    if (lastClick >= (Date.now() - cooldownShoot))
        return;
    lastClick = Date.now();

    var sound = new Audio("ressources/laser.mp3");
    sound.volume = volume;
    sound.play();

    laserPosition.push(playerPosition)

    function laserMove() {
        for (let i = 0; i < laserPosition.length; i++) {
            if (gamezone[laserPosition[i]] != undefined) {
                gamezone[laserPosition[i]].classList.remove('laser')
            }

            if ((laserPosition[i] + 20) > 20) {
                laserPosition[i] -= 20;
            } else {
                laserPosition.splice(i, 1);
            }

            if (gamezone[laserPosition[i]] == undefined) {
                return;
            }
            gamezone[laserPosition[i]].classList.add('laser')

            if (gamezone[laserPosition[i]].classList.contains('invader')) {
                gamezone[laserPosition[i]].classList.remove('laser')
                gamezone[laserPosition[i]].classList.remove('invader')
                gamezone[laserPosition[i]].classList.add('explosion')


                explosion = laserPosition[i];

                score += 1;

                document.getElementById("score").innerHTML = score;

                const index = invaderPosition.indexOf(laserPosition[i]);
                if (index > -1) {
                    invaderPosition.splice(index, 1);
                }
                laserPosition.splice(i, 1);
            }
        }
    }
    if (interval == false) {
        laser = setInterval(laserMove, bulletSpeed)
    }
    interval = true;
}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }

    return values;
}

scores = allStorage();

if (scores.length > 3) {
    for (let i = 0; i < 3; i++) {
        document.getElementById(`best${i}`).innerHTML = scores[i]
    }
} else {
    for (let i = 0; i < scores.length; i++) {
        document.getElementById(`best${i}`).innerHTML = scores[i]
    }
}

function chooseDifficulty() {
    username = document.getElementById("username").value;
    document.getElementById("username").style.display = 'none';
    document.getElementById("text-username").style.display = 'none';
    document.getElementById("submit-username").style.display = 'none';
    document.getElementById("easy").style.display = 'block';
    document.getElementById("medium").style.display = 'block';
    document.getElementById("hard").style.display = 'block';
}

function chooseUsername() {
    musicMenu.play();
    musicMenu.volume = volume
    musicMenu.loop = true;
    document.getElementById("button-play").style.display = 'none';
    document.getElementById("button-score").style.display = 'none';
    document.getElementById("button-settings").style.display = 'none';
    document.getElementById("submit-username").style.display = 'block';
    document.getElementById("username").style.display = 'block';
    document.getElementById("text-username").style.display = 'block';

}

function showScores() {
    document.getElementById("button-play").style.display = 'none';
    document.getElementById("button-score").style.display = 'none';
    document.getElementById("button-settings").style.display = 'none';
    document.getElementById("scores").style.display = 'flex';
}

function backHome() {
    document.getElementById("scores").style.display = 'none';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("button-play").style.display = 'block';
    document.getElementById("button-score").style.display = 'block';
    document.getElementById("button-settings").style.display = 'block';
}

function showSettings() {
    document.getElementById("button-play").style.display = 'none';
    document.getElementById("button-score").style.display = 'none';
    document.getElementById("button-settings").style.display = 'none';
    document.getElementById("settings").style.display = 'flex';
}

function testVolume() {
    musicTest.play();
    musicTest.volume = volume
}

function setupVolume() {
    volume = document.getElementById('volumeSlider').value
    document.getElementById('volume').innerHTML = `${volume}%`
    volume /= 100
}