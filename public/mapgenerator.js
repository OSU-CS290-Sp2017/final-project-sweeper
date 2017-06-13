var fs = require('fs');

var gameState = {
    "theme": "default",
    "dead": false,
    "win": false,
    "rows": 10,
    "cols": 10,
    "totalMines": 0,
    "remainingMines": 0,
    "board": []
}


var fileKey = process.env.NAME || "newMap";       //automatically adds .json at end of file
var minePercent = process.env.MINEPERCENT || 0.1;         //chance that each spot is a mine, out of 1
var rows = process.env.ROWS || 10;                   //obvious
var cols = process.env.COLS || 10;

//window.addEventListener('load', function(){
    playGame(fileKey, minePercent, rows, cols);
// });
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


function saveMap(fileName){
    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open( "POST", "./" + fileKey + "/map", false ); // false for synchronous request
    // xmlHttp.setRequestHeader('Content-Type', 'application/json');
    // xmlHttp.send( JSON.stringify(gameState) );
    //xmlHttp.send( GS );

    var out = JSON.stringify(gameState,null,'\t');
    fs.writeFileSync("./public/savefiles/" + fileName + ".json", out);

}


//initializes the map with rows, cols, and sets each space to its correct value
function initializeMap(minePercent, rows, cols){

    gameState.cols = rows;
    gameState.rows = cols;

    //sets whether or not each cell has a mine
    for (var i = 0; i < gameState.cols; i++) {
        gameState.board[i] = [];
        for (var j = 0; j < gameState.rows; j++) {
            var isMine = minePercent;                   //each mine has this*100
            if(isMine < Math.random()){         //percent chance of being a mine
                gameState.board[i][j] = Cell(i, j, false);
            }
            else{
                gameState.board[i][j] = Cell(i, j, true);
                gameState.totalMines++;
            }
        }
    }
    gameState.remainingMines = gameState.totalMines;

    //counts the number of nearby mines
    for (var i = 0; i < gameState.cols; i++) {
        for (var j = 0; j < gameState.rows; j++) {
            countNearby(i,j,gameState);
        }
    }

}

function countNearby(i,j){
    var counter = 0;
    if (i-1 >= 0 && j-1 >= 0 )
        if (gameState.board[i-1][j-1].mine) counter++;

    if (i-1 >= 0)
        if (gameState.board[i-1][j].mine) counter++;

    if (i-1 >= 0 && j+1 < gameState.rows )
        if (gameState.board[i-1][j+1].mine) counter++;

    if (j-1 >= 0 )
        if (gameState.board[i][j-1].mine) counter++;

    if (j+1 < gameState.rows )
        if (gameState.board[i][j+1].mine) counter++;

    if (i+1 < gameState.cols && j-1 >= 0 )
        if (gameState.board[i+1][j-1].mine) counter++;

    if (i+1 < gameState.cols)
        if (gameState.board[i+1][j].mine) counter++;

    if (i+1 < gameState.cols && j+1 < gameState.rows )
        if (gameState.board[i+1][j+1].mine) counter++;

    if(gameState.board[i][j].mine){
        gameState.board[i][j].value = 0;
    } else{
        gameState.board[i][j].value = counter;
    }
}


function playGame(fileKey, minePercent, rows, cols){
    console.log("starting playGame");
    initializeMap(minePercent,rows, cols);

    saveMap(fileKey);

}
