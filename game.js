const grid = document.querySelector('.grille')

// Generate grid, takes parameter e for number of squares to generate
function gridGen(e) {
    for (let i = 0; i < e; i++) {
        grid.appendChild(document.createElement('div'));
    }
}

gridGen(200);