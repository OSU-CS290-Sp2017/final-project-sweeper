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
function printDebugMap(GS){

    for (var i = 0; i < GS.cols; i++) {
        var currRow = [];
        for (var j = 0; j < GS.rows; j++) {
            if(GS.board[i][j].mine == false){
                currRow[j] = GS.board[i][j].value;
            }else{
                currRow[j] = 9;
            }
        }
        console.log(currRow);
    }
}

function printMap(GS){

    for (var i = 0; i < GS.cols; i++) {
        var currRow = [];
        for (var j = 0; j < GS.rows; j++) {
            if(GS.board[i][j].flagged){
                currRow[j] = 'F';
            } else if(GS.board[i][j].cleared){
                currRow[j] = GS.board[i][j].value;
            } else {
                currRow[j] = '*';
            }
        }
        console.log(currRow);
    }
}

function saveMap(fileName,GS){
    var out = JSON.stringify(GS);
    fs.writeFileSync(fileName + ".json", out);

}

function readMap(fileName){

    var input = fs.readFileSync(fileName + ".json","utf-8");
    var gameState = JSON.parse(input);
    //console.log(input);
    return gameState;
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
            countNearby(i,j,gameState);
        }
    }

    return gameState;
}

function countNearby(i,j,GS){
    var counter = 0;
    if (i-1 >= 0 && j-1 >= 0 )
        if (GS.board[i-1][j-1].mine) counter++;

    if (i-1 >= 0)
        if (GS.board[i-1][j].mine) counter++;

    if (i-1 >= 0 && j+1 < GS.cols )
        if (GS.board[i-1][j+1].mine) counter++;

    if (j-1 >= 0 )
        if (GS.board[i][j-1].mine) counter++;

    if (j+1 < GS.cols )
        if (GS.board[i][j+1].mine) counter++;

    if (i+1 < GS.rows && j-1 >= 0 )
        if (GS.board[i+1][j-1].mine) counter++;

    if (i+1 < GS.rows)
        if (GS.board[i+1][j].mine) counter++;

    if (i+1 < GS.rows && j+1 < GS.cols )
        if (GS.board[i+1][j+1].mine) counter++;


    GS.board[i][j].value = counter;
}

function takeTurn(GS){
    markMap(2,4,1,GS);
    printMap(GS);
    console.log("marked 1");
    markMap(7,8,2,GS);
    printMap(GS);
    console.log("marked 2");
    markMap(9,9,1,GS);
    printMap(GS);
    console.log("marked 3");
}

function markMap(x,y,type,GS){
    if(type == 1){       //left click
        if(GS.board[x][y].mine == true){
            GS.dead = true;
            displayLocation(x,y,GS);
        }
        else if(GS.board[x][y].value == 0){
            displayLocation(x,y,GS);
            clearNearby(x,y,GS);
        } else{
            displayLocation(x,y,GS);
        }
    } else if(type == 2){   //right click
        if(GS.board[x][y].flagged == false){
            GS.board[x][y].flagged = true;
        } else{
            GS.board[x][y].flagged = false;
        }
    } else if(type == 3){    //recursive clear nearby
        if(GS.board[x][y].value == 0 && GS.board[x][y].cleared == false){
            displayLocation(x,y,GS);
            clearNearby(x,y,GS);
        } else{
            displayLocation(x,y,GS);
        }
    }


}
function clearNearby(i,j,GS){

    if (i-1 >= 0 && j-1 >= 0 )
        markMap(i-1,j-1,3,GS);

    if (i-1 >= 0)
        markMap(i-1,j,3,GS);

    if (i-1 >= 0 && j+1 < GS.cols )
        markMap(i-1,j+1,3,GS);

    if (j-1 >= 0 )
        markMap(i,j-1,3,GS);

    if (j+1 < GS.cols )
        markMap(i,j+1,3,GS);

    if (i+1 < GS.rows && j-1 >= 0 )
        markMap(i+1,j-1,3,GS);

    if (i+1 < GS.rows)
        markMap(i+1,j,3,GS);

    if (i+1 < GS.rows && j+1 < GS.cols )
        markMap(i+1,j+1,3,GS);

}

//displays the value of the current location, needed so we can actually
//change the page in the future.
function displayLocation(x,y,GS){
    GS.board[x][y].cleared = true;
}

function playGame(){
    var GS;
    var fileKey = "testing";
    GS = initializeMap();
    //GS = readMap("testing");
    printDebugMap(GS);
    //while(gameState.dead == false){
        takeTurn(GS);
    //}
    saveMap(fileKey,GS);

}
