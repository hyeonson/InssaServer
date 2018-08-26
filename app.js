var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');

var multer = require('multer');
//var formidable = require('express-formidable');
//var upload = multer({ dest: 'uploads/'});
/*
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, path.extname(file.originalname));
    }
  })
});
*/
/*
var upload = function (req, res) {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },

    // 서버에 저장할 파일 명
    filename: function (req, file, cb) {
      
      file.uploadedFile = {
        name: req.params.filename,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
      //cb(null, path.extname(file.originalname));
    }
  });

  var upload = multer({ storage: storage }).single('file');
  upload(req, res, function (err) {
    if (err) deferred.reject();
    else deferred.resolve(req.file.uploadedFile);
  });
  return deferred.promise;
};
*/
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
  user_mentee: {type: Number, default: 0}
});
var User = mongoose.model('User',userSchema);

//기본포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);


//body-parser를 사용해 application/x-www-form-urlencoded 파싱
//app.use(bodyParser.urlencoded({ extended: true }));
//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
var _storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, 'uploads/');
  },
  filename: (req, file, cb)=>{
    cb(null, file.originalname);
  }
});
var upload = multer({storage:_storage});
var urlencoded = bodyParser.urlencoded({extended:false});
app.use(urlencoded);
//app.use(formidable(opts));

//app.use(static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'jade')
//app.set('views', './views')


/*
app.get('/question', function (req, res) {
    Quest.find({}).sort({date:-1}).exec(function(err, rawContents){
      // db에서 날짜 순으로 데이터들을 가져옴
       if(err) throw err;
       res.render('question.jade', {title: "Board", contents: rawContents}); 
       // board.ejs의 title변수엔 “Board”를, contents변수엔 db 검색 결과 json 데이터를 저장해줌.
    });
});
*/
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
    //var result = {};
    //result['upload_result'] = '111';
    //res.json(result);
    //res.end();
    res.send('{"code":1, "msg": "successed"}');
  });
});


app.post('/login', function (req, res){
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

app.post('/imgUpload', (req, res)=>{
  upload(req, res, function(err) {
    if (err) {
      console.log('전송 에러');
    }
    console.log(req.file);
    return res.send('{"code":1, "msg": "successed"}');
  });
});

//Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});
