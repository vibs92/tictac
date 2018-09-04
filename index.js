/**
 * This program is a boliler plate code for the famous tic tac toe game
 * Here box represents one placeholder for either X or a 0
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 * 
 * Below are the tasks which needs to be completed
 * Imagine you are playing with Computer so every alternate move should be by Computer
 * X -> player
 * O -> Computer
 * 
 * Winner has to be decided and has to be flashed
 * 
 * Extra points will be given for the Creativity
 * 
 * Use of Google is not encouraged
 * 
 */
const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';
let winner = null;
let gameOn = true;

function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function gameOver() {

    for (let idx = 0; idx < GRID_LENGTH; idx++) {
        // check row win
        if (grid[idx][0] != 0 && grid[idx][0] == grid[idx][1] && grid[idx][0] == grid[idx][2]) {
            winner = grid[idx][0];

            return true;
        }
        // check col win
        if (grid[0][idx] != 0 && grid[0][idx] == grid[1][idx] && grid[0][idx] == grid[2][idx]) {
            winner = grid[0][idx];

            return true;
        }
    }
    // check forward diagonal win
    if (grid[0][0] != 0 && grid[0][0] == grid[1][1] && grid[0][0] == grid[2][2]) {
        winner = grid[0][0];

        return true;
    }
    // check backward diagonal win
    if (grid[2][0] != 0 && grid[2][0] == grid[1][1] && grid[2][0] == grid[0][2]) {
        winner = grid[2][0];

        return true;
    }

    for (let x = 0; x < GRID_LENGTH; x++) {
        for (let y = 0; y < GRID_LENGTH; y++) {
            if (grid[x][y] == 0) {
                return false;
            }
        }
    }

    return true;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';

    if (gameOver()) {
        if (winner == 1) {
            document.getElementById("winner").innerHTML = "Player Won!";
        } else if (winner == 2) {
            document.getElementById("winner").innerHTML = "Computer Won!";
        } else {
            document.getElementById("winner").innerHTML = "It's a Tie!";
        }
        
        gameOn = false;
    }
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = 1;
    grid[colIdx][rowIdx] = newValue;
    renderMainGrid();
    if (gameOn) {
        computerMakesAMove();
        renderMainGrid();
        if (gameOn) {
            addClickHandlers();
        }
    }
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function isCheckMateCondition(line, player) {
    if (line[1] == player && line[2] == player) {
        return 0;
    } else if (line[0] == player && line[2] == player) {
        return 1;
    } else if (line[0] == player && line[1] == player) {
        return 2;
    }

    return -1;
}

function isMovePossible(line) {
    for (let i =0; i < GRID_LENGTH; i++) {
        if (line[i] == 0) {
            return true;
        }
    }

    return false;
}

function makeDesperateMove(line, player) {
    if (isMovePossible(line)) {
        return isCheckMateCondition(line, player);
    }

    return -1;
}

function aboutToWin(player) {
    let desperateMove;
    for (let idx = 0; idx < GRID_LENGTH; idx++) {
        // check row win
        let row = [ grid[idx][0], grid[idx][1], grid[idx][2] ];
        desperateMove = makeDesperateMove(row, player);
        if (desperateMove != -1) {
            grid[idx][desperateMove] = 2;

            return true;
        }
        // check col win
        let col = [ grid[0][idx], grid[1][idx], grid[2][idx] ];
        desperateMove = makeDesperateMove(col, player);
        if (desperateMove != -1) {
            grid[desperateMove][idx] = 2;

            return true;
        }
    }
    // check forward diagonal win
    forward = [ grid[0][0], grid[1][1], grid[2][2] ];
    desperateMove = makeDesperateMove(forward, player);
    if (desperateMove != -1) {
        grid[desperateMove][desperateMove] = 2;

        return true;
    }
    // check backward diagonal win
    backward = [ grid[2][0], grid[1][1], grid[0][2] ];
    desperateMove = makeDesperateMove(backward, player);
    if (desperateMove != -1) {
        let x = 2 - desperateMove;
        let y = 0 + desperateMove;
        grid[x][y] = 2;

        return true;
    }
}

function computerMakesAMove() {
    // computer about to win
    if (aboutToWin(2)) {
        return true;
    }
    // player about to win
    if (aboutToWin(1)) {
        return true;
    }

    //make first possible move
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            if (grid[colIdx][rowidx] == 0) {
                grid[colIdx][rowidx] = 2;

                return true;
            }
        }
    }

    return false;
}

initializeGrid();
renderMainGrid();
addClickHandlers();
