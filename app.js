const grid = document.querySelector('.grid');

let invaderPosition = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75
];

let playerPosition = 190;

// Generate grid, takes parameter e for number of squares to generate
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

    gamezone[playerPosition].classList.add('spaceship');
}

spawnEntities();