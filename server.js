var express = require('express');
var fs = require('fs');
var expressHandles = require('express-handlebars');
var bodyParser = require('body-parser');
// var sweeper = require('./public/sweeper');
var app = express();
var port = process.env.PORT || 3000;
var boardData;// = fs.readFileSync('./public/savefiles/testing.json'); //requires board file, game state

app.engine('handlebars', expressHandles({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routing ('', {params})

var indexJsContent = fs.readFileSync('./public/sweeper.js');
var mineTemplateContent = fs.readFileSync('./public/sweeperTemplate.js');
var flagContent = fs.readFileSync('./themes/default/flag.png');
var colorContent = fs.readFileSync('./themes/default/color.css', 'utf-8');

app.get('/', function(req, res){
    res.status(200);
	res.render('minePage', {modal: true});
});

app.get('/play/:filekey', function(req, res, next){
    res.status(200);
    var key = req.params.filekey;
    if(fs.existsSync('./public/savefiles/' + key + '.json')){
        boardData = JSON.parse(fs.readFileSync('./public/savefiles/' + key + '.json', 'utf-8'));
        if(boardData){
            res.render('minePage', {row: boardData.board, modal: false});
        } else {
            next();
        }
    } else {
        next();
    }
});

app.get('/play/:filekey/map', function(req, res){
    res.status(200);

    var key = req.params.filekey;
    if(fs.existsSync('./public/savefiles/' + key + '.json')){
        boardData = JSON.parse(fs.readFileSync('./public/savefiles/' + key + '.json', 'utf-8'));
        if(boardData){
            res.send(boardData);
        } else {
            next();
        }
    } else {
        next();
    }
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

app.get('/flag.png', function(req, res){
    res.status(200);
    res.end(flagContent);
});

app.get('/color.css', function(req, res){
    res.status(200);
    res.end(colorContent);
});

app.get('*', function(req, res){
    res.status(404);
    res.render('404Page');
});

app.post('/play/:filekey/map',function(req, res){
    var key = req.params.filekey;
    fs.writeFileSync('./public/savefiles/' + key + '.json', JSON.stringify(req.body,null,'\t'));
    res.status(200);
    res.end();
});

app.listen(port);
