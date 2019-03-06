const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session');
const sqlite3 = require('sqlite3');
var createjob = require('./lib/createJobRecord');


const PORT = process.env.PORT || 4000
var app = express();
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    name: 'SESS_ID',
    secret: 'asodhfpoash0843r:',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, expires: false}
}));

var helmet = require('helmet');
var session = require('express-session');

app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.render('pages/create_schedule');
});

app.post('/create_new_jobs', function(req, res) {
    createjob.createScheduler(req.body.cron_time, req.body.job_name);
    res.render('pages/create_schedule');
});

  