
var gameState = {
  "rows": 10,
  "cols": 10,
  "totalMines": 8,
  "remainingMines": 8,
  "board": []
}
playGame();

//creates each cell, requires an x coordinate, y coordinate, and whether or not
//the space is a mine
function Cell(x, y, isMine) {
    return {
        "x" : x,
        "y" : y,
        "flagged": false,
        "cleared": false,
        "mine": isMine,
        "value": 0
    };
}

function getRandomBetween(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//prints out the map
function printDebugMap(){

    for (var i = 0; i < gameState.cols; i++) {
        var currRow = [];
        for (var j = 0; j < gameState.rows; j++) {
            if(gameState.board[i][j].mine == false){
                currRow[j] = gameState.board[i][j].value;
            }else{
                currRow[j] = 9;
            }
        }
        console.log(currRow);
    }

}

//initializes the map with rows, cols, and sets each space to its correct value
function initializeMap(){
    gameState.cols = 10;
    gameState.rows = 10;

    //sets whether or not each cell has a mine
    for (var i = 0; i < gameState.cols; i++) {
        gameState.board[i] = [];
        for (var j = 0; j < gameState.rows; j++) {
            var isMine = 0.1;                   //each mine has this*100
            if(isMine < Math.random()){         //percent chance of being a mine
                gameState.board[i][j] = Cell(i, j, false);
                gameState.totalMines++;
            }
            else{
                gameState.board[i][j] = Cell(i, j, true);
            }
        }
    }
    gameState.remainingMines = gameState.totalMines;

    //counts the number of nearby mines
    for (var i = 0; i < gameState.cols; i++) {
        for (var j = 0; j < gameState.rows; j++) {
            countNearby(i,j);
        }
    }

}

function countNearby(i,j){
    var counter = 0;
    if (i-1 >= 0 && j-1 >= 0 )
        if (gameState.board[i-1][j-1].mine) counter++;

    if (i-1 >= 0)
        if (gameState.board[i-1][j].mine) counter++;

    if (i-1 >= 0 && j+1 < gameState.cols )
        if (gameState.board[i-1][j+1].mine) counter++;

    if (j-1 >= 0 )
        if (gameState.board[i][j-1].mine) counter++;

    if (j+1 < gameState.cols )
        if (gameState.board[i][j+1].mine) counter++;

    if (i+1 < gameState.rows && j-1 >= 0 )
        if (gameState.board[i+1][j-1].mine) counter++;

    if (i+1 < gameState.rows)
        if (gameState.board[i+1][j].mine) counter++;

    if (i+1 < gameState.rows && j+1 < gameState.cols )
        if (gameState.board[i+1][j+1].mine) counter++;


    gameState.board[i][j].value = counter;
}

function playGame(){
    initializeMap();
    printDebugMap();

}
