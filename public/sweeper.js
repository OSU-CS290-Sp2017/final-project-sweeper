// var fs = require('fs');

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
var GS;
var cellContainer = document.getElementById('board');
cellContainer.addEventListener('click', function(){
    delegatedCellListener(event);
});


var fileKey = "testing";       //automatically adds .json at end of file
var minePercent = 0.03;         //chance that each spot is a mine, out of 1
var newOrRead = 1;              //0 for new, 1 for read
var rows = 5;                   //obvious
var cols = 5;

window.addEventListener('load', function(){
    playGame(fileKey, minePercent, newOrRead, rows, cols);
});
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

function printMap(){

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

function saveMap(fileName){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", "./" + fileKey + "/map", false ); // false for synchronous request
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send( JSON.stringify(GS) );
    //xmlHttp.send( GS );

    // var out = JSON.stringify(GS,null,'\t');
    // fs.writeFileSync("./public/" + fileName + ".json", out);

}

function readMap(fileName){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "./" + fileKey + "/map", false ); // false for synchronous request
    xmlHttp.send( fileKey );
    return JSON.parse(xmlHttp.responseText);

    // var input = fs.readFileSync("./public/" + fileName + ".json","utf-8");
    // var gameState = JSON.parse(input);
    // console.log(input);
    // return gameState;
}

//initializes the map with rows, cols, and sets each space to its correct value
function initializeMap(minePercent, rows, cols){

    gameState.cols = cols;
    gameState.rows = rows;

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

    return gameState;
}

function countNearby(i,j){
    var counter = 0;
    if (i-1 >= 0 && j-1 >= 0 )
        if (GS.board[i-1][j-1].mine) counter++;

    if (i-1 >= 0)
        if (GS.board[i-1][j].mine) counter++;

    if (i-1 >= 0 && j+1 < GS.rows )
        if (GS.board[i-1][j+1].mine) counter++;

    if (j-1 >= 0 )
        if (GS.board[i][j-1].mine) counter++;

    if (j+1 < GS.rows )
        if (GS.board[i][j+1].mine) counter++;

    if (i+1 < GS.cols && j-1 >= 0 )
        if (GS.board[i+1][j-1].mine) counter++;

    if (i+1 < GS.cols)
        if (GS.board[i+1][j].mine) counter++;

    if (i+1 < GS.cols && j+1 < GS.rows )
        if (GS.board[i+1][j+1].mine) counter++;


    GS.board[i][j].value = counter;
}

function takeTurn(){
    markMap(2,4,1);
    printMap();
    console.log("marked 1");
    // markMap(7,8,1,GS);
    // printMap(GS);
    // console.log("marked 2");
    // markMap(9,9,1,GS);
    // printMap(GS);
    // console.log("marked 3");

    checkWin();
}

function checkWin(){

    var minesCounter = GS.totalMines;
    for (var i = 0; i < GS.cols; i++) {
        for (var j = 0; j < GS.rows; j++) {
            if(GS.board[i][j].cleared == false){
                minesCounter--;
            } else if(GS.board[i][j].flagged == true){
                minesCounter--;
            }
        }
    }
    console.log(minesCounter);
    if(minesCounter == 0){
        GS.win = true;
        console.log("set win to true");
    }

}

function markMap(x,y,type){
    if(type == 1){       //left click
        if(GS.board[y][x].mine == true){
            GS.dead = true;
            displayLocation(x,y);
        }
        else if(GS.board[y][x].value == 0){
            displayLocation(x,y);
            clearNearby(x,y);
        } else{
            displayLocation(x,y);
        }
    } else if(type == 2){   //right click
        if(GS.board[y][x].flagged == false){
            GS.board[y][x].flagged = true;
        } else{
            GS.board[y][x].flagged = false;
        }
    } else if(type == 3){    //recursive clear nearby
        if(GS.board[y][x].value == 0 && GS.board[y][x].cleared == false){
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

    if (i-1 >= 0 && j+1 < GS.cols )
        markMap(i-1,j+1,3);

    if (j-1 >= 0 )
        markMap(i,j-1,3);

    if (j+1 < GS.cols )
        markMap(i,j+1,3);

    if (i+1 < GS.rows && j-1 >= 0 )
        markMap(i+1,j-1,3);

    if (i+1 < GS.rows)
        markMap(i+1,j,3);

    if (i+1 < GS.rows && j+1 < GS.cols )
        markMap(i+1,j+1,3);

}

function delegatedCellListener(event){
    var currElem = event.target;
    var temp;
    var coordinate;

    while (currElem.getAttribute('id') !== 'board') {
        if (currElem.classList.contains('cell')) {
            temp = currElem.id;
            //console.log(temp);
            coordinate = parseIdForCoordinate(temp);
            markMap(coordinate.row,coordinate.col,1)
            break;
        }
        currElem = currElem.parentNode;
    }
}

function parseIdForCoordinate(str){
    var col = str.slice(str.indexOf("_row"),str.length);
    var row = str.slice(0,str.indexOf("_row"));
    col = col.slice(5, col.length);
    row = row.slice(4, row.length);
    // console.log(col);
    // console.log(row);

    return {
        "col":col,
        "row":row
    }

}
//displays the value of the current location, needed so we can actually
//change the page in the future.
function displayLocation(x,y){
    GS.board[y][x].cleared = true;
    var currCell = document.getElementById('col_' + x + '_row_' + y);

    currCell.classList.add('cleared');
}

function playGame(fileKey, minePercent, newOrRead, rows, cols){
    console.log("starting playGame");
    if(newOrRead == 0){
        GS = initializeMap(minePercent,rows, cols);
    } else {
        GS = readMap(fileKey);
    }
    //printDebugMap(GS);
    //while(gameState.dead == false && gameState.win == false){
        takeTurn();
    //}
    saveMap(fileKey);

}
