var express = require('express');
var fs = require('fs');
var expressHandles = require('express-handlebars');
var app = express();
var port = process.env.PORT || 3000;
var boardData;// = fs.readFileSync('./public/savefiles/testing.json'); //requires board file, game state

app.engine('handlebars', expressHandles({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
//routing ('', {params})

var indexJsContent = fs.readFileSync('./public/sweeper.js');
var mineTemplateContent = fs.readFileSync('./public/sweeperTemplate.js');

app.get('/', function(req, res){
    res.status(200);
	//res.render('minePage', {row: boardData.board, modal: true});
    res.send("stuff will happen here");
});

app.get('/:filekey/map', function(req, res){
    res.status(200);
    var key = req.params.filekey;
    boardData = fs.readFileSync('./public/savefiles/testing.json', 'utf-8');
    console.log(JSON.stringify(boardData.board));
	res.render('minePage', {row: boardData.board, modal: true});
});

app.get('/style.css', function(req, res){
    res.status(200);
    var cssContent = fs.readFileSync('./public/style.css', 'utf-8');
    res.end(cssContent);
});


app.get('/index.js', function(req, res){
    res.status(200);
    res.end(indexJsContent);
});


app.get('/mineTemplate.js', function(req, res){
    res.status(200);
    res.end(mineTemplateContent);
});

app.get('*', function(req, res){
  console.log("404");
    res.status(404);
    res.render('404page');
});

app.post('/:filekey/map',function(req, res){
    var key = req.params.filekey;
    fs.writeFileSync('./public/savfiles/' + key + '.json', boardData);
});

app.listen(port);
