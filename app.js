 var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

var middleware = require('./middleware/checkLogin');

const crypto = require('crypto');

const Churches = require('./models/church').Church;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var multer = require('multer');

const GridFsStorage = require('multer-gridfs-storage');

const Grid = require('gridfs-stream')

//const conn = mongoose.createConnection('mongodb://localhost/church')

let gfs;



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/church');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
   gfs = Grid(db.db, mongoose.mongo);
  	console.log('we are connected')
  // all set!
  gfs.collection('uploads')
})

// Create Storage Engine

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || 'mongodb://localhost/church',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });



var app = express();


app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/editChurch', express.static('public'))
app.use('/delChurch', express.static('public'))
app.use('/auth', express.static('public'))

app.use(session( {
  secret: 'this is a great sessionasdafsd',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
  	mongooseConnection:db
  })
}));

app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next()
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);




app.get('/upload', middleware.checkLogin, function(req, res, next){

	gfs.files.find().toArray(function(err, files){

		if(!files || files.length===0 ){
			res.render('addImage', {files:false})
		}else{
			files.map(function(file){
				if(file.contentType==='image/jpeg' || file.contentType ==='image/png' || file.contentType ==='image/jpg' ){
					file.isImage = true;
				}else{
					file.isImage = false;
				}
			});	
			res.render('addImage2', {files:files})
		}
	})
})

app.post('/upload',  upload.single('file'), function(req, res, next){
	console.log(req.body)
	console.log('success')

	res.redirect('/upload')

})



// LIst all fiels

app.get('/files', middleware.checkLogin, function(req, res, next){

	gfs.files.find().toArray(function(err, files){
		if(!files || files.length ===0){
			return res.status(404).json({
				err: 'No files exist'
			})
		}else{
			res.json(files)
		}
	})
})

// Get an image 

app.get('/files/:filename', middleware.checkLogin, function(req, res, next){

	gfs.files.findOne({filename: req.params.filename}, function(err, file){
		if(!file || file.length ===0){
			return res.status(404).json({
				err: 'No files exist'
			})
		}else{
			return res.json(file)
		}
	})
})


// find one of the files


app.get('/image/:filename', middleware.checkLogin, function(req, res, next){

	gfs.files.findOne({filename: req.params.filename}, function(err, file){
		if(!file || file.length ===0){
			return res.status(404).json({
				err: 'No files exist'
			})
		}

		if(file.contentType=== 'image/jpeg' || file.contentType=== 'image/png' ||  file.contentType=== 'image/jpeg'  ){
			var readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		}else{
			res.status(404).json({
				err: 'Not an image'
			})
		}
	})
})










// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
