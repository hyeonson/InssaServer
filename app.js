var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var socketio = require('socket.io');

var connect={};
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

var userSchema = mongoose.Schema({
  user_id: String,
  user_pw: String,
  user_name: String,
  user_age: Number,
  user_saying: String,
  user_major: String,
  user_sex: String,
  user_grade: Number,
  user_loved: {type: String, default: ""},
  user_matched: {type: String, default: ""},
  user_mentor: {type: Number, default: 0},
  user_mentee: {type: Number, default: 0},
  user_img: {type: String, default: "who.jpg"},
  user_socket: {type: String, default: ""}
});
var User = mongoose.model('User',userSchema);

var ChatSchema = mongoose.Schema({
  room_number: { type: String, required: true, unique: true },
  sender_id: [{ type: String }],
  listener_id: [{ type: String }],
  message: [{ type: String }],
  date: [{ type: Date }]
});
var chat = mongoose.model('chat', ChatSchema);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.get('/signup', function(req, res){
  res.send('hello world!');
});

app.post('/signup', function (req, res){
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });

  req.on('end', function(){
    console.log('user_id: ' + inputData.user_id);
    console.log('user_pw: ' + inputData.user_pw);
    console.log('user_name: ' + inputData.user_name);
    console.log('user_age: ' + inputData.user_age);
    console.log('user_saying: ' + inputData.user_saying);
    console.log('user_major: ' + inputData.user_major); 
    console.log('user_sex: ' + inputData.user_sex);
    console.log('user_grade: ' + inputData.user_grade);

    var user_id = inputData.user_id;
    var user_pw = inputData.user_pw;
    var user_name = inputData.user_name;
    var user_age = inputData.user_age;
    var user_saying = inputData.user_saying;
    var user_major = inputData.user_major;
    var user_sex = inputData.user_sex;
    var user_grade = inputData.user_grade;

    var user = new User({user_id:user_id, user_pw:user_pw, user_name:user_name, user_age:user_age, user_saying:user_saying,
      user_major:user_major, user_sex:user_sex, user_grade:user_grade})
    
    user.save(function(err){
      if (err) console.log(err);
      res.write('111');
      res.end();
    });
  });
});


app.post('/signup_test', function (req, res){
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var user_name = req.body.user_name;
  var user_age = req.body.user_age;
  var user_saying = req.body.user_saying;
  var user_major = req.body.user_major;
  var user_sex = req.body.user_sex;
  var user_grade = req.body.user_grade;
  console.log('user_id: ' + req.body.user_id);
  console.log('user_pw: ' + req.body.user_pw);
  console.log('user_name: ' + req.body.user_name);
  console.log('user_age: ' + req.body.user_age);
  console.log('user_saying: ' + req.body.user_saying);
  console.log('user_major: ' + req.body.user_major); 
  console.log('user_sex: ' + req.body.user_sex);
  console.log('user_grade: ' + req.body.user_grade);
  var user = new User({user_id:user_id, user_pw:user_pw, user_name:user_name, user_age:user_age, user_saying:user_saying,
    user_major:user_major, user_sex:user_sex, user_grade:user_grade})
    
  user.save(function(err){
    if (err) console.log(err);
    res.send('{"code":1, "msg": "successed"}');
  });
});


app.post('/login', function (req, res){

  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  console.log('user_id: ' + req.body.user_id);
  console.log('user_pw: ' + req.body.user_pw);

  User.findOne({user_id:user_id, user_pw:user_pw}, function(err, rawContent){
    if (err) {
      res.send('{"code":-1, "msg": "failed"}');
    } else if(rawContent == null){
      res.send('{"code":-1, "msg": "failed"}');
    } else {
      res.send('{"code":1, "msg": "successed"}');
    }
    res.end();
  });
  /*
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });
  
  req.on('end', function(){
    console.log('login_id: ' + inputData.login_id);
    console.log('login_pw: ' + inputData.login_pw);

    var user_id = inputData.login_id;
    var user_pw = inputData.login_pw;

    User.findOne({user_id:user_id, user_pw:user_pw}, function(err, rawContent){
      if (err) {
        res.write('999');
      } else if(rawContent == null){
        res.write('999');
      } else {
        res.write('111');
      }
      res.end();
    });

  });
  */
});

app.post('/main', function (req, res){
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });
  
  req.on('end', function(){
    console.log('user_id: ' + inputData.user_id);

    var user_id = inputData.user_id;

    User.findOne({user_id:user_id}, function(err, rawContent){
      if (err) {
        res.write('999');
      } else if(rawContent == null){
        res.write('999');
      } else {
        var result = {};
        var user_mentor = rawContent.user_mentor;
        var user_mentee = rawContent.user_mentee;
        result['user_mentor'] = user_mentor;
        result['user_mentee'] = user_mentee;
        res.json(result);
      }
      res.end();
    });

  });
});

app.post('/imgUpload/:userID', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  var user_id = req.params.userID;
  User.update({user_id: user_id}, {$set: {user_img: req.file.originalname}}, function(err, output){
    if(err) res.send('{"code":-1, "msg": "failed"}');
    console.log(output);
    if(!output.n) res.send('{"code":-1, "msg": "failed"}');
  });
  res.send('{"code":1, "msg": "successed"}');
});

/*
app.post('/imgUpload/:filename', function (req, res, next) {
  upload(req, res).then(function (file) {
    res.send('{"code":1, "msg": "successed"}');
  }, function (err) {
    res.send('{"code":-1, "msg": "failed"}');
  });
  console.log(req.file);
});
*/
app.post('/numberSetting', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);

  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('{"mentor":-1, "mentee":-1}');
    } else if(rawContent == null){
      res.send('{"mentor":-1, "mentee":-1}');
    } else {
      /*
      var result = {};
      var user_mentor = rawContent.user_mentor;
      var user_mentee = rawContent.user_mentee;
      result['user_mentor'] = user_mentor;
      result['user_mentee'] = user_mentee;
      res.json(result);
      */
      res.send('{"mentor":' + rawContent.user_mentor + ',' + '" mentee":' + rawContent.user_mentee + '}');
      //res.send('{"mentor":-1, "mentee":-1}');
    }
    res.end();
  });
});

app.post('/allProfile', function(req, res){
  User.find({}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
      res.send(rawContent);
    }
    res.end();
  });
});

app.post('/showProfile', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);

  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
      res.send(rawContent);
    }
    res.end();
  });
});

app.post('/likeYou', function(req, res){
  var loved_id = req.body.loved_id;
  var loving_id = req.body.loving_id;
  var save_user_loved;
  console.log('loved_id: ' + req.body.loved_id);
  console.log('loved_id: ' + req.body.loving_id);

  User.findOne({user_id:loved_id}, function(err, rawContent){
    if (err) {
      res.send('{"code":-1, "msg": "failed"}');
    } else if(rawContent == null){
      res.send('{"code":-1, "msg": "failed"}');
    } else {
      save_user_loved = rawContent.user_loved;
      User.update({user_id: loved_id}, {$set: {user_loved: save_user_loved + loving_id +'$'}}, function(err, output){
        if(err) res.send('{"code":-1, "msg": "failed"}');
        console.log(output);
        if(!output.n) res.send('{"code":-1, "msg": "failed"}');
      });
      res.send('{"code":1, "msg": "successed"}');
    }
    res.end();
  });
});

app.post('/likeYou2', function(req, res){
  var loved_id = req.body.loved_id;
  var loving_id = req.body.loving_id;
  var save_user_matched;
  var save_user_matched2;
  console.log('loving_id: ' + req.body.loving_id);
  console.log('loved_id: ' + req.body.loved_id);

  User.findOne({user_id:loved_id}, function(err, rawContent){
    if (err) {
      res.send('{"code":-1, "msg": "failed"}');
    } else if(rawContent == null){
      res.send('{"code":-1, "msg": "failed"}');
    } else {
      save_user_matched = rawContent.user_matched;
      User.update({user_id: loved_id}, {$set: {user_matched: save_user_matched + loving_id +'$'}}, function(err, output){
        if(err) res.send('{"code":-1, "msg": "failed"}');
        console.log(output);
        if(!output.n) res.send('{"code":-1, "msg": "failed"}');
      });
    }
  });
  User.findOne({user_id:loving_id}, function(err, rawContent){
    if (err) {
      res.send('{"code":-1, "msg": "failed"}');
    } else if(rawContent == null){
      res.send('{"code":-1, "msg": "failed"}');
    } else {
      save_user_matched2 = rawContent.user_matched;
      User.update({user_id: loving_id}, {$set: {user_matched: save_user_matched2 + loved_id +'$'}}, function(err, output){
        if(err) res.send('{"code":-1, "msg": "failed"}');
        console.log(output);
        if(!output.n) res.send('{"code":-1, "msg": "failed"}');
      });
    }
  });
  User.update({user_id: loved_id}, {$inc: {user_mentor: 1}}, function(err, output){
    if(err) res.send('{"code":-1, "msg": "failed"}');
    console.log(output);
    if(!output.n) res.send('{"code":-1, "msg": "failed"}');
  });
  User.update({user_id: loving_id}, {$inc: {user_mentee: 1}}, function(err, output){
    if(err) res.send('{"code":-1, "msg": "failed"}');
    console.log(output);
    if(!output.n) res.send('{"code":-1, "msg": "failed"}');
  });
  res.send('{"code":1, "msg": "successed"}');
  res.end();
});

app.post('/likeYouList', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);
  var userList;
  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
    userList = rawContent.user_loved;
    console.log('userList: ' + userList);
    res.send('{"list_id":' + '"' + userList + '"' + '}');
    }
  });
});
app.post('/likeYouList2', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);
  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
      res.send(rawContent);
    }
    res.end();
  });
});

app.post('/matchedList', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);
  var userList;
  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
    userList = rawContent.user_matched;
    console.log('userList: ' + userList);
    res.send('{"list_id":' + '"' + userList + '"' + '}');
    }
  });
});
app.post('/matchedList2', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);
  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('failed');
    } else if(rawContent == null){
      res.send('failed');
    } else {
      res.send(rawContent);
    }
    res.end();
  });
});

app.post('/getlm', function(req, res){
  var user_id = req.body.user_id;
  console.log('user_id: ' + req.body.user_id);

  User.findOne({user_id:user_id}, function(err, rawContent){
    if (err) {
      res.send('{"mentor":-1, "mentee":-1}');
    } else if(rawContent == null){
      res.send('{"mentor":-1, "mentee":-1}');
    } else {
      res.send('{"user_loved":"' + rawContent.user_loved + '", ' + '"user_matched": "' + rawContent.user_matched + '"}');
    }
    res.end();
  });
});



//Express 서버 시작
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});

var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    console.log('socket연결됨');

    socket.on('socket_id', function (data) {
        connect[data] = socket.id;
        socket.user_id=data;
        console.log(socket.id);
    });
    socket.on('loadChat', function (data) {
        var splitted=data.split(':');
        var user1=splitted[0];
        var user2=splitted[1];
        chat.find(function (err, result) {
            if (result.length > 0) {
                var object
                for (var i = 0; i < result[0].message.length; i++) {
                    if (result[0].sender_id[i] == socket.user_id) {
                        object = { "name": "나", "message": result[0].message[i] };
                        socket.emit('message', object);
                    }
                    else {
                        object = { "name": "상대", "message": result[0].message[i] };
                        socket.emit('message', object);
                    }
                }
            }else{
                var new_chat=new chat({
                    "room_number":data
                });
                new_chat.save(function(err){
                    console.log(data+" 방 생성 완료");
                });
            }
        }).or([{ "room_number": user1+ ":" + user2 }, { "room_number": user2 + ":" + user1 }]);
    });
    socket.on('message', function (data) {
        chat.find(function (err, result) {
            if (result.length > 0) {
                var sender = result[0].sender_id;
                sender[sender.length] = data.sender_id;
                var listener = result[0].listener_id;
                listener[listener.length] = data.listener_id;
                var message = result[0].message;
                message[message.length] = data.message;
                var date = result[0].date;
                date[date.length] = Date.now();
                chat.where({ "room_number": result[0].room_number }).update({ "sender_id": sender, "listener_id": listener, "message": message, "date": date }, function () { });
            } else {
                console.log("방이 없음");
            }
        }).or([{ "room_number": data.sender_id + ":" + data.listener_id }, { "room_number": data.listener_id + ":" + data.sender_id }]);
        io.to(connect[data.sender_id]).emit('message', { name: "나", message: data.message });
        io.to(connect[data.listener_id]).emit('message', { name: data.sender_id, message: data.message });
    });
});
io.sockets.on('disconnection', function () {
    console.log('socket연결이 해제됨.');
});
