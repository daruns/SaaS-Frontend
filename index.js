var express = require('express');
var path = require('path')
var app = express();
const dotenv = require('dotenv').config().parsed

app.use(express.static(__dirname + '/dist/spa/'))

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '/dist/spa/', 'index.html'));
});
app.listen(dotenv.PORT || 5001);
