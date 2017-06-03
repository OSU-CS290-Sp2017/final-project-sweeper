var express = require('express')
var expressHandles = require('express-handlebars')
var app = express()
var boardData = require('./boardData.json') //requires board file, game state


app.engine('handlebars', expressHandles({defaultLayout:'main'})); 
//routing ('', {params})

app.get('/', function(req, res){

	res.render('boardData', {row: boardData.})
})

app.post('/',function(req, res){
	res.send('hey guys')
})

app.listen(3000)
