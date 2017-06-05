var fs = require('fs');

var gameState = {
    "dead": false,
    "rows": 10,
    "cols": 10,
    "totalMines": 0,
    "remainingMines": 0,
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

function printMap(){

    for (var i = 0; i < gameState.cols; i++) {
        var currRow = [];
        for (var j = 0; j < gameState.rows; j++) {
            if(gameState.board[i][j].flagged){
                currRow[j] = 'F';
            } else if(gameState.board[i][j].cleared){
                currRow[j] = gameState.board[i][j].value;
            } else {
                currRow[j] = '*';
            }
        }
        console.log(currRow);
    }
}

function saveMap(){
    var out = JSON.stringify(gameState);
    fs.writeFileSync("testing.json", out);

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

function takeTurn(){
    markMap(2,4,1);
    printMap();
    console.log("marked 1");
    markMap(7,8,2);
    printMap();
    console.log("marked 2");
    markMap(9,9,1);
    printMap();
    console.log("marked 3");
}

function markMap(x,y,type){
    if(type == 1){       //left click
        if(gameState.board[x][y].mine == true){
            gameState.dead = true;
            displayLocation(x,y);
        }
        else if(gameState.board[x][y].value == 0){
            displayLocation(x,y);
            clearNearby(x,y);
        } else{
            displayLocation(x,y);
        }
    } else if(type == 2){   //right click
        if(gameState.board[x][y].flagged == false){
            gameState.board[x][y].flagged = true;
        } else{
            gameState.board[x][y].flagged = false;
        }
    } else if(type == 3){    //recursive clear nearby
        if(gameState.board[x][y].value == 0 && gameState.board[x][y].cleared == false){
            displayLocation(x,y);
            clearNearby(x,y);
        } else{
            displayLocation(x,y);
        }
    }


}
function clearNearby(i,j){

    if (i-1 >= 0 && j-1 >= 0 )
        markMap(i-1,j-1,3);

    if (i-1 >= 0)
        markMap(i-1,j,3);

    if (i-1 >= 0 && j+1 < gameState.cols )
        markMap(i-1,j+1,3);

    if (j-1 >= 0 )
        markMap(i,j-1,3);

    if (j+1 < gameState.cols )
        markMap(i,j+1,3);

    if (i+1 < gameState.rows && j-1 >= 0 )
        markMap(i+1,j-1,3);

    if (i+1 < gameState.rows)
        markMap(i+1,j,3);

    if (i+1 < gameState.rows && j+1 < gameState.cols )
        markMap(i+1,j+1,3);

}

//displays the value of the current location, needed so we can actually
//change the page in the future.
function displayLocation(x,y){
    gameState.board[x][y].cleared = true;
}

function playGame(){
    initializeMap();
    printDebugMap();
    //while(gameState.dead == false){
        takeTurn();
    //}
    saveMap();

}
