require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const { engine } = require('express-handlebars');

const nodeMailer = require('nodemailer');
// const flashMiddleware = require('./lib/middleware/flash');
const multiparty = require('multiparty');
const handlers = require('./lib/handlers');
const bodyParse = require('body-parser');
const cluster = require('cluster');

const COOKIE_SECRET = process.env.COOKIE_SECRET;
const port = process.env.PORT || 3000;

const app = express();

const mailTransport = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// try {
//   const result = await mailTransport.sendMail({
//     from: '"Fred Foo 👻" <' + process.env.MAIL_USER + '>',
//     to: '"Bar Foo 👻" <' + process.env.MAIL_USER + '>',
//     subject: 'Hello ✔',
//     text: 'Hello world?',
//     html: '<b>Hello world?</b>'
//   });
// } catch (error) {
  
// }

// app.use(flashMiddleware);
app.use(bodyParse.urlencoded({
  extended: true
}));
app.use(bodyParse.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(expressSession({
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.use((res, req, next) => {
  if(cluster.isWorker) {
    console.log(`Worker ${cluster.worker.id} received request`);
  }
  next();
});

app.engine('handlebars', engine({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars')

// routes
app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/newsletter', handlers.newsletter);
app.get('/newsletter-signup', handlers.newsletterSignup);
app.get('/headers', (req, res) => {
  res.type('text/plain')
  const headers = Object.entries(req.headers).map(([key, value]) => `${key}:${value}`)
  res.send(headers.join('\n'))
})

app.get('./fail', (req, res) => {
  throw new Error('Something failed');
})
app.post('/newsletter-signup-process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup-thank-you', handlers.newsletterSignupThankYou);
app.get('/contest/vacation-photo', handlers.vacationPhoto);
app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoThankYou);

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  console.log(form, 'formform')
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({
        error: err.message
      })
    }

    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})

app.post('/api/newsletter-signup', handlers.api.newsletterSignup);
// 404 page
app.use(handlers.notFound)
// 500 page
app.use(handlers.serverError)

function startServer(port) {
  app.listen(port, function() {
    console.log(`Express start in ${app.get('env')} 
    Mode on server listening http://localhost:${port}`);
  })
}

console.log(require.main === module)
if (require.main === module) {
  startServer(process.env.PORT || 3000);
} else {
  module.exports = startServer;
}
