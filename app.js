var express = require('express')
var moment = require('moment')
var engines = require('consolidate')
var bodyParser = require('body-parser')

var app = express()

app.engine('html', engines.nunjucks)
app.set('view engine', 'html');
app.set('port', (process.env.port | 3000))
app.set('views', __dirname + '/');
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req,res,next) {
	res.render('index', {url: req.protocol + '://' + req.get('host') });
})

app.use(function(req,res){
	var urlParam = decodeURIComponent(req.path).replace(/\//, "");
	var date;
	var dateFormat = "MMMM D, YYYY";
	var timeStamp = { unix: "", natural: ""};

	if (urlParam.match(/\D/)) { 
		date = moment(urlParam, dateFormat);
		if (date.format(dateFormat) !== urlParam) {
			date = moment.invalid();
		}
	} else {
		console.log("Url param is number");
		date = moment(urlParam, "X"); //Unix timestamp
	}

	if (date.isValid()) {
		timeStamp.unix = date.unix();
		timeStamp.natural = date.format(dateFormat);
	}

	res.json(timeStamp);
})

app.listen(app.get('port'), function(){
	console.log('Express is running at port %d', app.get('port'));
})