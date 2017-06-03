
var gameState {
  "rows": 10,
  "cols": 10,
  "totalMines": 8,
  "remainingMines": 8,
  "board": []
}

var Coords = function(x, y) {
    return {
        "x" : x,
        "y" : y
    };
};

function initializeMap(){
  for (var i = 0, l = 10; i < l; i++) {
      board[i] = [];
      for (var j = 0, l2 = 10; j < l2; j++) {
          board[i][j] = Coords(i, j);
      }
  }
}

playGame(){



}
