//sweeper.js client side
var searchb = document.getElementById("navbar-search-button");
var searchtext = document.getElementById('navbar-search-input');
searchb.addEventListener('click',search);


function search(){
  console.log("in search func");
  var searchq = document.getElementById('navbar-search-input').value;
  console.log("search value = ", searchq);
}


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
cellContainer.addEventListener('click', function(){delegatedCellListener(event)});

//var fileKey;       //automatically adds .json at end of file
var minePercent = 0.03;         //chance that each spot is a mine, out of 1
var newOrRead = 1;              //0 for new, 1 for read
var rows = 5;                   //obvious
var cols = 5;

window.addEventListener('load', function(){
    //playGame(fileKey, minePercent, newOrRead, rows, cols);
    if(getFileKey()){
        GS = readMap(getFileKey());
        updateMap();
    }
});

function getFileKey(){
    var url = window.location.href;
    var fileKey = url.slice(url.indexOf("/play/"),url.length);
    fileKey = fileKey.slice(6,fileKey.length);
    return fileKey;
}

var modalCloseButton = document.querySelector('#create-game-modal .modal-close-button');
if(modalCloseButton){
    modalCloseButton.addEventListener('click', closeCreateGameModal);
}

var modalCancelButton = document.querySelector('#create-game-modal .modal-cancel-button');
if(modalCloseButton){
    modalCancelButton.addEventListener('click', closeCreateGameModal);
}

var modalAcceptButton = document.querySelector('#create-game-modal .modal-accept-button');
if(modalAcceptButton){
    modalAcceptButton.addEventListener('click', newGame);
}

var modalAcceptButton = document.querySelector('.modal-accept-button');
if(modalAcceptButton){
    modalAcceptButton.addEventListener('click', newGame);
}

var saveButton = document.getElementById('save');
if(saveButton){
    saveButton.addEventListener('click', function(){saveMap(getFileKey());});
}

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
/*
function makeListeners(){
    cellContainer = document.getElementById('board');
    if(cellContainer){
        cellContainer.addEventListener('click', function(){
            delegatedCellListener(event);
        });
    }
}
*/
function getRandomBetween(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveMap(fileKey){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", "/" + fileKey, false ); // false for synchronous request
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send( JSON.stringify(GS) );
	alert('Your saved map key is:' + fileKey);
}

function readMap(fileKey){
    if(fileKey){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "/" + fileKey + "/map", false ); // false for synchronous request
        xmlHttp.send( fileKey );

        return JSON.parse(xmlHttp.responseText);
    }
}

function showMap(fileKey){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/play/" + fileKey, false ); // false for synchronous request
    xmlHttp.send( fileKey );
}

function updateMap(){
    var currentCell;
    for(var i = 0; i < GS.rows; i++){
        for(var j = 0; j < GS.cols; j++){
            currCell = document.getElementById('col_' + j + '_row_' + i);
            if(GS.board[j][i].flagged){
                currCell.classList.add('flagged');
            }
            if(GS.board[j][i].cleared == true){
                var text = currCell.querySelector('.cell-text');
                if(text)
                    text.classList.remove('hidden');
            }
        }
    }
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
            countNearby(i,j, gameState);
        }
    }

    return gameState;
}

function countNearby(i, j, gamestate){
    var counter = 0;
    if (i-1 >= 0 && j-1 >= 0 )
        if (gamestate.board[i-1][j-1].mine) counter++;

    if (i-1 >= 0)
        if (gamestate.board[i-1][j].mine) counter++;

    if (i-1 >= 0 && j+1 < gamestate.rows )
        if (gamestate.board[i-1][j+1].mine) counter++;

    if (j-1 >= 0 )
        if (gamestate.board[i][j-1].mine) counter++;

    if (j+1 < gamestate.rows )
        if (gamestate.board[i][j+1].mine) counter++;

    if (i+1 < gamestate.cols && j-1 >= 0 )
        if (gamestate.board[i+1][j-1].mine) counter++;

    if (i+1 < gamestate.cols)
        if (gamestate.board[i+1][j].mine) counter++;

    if (i+1 < gamestate.cols && j+1 < gamestate.rows )
        if (gamestate.board[i+1][j+1].mine) counter++;


    gamestate.board[i][j].value = counter;
}
function revealMines(){
    for (var i = 0; i < GS.cols; i++) {
        for (var j = 0; j < GS.rows; j++) {
            if(GS.board[i][j].mine){
                console.log("found mine");
                displayLocation(i,j,4);
            }
        }
    }

}

function deleteFile(fileKey){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", "/delete/" + fileKey, false ); // false for synchronous request
    xmlHttp.send();
}

function openGameOverBox(win){
    if(win)
        alert("Congratulations, You have won!");
    else
        alert("Oh jeez, looks like that's a mine, oh no");
    window.location = '/';
    deleteFile(getFileKey());
}

function checkWin(){

    var minesCounter = GS.totalMines;
    for (var i = 0; i < GS.cols; i++) {
        for (var j = 0; j < GS.rows; j++) {
            if(GS.board[i][j].flagged == true){
                minesCounter--;
            } else if(GS.board[i][j].cleared == false){
                minesCounter--;
            }
        }
    }
    if(minesCounter == 0){
        GS.win = true;
        revealMines();
        console.log("set win to true");
        openGameOverBox(true);
    }

}

function markMap(x,y,type){
    //console.log(GS.board[x][y].mine);
    if(GS.dead || GS.win){
        return;
    }
    if(type == 1 && GS.board[x][y].flagged == false){       //left click
        if(GS.board[x][y].mine == true){
            GS.dead = true;
            console.log("You clicked on a mine");
            revealMines();
            displayLocation(x,y,1);
            openGameOverBox(false);
        }else{
            open_cell(x, y);
        }
    } else if(type == 2 && GS.board[x][y].cleared == false){   //right click
        if(GS.board[x][y].flagged == false){
            GS.board[x][y].flagged = true;
            GS.remainingMines = GS.remainingMines-1;
            displayLocation(x,y,2);
        } else{
            GS.board[x][y].flagged = false;
            GS.remainingMines = GS.remainingMines+1;

            displayLocation(x,y,2);
        }
    }
}

//displays the value of the current location, needed so we can actually
//change the page in the future.
function displayLocation(x,y,type){
    var currCell = document.getElementById('col_' + x + '_row_' + y);
    var text = currCell.querySelector('.cell-text');

    if(type == 1){
        currCell.classList.add('cleared');
        if(text)
        text.classList.remove('hidden');
        GS.board[x][y].cleared = true;
    } else if(type == 2){
        currCell.classList.toggle('flagged');
    } else if(type == 4){
        currCell.classList.add('revealedMine');
    }
}

function open_cell(x,y){
    displayLocation(x,y,1);
    if(GS.board[x][y].value != 0){
        return;
    }else{
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                if(!((y + j < 0) || (y + j >= GS.rows) || (x + i < 0) || (x + i >= GS.cols)) && GS.board[x + i][y + j].cleared == false){
                    open_cell(x + i, y + j);
                }
            }
        }
    }
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

            if(event.altKey){
                markMap(parseInt(coordinate.row),parseInt(coordinate.col),2);

            } else {
                markMap(parseInt(coordinate.row),parseInt(coordinate.col),1);
            }
            break;
        }
        currElem = currElem.parentNode;
    }
    checkWin();
}

function parseIdForCoordinate(str){
    var col = str.slice(str.indexOf("_row"),str.length);
    var row = str.slice(0,str.indexOf("_row"));
    col = col.slice(5, col.length);
    row = row.slice(4, row.length);
    return {
        "col":parseInt(col),
        "row":parseInt(row)
    }

}

function randString(){
    var key = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqurstuwxyz';
    for(var i = 0; i < 10; i++){
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function newGame(){
    var r = document.getElementById('row-text-input').value;
    var c = document.getElementById('col-text-input').value;
    var m = document.getElementById('mine-text-input').value;
    var k = document.getElementById('key-text-input').value;
    if(!( r && c && m ) && !k){
        alert("Set values for a new map, or provide a key for a saved game");
    }else {
        if(!k){
            GS = initializeMap(m, r, c);
            k = randString();
            saveMap(k);
        }
        //cellContainer.addEventListener('click', function(){delegateCellListener(event)});
        GS = readMap(k);
        window.location = '/play/' + k;
        showMap(k);
        updateMap();
        closeCreateGameModal();
    }
}

function closeOverModal() {

    var modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.classList.add('hidden');

    var overModal = document.getElementById('over-modal');//
    overModal.classList.add('hidden');

}

function openOverModal() {

    var modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.classList.remove('hidden');

    var overModal = document.getElementById('over-modal');//
    overModal.classList.remove('hidden');

}

function closeCreateGameModal() {

    var modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.classList.add('hidden');

    var createGameModal = document.getElementById('create-game-modal');//
    createGameModal.classList.add('hidden');


    var inputElems = document.getElementsByClassName('game-input-element');
    for (var i = 0; i < inputElems.length; i++) {
        var input = inputElems[i].querySelector('input, textarea');
        input.value = '';
    }

}
