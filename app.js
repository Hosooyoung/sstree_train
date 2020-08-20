var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SerialPort = require("serialport");
var StringDecoder = require('string_decoder').StringDecoder;
var crawl = require('request')
var cheerio = require('cheerio')
var routes = require('./routes/index');
var users = require('./routes/users');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;
//exec('sudo rfcomm bind /dev/rfcomm6 20:16:09:21:87:56 9 &')
//exec('sudo rfcomm bind /dev/rfcomm6 00:21:13:00:4F:0D &') // KONGI, Battery
exec('sudo rfcomm bind /dev/rfcomm3 98:D3:32:30:8A:F5 &') // HAMSTER, outer temperature
//exec('sudo rfcomm bind /dev/rfcomm4 00:21:13:00:4F:0D &') // KONGI, Battery
exec('sudo rfcomm bind /dev/rfcomm0 98:D3:31:20:75:B8 &') // PAJU, outer LED
exec('sudo rfcomm bind /dev/rfcomm1 20:16:09:21:94:78') // test3, inner temp
//////////////////////////////////////paju iot///////////////////////////




/////////////////////////////hosu iot/////////////////////////////////
//exec('sudo rfcomm bind /dev/rfcomm2 00:13:EF:10:14:05 &') //
exec('sudo rfcomm bind /dev/rfcomm4 20:16:09:21:83:44 &') //
//exec('sudo rfcomm bind /dev/rfcomm0 00:13:EF:10:14:97 &') //
exec('sudo rfcomm bind /dev/rfcomm7 00:13:EF:10:13:F9 &') //

var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'logicpaju',
  database : 'smart'
});
/*
var port = new SerialPort('/dev/rfcomm4', {
	baudRate: 9600
});*/

var port = new SerialPort('/dev/rfcomm4', {
	baudRate: 9600
});


var port1 = new SerialPort('/dev/rfcomm1', {
	baudRate: 9600
});/*
var port1 = new SerialPort('/dev/rfcomm2', {
	baudRate: 9600
})*/;

var port2 = new SerialPort('/dev/rfcomm3', {
	baudRate: 9600
});
/*
var port2 = new SerialPort('/dev/rfcomm0', {
	baudRate: 9600
});*/
var port3 = new SerialPort('/dev/rfcomm7', {
	baudRate: 9600
});
var port4 = new SerialPort('/dev/rfcomm0', {
	baudRate: 9600
}); /*
var port5 = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
});*/
var line = ''
var line1 = ''
var line2 = ''
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
var pageCheck = 0;
////login
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var sess;
app.use(session({secret : 'ssshhhhh', resave:true, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var sensor_value = '';
var sensor_value1 = '';
var sensor_value2 = '';
port.on('data', function(data){
	var decoder = new StringDecoder('utf8');
	var textData = decoder.write(data);
	line += textData
	var li = line.split("\n");
	if(li.length>1){
		sensor_value = li[li.length-2]
		line = ''
	}
})
port1.on('data', function(data){
        var decoder1 = new StringDecoder('utf8');
        var textData1 = decoder1.write(data)
        line1 += textData1
        var li1 = line1.split('\n')
        if(li1.length>1){
                sensor_value1 = li1[0]
	        line1 = ''
        }
})
port2.on('data', function(data){
        var decoder2 = new StringDecoder('utf8');
        var textData2 = decoder2.write(data);
        line2 += textData2
        var li2 = line2.split('\n');
        if(li2.length>1){
                sensor_value2 = li2[0]
                line2 = ''
        }
});
var weather_text = new Array()
function crawling_weather(){
  crawl.get({url: 'http://www.kweather.co.kr/kma/kma_city.html'}, function(err, response, html) {
  var $  = cheerio.load(html);

    //데이터 추출
  $('.kma_digital_bg_02').each(function () {
    if ($(this).find('td').text().indexOf('문산')!=-1) {
      var text1 = $(this).find('td').eq(2).text()
      var text2 = $(this).find('td').eq(7).text()
      var text3 = $(this).find('td').eq(5).text()
      if (text3 == '북') {
        text3 = 'N'
      } else if (text3 == '북북동') {
        text3 = 'NNE'
      } else if (text3 == '북동') {
        text3 = 'NE'
      } else if (text3 == '동북동') {
        text3 = 'ENE'
      } else if (text3 == '동') {
        text3 = 'E'
      } else if (text3 == '동남동') {
        text3 = 'ESE'
      } else if (text3 == '남동') {
        text3 = 'SE'
      } else if (text3 == '남남동') {
        text3 = 'SSE'
      } else if (text3 == '남') {
        text3 = 'S'
      } else if (text3 == '남남서') {
        text3 = 'SSW'
      } else if (text3 == '남서') {
        text3 = 'SW'
      } else if (text3 == '서남서') {
        text3 = 'WSW'
      } else if (text3 == '서') {
        text3 = 'W'
      } else if (text3 == '서북서') {
        text3 = 'WNW'
      } else if (text3 == '북서') {
        text3 = 'NW'
      } else if (text3 == '북북서') {
        text3 = 'NNW'
      }
      var text4 = $(this).find('td').eq(6).text()
      var text5 = $(this).find('td').eq(3).text()
      if (text5 == '-') {
        text5 = '0.0mm'
      }
      var variable = text1.substr(0, text1.length-1) +','+ text2.substr(0, text2.length-1) +','+ text3 +','+text4.substr(0, text4.length-3)+','+text5.substr(0, text5.length-2)
      weather_text.unshift(variable)
     }
  })
})
}
setInterval(() => crawling_weather(), 1000)

app.get('/sensor', function(request, response){
  //response.send(weather_text[0])
  response.send(sensor_value);
});
app.get('/sensor1', function(request, response){
	response.send(sensor_value1);
});
app.get('/sensor2', function(request, response){
	response.send(sensor_value2);
});
app.get('/led', function(req, res, next){
  if(sess==null){
    res.redirect('/login')
  }
  res.render('led', {title: '제어(관수/환기)'});
});

app.post('/login_register',function(request,response){
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM login WHERE name='"+request.body.name+"';", function(err, data) {
      response.send(data);
      connection.release();
    });
  });
});
app.post('/login',function(request,response){
  sess=request.session; //세션을 설정
  sess.name = request.body.name;
  console.log("/login : "+sess.name);
  response.end('done');
});

app.get('/admin',function(request,response){
  sess=request.session;
  console.log("/admin : "+sess.name);
  if(sess.name){
    response.redirect('/led');
  }else{
    response.write('<h1>Please login first</h1>');
    response.end('<a href="/login">Login</a>');
  }
});

app.get('/session',function(request,response){
  sess=[request.session.name, pageCheck];
  console.log("/session : "+sess[0]);
  response.send(sess);
  response.end();
});

app.get('/logout',function(request,response){
  console.log("before : " + sess.name);
  sess = null;
  request.session.destroy(function(err){
    if(err){
      console.log(err);
    }else{
      response.redirect('/led');
    }
  });
});
app.get('/led/:switch', function(req, res, next){
  console.log(sess);
  if(sess==null){
	res.redirect('/login');	
  }else{
//	if(sess.name==undefined){
//		res.redirect('/login');
//  	}else{
    		function setLED(flag) {
      			var fs = require('fs');
      			fs.open('/dev/ttyACM0','a', 666, function(e, fd) {
        		fs.write(fd, flag ? '1' : '0', null, null, null, function() {
         			fs.close(fd, function() { });
        		});
      		});
//	}
    }
    var onoff = req.params.switch;
    if(onoff == 'on') setLED(0);
    if(onoff == 'off') setLED(1);
    res.render('led', { title: 'Solenoid Control : ' + req.params.switch });
  }
  
});
/*app.post('/bluetooth_solenoid_grass', function(request, response) {
  function setSol(flag) {
    var fs = require('fs');
    fs.open('/dev/rfcomm4', 'a', 666, function(e, fd) {
      if(flag==2) {
        fs.write(fd, '2', null, null, null, function () {
          fs.close(fd, function () {});
        })
      }
      if(flag==3) {
        fs.write(fd, '3', null, null, null, function () {
          fs.close(fd, function () {});
        })
      }
    })
    var switchs = requrest.body.switchs;
    if (switchs=='on1') {
      setSol(2);
      response.redirect('/led');
    }
    if (switchs=='off1') {
      setSol(3);
      response.redirect('/led');
    }
  })
})*/
app.post('/solarstatus', function(request, response){
	function setSolar(flag){
		var fs = require('fs');
		fs.open('/dev/rfcomm0', 'a', 666, function(e, fd){
			console.log("error"+e);			
if(flag==0){
		
		console.log("nong OFF");
				fs.write(fd, '0', null, null, null, function(){
					fs.close(fd, function(){});
				
				});
			}
			if(flag==1){
console.log("nong ON");
				fs.write(fd, '1', null, null, null, function(){
					fs.close(fd, function(){});
					
				});
			}
			if(flag==2){
console.log("nong AUTO");
				fs.write(fd, '2', null, null, null, function(){
					fs.close(fd, function(){});
					
				});
			}
		});
	}
var switchs = request.body.switchs;
	if(switchs=='off'){
		setSolar(0);
		console.log("nong Off--");
		
		response.redirect('/');
	}
	if(switchs=='on'){
console.log("nong On--");
		
		setSolar(1);
		response.redirect('/');
	}
	if(switchs=='auto'){
console.log("nong auto--");
		
		setSolar(2);
		response.redirect('/');
	}
});
app.post('/solarstatus_1', function(request, response){
	function setSolar_1(flag){
		var fs = require('fs');
		fs.open('/dev/rfcomm7', 'a', 666, function(e, fd){
			if(flag==0){
				fs.write(fd, '0', null, null, null, function(){
					fs.close(fd, function(){});
					console.log("house OFF");
				});
			}
			if(flag==1){
				fs.write(fd, '1', null, null, null, function(){
					fs.close(fd, function(){});
					console.log("house ON");
				});
			}
			if(flag==2){
				fs.write(fd, '2', null, null, null, function(){
					fs.close(fd, function(){});
					console.log("house AUTO");
				});
			}
		});
	}
	var switchs = request.body.switchs;
	if(switchs=='Off'){
console.log("house OFF_OFF");
		setSolar_1(0);
		response.redirect('/');
	}
	if(switchs=='on'){
console.log("house On_");	
	setSolar_1(1);

		response.redirect('/');
	}
	if(switchs=='auto'){
console.log("house auto_");
		setSolar_1(2);
		response.redirect('/');
	}
});
app.post('/onoff', function(request, response) {
	function setLED(flag){
		var fs = require('fs');
		fs.open('/dev/ttyACM0', 'a', 666, function(e, fd) {
                        if(flag==0){
                                fs.write(fd, '0', null, null, null, function(){
                                        fs.close(fd, function(){});
                                });
                        }
                        if(flag==1){
                                fs.write(fd, '1', null, null, null, function(){
                                        fs.close(fd, function(){});
                                });
                        }
                        if(flag==2){
                                fs.write(fd, '2', null, null, null, function(){
                                        fs.close(fd, function(){});
                                });
                        }
                        if(flag==3){
                                fs.write(fd, '3', null, null, null, function(){
                                        fs.close(fd, function(){});
                                });
                        }
			/*fs.write(fd, flag ? '1' : '0', null, null, null, function () {
				fs.close(fd, function() { });
			});*/
		});
	}


        /*function setLED1(flag){
                var fs = require('fs');
                fs.open('/dev/ttyACM0', 'a', 666, function(e, fd) {
                        fs.write(fd, flag ? '3' : '2', null, null, null, function () {
                                fs.close(fd, function() { });
                        });
                });
        }*/
	var d = new Date()
	var time = d.getFullYear() + '.'+(d.getMonth()+1)+'.'+d.getDate()+'.'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	var switchs = request.body.switchs;
	var st_time;
	if(switchs=='on'){
		pool.getConnection(function(err, connection){
			connection.query('insert into on_off_time (time, status) values("'+time+'", "'+switchs+'");', function(err, data){
				connection.release();
			})
		})
	 	setLED(0);
		st_time = setTimeout(function(){
			pool.getConnection(function(err, connection){
				var stop_time = new Date()
				var time2 = stop_time.getFullYear()+'.'+(stop_time.getMonth()+1)+'.'+stop_time.getDate()+'.'+stop_time.getHours()+':'+stop_time.getMinutes()+':'+stop_time.getSeconds();
				connection.query('insert into on_off_time (time, status) values("'+time2+'", "off");', function(err, data){
					connection.release();
				})
			});
			setLED(1);
		}, 3600000)	
		response.redirect('/led');
			

	}
	if(switchs=='off'){
		pool.getConnection(function(err, connection){
			connection.query('insert into on_off_time (time, status) values("'+time+'", "'+switchs+'");', function(err, data){
				connection.release();
			})
		})
	 	setLED(1);
		response.redirect('/led')
	}
        if(switchs=='on1'){
          pool.getConnection(function(err, connection) {
            connection.query('insert into on_off_time1 (time, status) values("'+time+'", "on");', function (err, data) {
              connection.release();
            })
          }) 
          setLED(2);
          st_time = setTimeout(function(){
            pool.getConnection(function(err, connection){
              var stop_time = new Date()
              var time2 = stop_time.getFullYear()+'.'+(stop_time.getMonth()+1)+'.'+stop_time.getDate()+'.'+stop_time.getHours()+':'+stop_time.getMinutes()+':'+stop_time.getSeconds();
              connection.query('insert into on_off_time1 (time, status) values("'+time2+'", "off");', function(err, data){
                connection.release();
              })
            });
            setLED(3);
          }, 3600000)
          response.redirect('/led');
	}
        if(switchs=='off1'){
          pool.getConnection(function(err, connection){
            connection.query('insert into on_off_time1 (time, status) values("'+time+'", "off");', function(err, data){
              connection.release();
            })
          })
          setLED(3);
          response.redirect('/led')
        }
});
app.get('/record', function(request, response){
	pool.getConnection(function(err, connection){
		connection.query('SELECT * from on_off_time order by id desc', function(err, data){
			response.send(data);
			connection.release();
		})
	})
})
app.get('/record1', function(request, response){
  pool.getConnection(function(err, connection){
    connection.query('SELECT * from on_off_time1 order by id desc', function(err, data){
      response.send(data);
      connection.release();
    })
  })
})
app.listen(3000,function () {
  console.log("server running on 3000")
})
//////login end
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



// module.exports = app;
