const grid = document.querySelector('.grid');

const invaderDefault = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

const playerDefault = 170;

const leftBorder = [
    0, 20, 40, 60, 80, 100, 120, 140, 160, 180
];

const rightBorder = [
    19, 39, 59, 79, 99, 119, 139, 159, 179, 199
];



let invaderPosition = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

let playerPosition = 170;

// Generate grid using number of squares needed
function gridGen(e) {
    for (let i = 0; i < e; i++) {
        grid.appendChild(document.createElement('div'));
    }
}


gridGen(200);

// Get all squares in the grid into array
gamezone = Array.from(document.querySelectorAll('.grid div'));

// Spawn player and ennemies
function spawnEntities() {
    for (let i = 0; i < invaderPosition.length; i++) {
        gamezone[invaderPosition[i]].classList.add('invader');
    }
}

spawnEntities();

gamezone[playerPosition].classList.add('spaceship');

// Border Detection
function isBorder(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        return true
    } else {
        return false
    }
}


// Player Movement
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (playerPosition - 20 >= 140) {
                gamezone[playerPosition].classList.remove('spaceship');
                playerPosition -= 20;
                gamezone[playerPosition].classList.add('spaceship');
            }
            break;
        case "ArrowDown":
            if (playerPosition + 20 < 200) {
                gamezone[playerPosition].classList.remove('spaceship');
                playerPosition += 20;
                gamezone[playerPosition].classList.add('spaceship');
            }
            break;
        case "ArrowLeft":
            if (isBorder(leftBorder, playerPosition) == false) {
                gamezone[playerPosition].classList.remove('spaceship');
                playerPosition -= 1;
                gamezone[playerPosition].classList.add('spaceship');
            }
            break;
        case "ArrowRight":
            if (isBorder(rightBorder, playerPosition) == false) {
                gamezone[playerPosition].classList.remove('spaceship');
                playerPosition += 1;
                gamezone[playerPosition].classList.add('spaceship');
            }
            break;
        case " ":
            /*var snd = new Audio("ressources/laser.mp3");
            snd.play();*/
        default:
            break;
    }
});

let reverse = false;

// Enemy Movement
function enemyMove() {
    for (let i = 0; i < invaderPosition.length; i++) {
        if (isBorder(rightBorder, invaderPosition[i]) == true) {
            reverse = true;
            for (let i = 0; i < invaderPosition.length; i++) {
                gamezone[invaderPosition[i]].classList.remove('invader');
                invaderPosition[i] += 20
            }
            for (let i = 0; i < invaderPosition.length; i++) {
                gamezone[invaderPosition[i]].classList.add('invader');
            }
        } else if (isBorder(leftBorder, invaderPosition[i]) == true) {
            reverse = false;
            for (let i = 0; i < invaderPosition.length; i++) {
                gamezone[invaderPosition[i]].classList.remove('invader');
                invaderPosition[i] += 20
            }
            for (let i = 0; i < invaderPosition.length; i++) {
                gamezone[invaderPosition[i]].classList.add('invader');
            }
        }
    }

    if (reverse == false) {
        for (let i = 0; i < invaderPosition.length; i++) {
            gamezone[invaderPosition[i]].classList.remove('invader');
            invaderPosition[i] += 1
        }
        for (let i = 0; i < invaderPosition.length; i++) {
            gamezone[invaderPosition[i]].classList.add('invader');
        }

    } else if (reverse == true) {
        for (let i = 0; i < invaderPosition.length; i++) {
            gamezone[invaderPosition[i]].classList.remove('invader');
            invaderPosition[i] -= 1
        }
        for (let i = 0; i < invaderPosition.length; i++) {
            gamezone[invaderPosition[i]].classList.add('invader');

        }
    }
}

setInterval(enemyMove, 700);


function moveLaser() {}