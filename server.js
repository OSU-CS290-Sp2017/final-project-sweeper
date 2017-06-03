var express = require('express)
var app = express()

//routing

app.get('/', function(req, res){
	res.send('put stuff here')
})

app.post('/',function(req, res){
	res.send('hey guys')
})


