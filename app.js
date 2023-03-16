const grid = document.querySelector('.grid');

const invaderDefault = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

const playerDefault = 370;

let invaderPosition = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

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

// Generate grid using number of squares needed
function gridGen(e) {
    let nextLeftBorder = borderSeparation;
    let nextRightBorder = borderSeparation - 1;


    div = document.createElement('div');
    div.setAttribute("data-left", "true")
    grid.appendChild(div)

    for (let i = 1; i < e; i++) {
        if (i == nextLeftBorder) {
            div = document.createElement('div');
            div.setAttribute("data-left", "true")
            nextLeftBorder += borderSeparation
            grid.appendChild(div)
        } else if (i == nextRightBorder) {
            div = document.createElement('div');
            div.setAttribute("data-right", "true")
            nextRightBorder += borderSeparation
            grid.appendChild(div)
        } else {
            grid.appendChild(document.createElement('div'));
        }
    }
}

gridGen(gridSize);

// Get all squares in the grid into array
gamezone = document.querySelectorAll('.grid div');

// Spawn player and ennemies
function spawnEntities() {
    for (let i = 0; i < invaderPosition.length; i++) {
        gamezone[invaderPosition[i]].classList.add('invader');
    }
}

spawnEntities();

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
                /*var snd = new Audio("ressources/laser.mp3");
                snd.play();*/
                shoot();
            default:
                break;
        }
    });
}

function removeEnemies() {
    for (let i = 0; i < invaderPosition.length; i++) {
        gamezone[invaderPosition[i]].classList.remove('invader')
    }
}

function spawnEnemies() {
    for (let i = 0; i < invaderPosition.length; i++) {
        gamezone[invaderPosition[i]].classList.add('invader')
    }
}

function moveEnemies() {
    for (let i = 0; i < invaderPosition.length; i++) {
        invaderPosition[i] += direction
    }
}

// Enemy Movement
function enemyMove() {

    removeEnemies();

    if (reverse == true) {
        direction = -1;
    } else if (reverse == false) {
        direction = 1;
    }

    for (let i = 0; i < invaderPosition.length; i++) {
        if (invaderPosition[i] > (gridSize - borderSeparation)) {
            clearInterval(enemyActive);
            game = false;
            document.getElementById("message").innerHTML = "Game Over";
            document.getElementById("replay-popup").style.display = 'flex';
        }
        if (reverse == false && gamezone[invaderPosition[i]].getAttribute("data-right")) {
            reverse = true;
            direction = jumpLine;
            moveEnemies();
        } else if (reverse == true && gamezone[invaderPosition[i]].getAttribute("data-left")) {
            reverse = false;
            direction = jumpLine;
            moveEnemies();
        }
    }

    moveEnemies();

    spawnEnemies();

    if (gamezone[playerPosition].classList.contains('invader')) {
        clearInterval(enemyActive);
        game = false;
        document.getElementById("message").innerHTML = "Game Over";
        document.getElementById("replay-popup").style.display = 'flex';
    } else if (invaderPosition.length == 0) {
        clearInterval(enemyActive);
        game = false;
        document.getElementById("message").innerHTML = "You Win";
        document.getElementById("replay-popup").style.display = 'flex';
    }
}

function resetGrid() {
    gamezone[playerPosition].classList.remove('spaceship');
    removeEnemies();
    for (let i = 0; i < invaderDefault.length; i++) {
        invaderPosition[i] = invaderDefault[i]
    }
    playerPosition = playerDefault;
    spawnEnemies();
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

    enemyActive = setInterval(enemyMove, invaderSpeed);
}

if (invaderPosition.length == 0) {
    document.getElementById("message").innerHTML = "You win"
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

    laserPosition.push(playerPosition)

    function laserMove() {
        for (let i = 0; i < laserPosition.length; i++) {
            console.log(laserPosition)
            if (gamezone[laserPosition[i]] != undefined) {
                gamezone[laserPosition[i]].classList.remove('laser')
            }

            if ((laserPosition[i] + 20) > 20) {
                console.log(laserPosition[i] + 20)
                laserPosition[i] -= 20;
            } else {
                console.log("oof")
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
                console.log("invaders ", invaderPosition.length)
            }
        }
    }
    if (interval == false) {
        laser = setInterval(laserMove, bulletSpeed)
    }
    interval = true;
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
    document.getElementById("button-play").style.display = 'none';
    document.getElementById("submit-username").style.display = 'block';
    document.getElementById("username").style.display = 'block';
    document.getElementById("text-username").style.display = 'block';

}