var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var mysql = require('mysql');
var express=require('express');
var http = require('http');
var bodyParser=require('body-parser');
var cookieParser = require("cookie-parser");
var session=require('express-session');
var schedule = require('node-schedule');
var date = new Date();
var isTable;
var fs = require('fs')
var app=express();
const cors=require('cors');
const router=express.router;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors({origin:'http://smartiot.iptime.org'}));

var port = 3000;




var day = 6;
var day2=6;
var day3=6;
var day4=6;
var file_1='weather/2019-10-30.csv';
var file_2='weather2/2019-10-30.csv';
var file_3='weather3/2019-10-30.csv'; 
var file_4='weather4/2019-10-30.csv'; 

var pool = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'logiclab',
	database : 'weather'
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



지금 이부분을 수정하고 있음 2234

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	pool.getConnection(function(err, connection) {
	connection.query('show tables like "weather3";', function(err, data) {
		if(data.length!=0){
			isTable = 'yes'	
		}else{
			isTable = 'no'		
		}
		if(isTable=='no'){
			connection.query('CREATE TABLE weather3 (time varchar(200) null, lux varchar(200) null, soilHumidity varchar(200) null, voltage varchar(200) null, soilTemperature varchar(200) null) ', function(error, data) {
				if(error) throw error;
			});
		}else if(isTable=='yes'){
			console.log('MySql have this table')
		}
		connection.release();
	});
});
function getHTML_3 () {
	var p = new Date()
	request.get({url: 'http://smartiot.iptime.org/sensor2'}, function(err, response, html){
		console.log(html);
		if(html==null || html==undefined||html==""||html==" "){
			console.log('Page Not Found! Recrawling!');
			getHTML_3();
		}else{
			var weather;
			html = html.replace(/\r/g, '');
			weather = p.getFullYear()+'-'+(p.getMonth()+1)+'-'+p.getDate()+'-'+p.getHours()+','+html;
			weather = weather.split(',');
			html = p.getHours()+':00,'+html;
			html += '\n';
			fs.appendFile(file_3, html,'utf8', function(err){
				if(err) throw err;
				console.log('file write_3');
			})
			pool.getConnection(function(err, connection) {
				connection.query('Insert into weather3 (time, lux, soilHumidity, voltage, soilTemperature) values(?,?,?,?,?)',[
						weather[0], weather[6], weather[7], weather[8], weather[9]
					], function() {
					connection.release();
				});
			});
		}
		
	})
}

	setInterval(function(){
		var p = new Date()
		if(day3!=p.getDate()){
			console.log('in_3');
			file_3 = 'weather3/'+p.getFullYear()+'-'+(p.getMonth()+1)+'-'+p.getDate()+'.csv';
			fs.open(file_3, 'w', function(err){
				if(err) throw err;
				console.log('file change_3');
			})
			getHTML_3();
			day3 = p.getDate();
		}else{		
			getHTML_3();
		}
	},3600000)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
pool.getConnection(function(err, connection) {
	connection.query('show tables like "weather4";', function(err, data) {
		if(data.length!=0){
			isTable = 'yes'	
		}else{
			isTable = 'no'		
		}
		if(isTable=='no'){
			connection.query('CREATE TABLE weather4 (time varchar(200) null, watertemperature varchar(200) null, hotline varchar(200) null)', function(error, data) {
				if(error) throw error;
			});
		}else if(isTable=='yes'){
			console.log('MySql have this table')
		}
		connection.release();
	});
});
	function getHTML_4 () {
		var d = new Date()
		request.get({url: 'http://smartiot.iptime.org/sensor'}, function(err, response, html){
			console.log(html);
			if(html==null || html==undefined||html==""||html==" "){
				console.log('Page Not Found! Recrawling!');
				getHTML_4();
			}else{
				var weather;
				html = html.replace(/\r/g, '');
				weather = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'-'+d.getHours()+','+html;
				weather = weather.split(',');
				html = d.getHours()+':00,'+html;
				html += '\n';
			
				fs.appendFile(file_4, html,'utf8', function(err){
					if(err) throw err;
					console.log('file write_4');
				})
				pool.getConnection(function(err, connection) {
					connection.query('Insert into weather4 (time, watertemperature, hotline) values(?,?,?)',[
								weather[0], weather[1], weather[2]
						], function() {
						connection.release();
					});
				});
			}
			
		})
	}
		setInterval(function(){
			var d = new Date()
			if(day!=d.getDate()){
				console.log('in_1');
				file_4 = 'weather4/'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'.csv';
				fs.open(file_4, 'w', function(err){
					if(err) throw err;
					console.log('file change_1');
				})
				getHTML_4();
				day = d.getDate();
			}else{		
				getHTML_4();
			}
		},3600000)
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

http.createServer(app).listen(port,function(){
	console.log("Create Data Server http://127.0.0.1:"+port);
});
//////////////////////////////////////////////////////////////////////////////////////



app.get('/today_weather',function(request,response){
  var d = new Date()
  var today_checker='';
  today_checker=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	console.log('today is'+today_checker);
  pool.getConnection(function(err, connection) {

    connection.query("SELECT * FROM weather WHERE time like '"+today_checker+"%';", function(err, data) {
      response.send(data);
      connection.release();
	console.log('today weather all data send OK');
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////
app.get('/today_water_weather',function(request,response){
	var d = new Date()
  var today_checker='';
  today_checker=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	console.log('today is'+today_checker);
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather2 WHERE time like '"+today_checker+"%';", function(err, data) {
      response.send(data);
      connection.release();
	console.log('today weather2 all data send OK');
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////

app.get('/today_lux',function(request,response){
	var d = new Date()
  var today_checker='';
  today_checker=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	console.log('today is'+today_checker);
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather3 WHERE time like '"+today_checker+"%';", function(err, data) {
      response.send(data);
      connection.release();
	console.log('today weather3 all data send OK');
    });
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////
app.get('/today_valve_weather',function(request,response){
	var d = new Date()
  var today_checker='';
  today_checker=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	console.log('today is'+today_checker);
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather4 WHERE time like '"+today_checker+"%';", function(err, data) {
      response.send(data);
      connection.release();
	console.log('today weather4 all data send OK');
    });
  });
});
/////////////////////////////////////////////////////////////////




app.get('/whole_weather',function(request,response){
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather;", function(err, data) {
      response.send(data);
      connection.release();
	console.log('weather all data send OK');
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////
app.get('/whole_water_weather',function(request,response){
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather2;", function(err, data) {
      response.send(data);
      connection.release();
	console.log('weather2 all data send OK');
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////

app.get('/whole_lux',function(request,response){
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather3;", function(err, data) {
      response.send(data);
      connection.release();
	console.log('weather3 all data send OK');
    });
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/whole_valve_weather',function(request,response){
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM weather4;", function(err, data) {
      response.send(data);
      connection.release();
	console.log('weather4 all data send OK');
    });
  });
});