var express = require('express');
var fs = require('fs');
var expressHandles = require('express-handlebars');
var app = express();
var boardData = require('./map.json'); //requires board file, game state

var cssContent = fs.readFileSync('./public/style.css', 'utf-8');

app.engine('handlebars', expressHandles({defaultLayout:'main'})); 
app.set('view engine', 'handlebars');
//routing ('', {params})

app.get('/', function(req, res){
    res.status(200);
	res.render('minePage', {row: boardData.board, modal: true});
});

app.get('/style.css', function(req, res){
    res.status(200);
    res.end(cssContent);
});

app.post('/',function(req, res){
	res.send('hey guys');
});

app.listen(3000);
