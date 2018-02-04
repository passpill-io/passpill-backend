var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

let app = express();
app.server = http.createServer(app);
app.use( bodyParser.json() );

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});


var controller = require('./backend/controller');
app.post('/api/getVault', (req, res) => {
	controller.getVault( req, {}, (err, value) => {
		res.status(value.statusCode).send( value.body );
	});
});

app.post('/api/createVault', (req, res) => {
	controller.createVault(req, {}, (err, value) => {
		res.status(value.statusCode).send( value.body );
	});
});

app.post('/api/updateVault', (req, res) => {
	controller.updateVault(req, {}, (err, value) => {
		res.status(value.statusCode).send( value.body );
	});
});

app.server.listen(process.env.PORT || 3333, () => {
	console.log(`Started on port ${app.server.address().port}`);
});