var express = require('express');
var fs = require('fs');
var expressHandles = require('express-handlebars');
var app = express();
var port = process.env.PORT || 3000;
var boardData;

app.engine('handlebars', expressHandles({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
//routing ('', {params})

<<<<<<< HEAD
=======
var indexJsContent = fs.readFileSync('./public/sweeper.js');
var mineTemplateContent = fs.readFileSync('./public/sweeperTemplate.js');
>>>>>>> 265cd5689092642acb7dff77b3c5766d70cf0842

app.get('/', function(req, res){
    res.status(200);
    boardData = fs.readFileSync('./public/savefiles/testing.json'); //requires board file, game state
	res.render('minePage', {row: boardData.board, modal: true});
});

app.get('/style.css', function(req, res){
    res.status(200);
    var cssContent = fs.readFileSync('./public/style.css', 'utf-8');
    res.end(cssContent);
});

/*
app.get('/index.js', function(req, res){
    res.status(200);
    res.end(indexJsContent);
});
*/

app.get('/mineTemplate.js', function(req, res){
    res.status(200);
    res.end(mineTemplateContent);
});

app.get('*', function(req, res){
    res.status(404);
    res.render('404page');
});

app.post('/',function(req, res){
	res.send('hey guys');
});

app.listen(port);
