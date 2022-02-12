const express = require('express');
const multiparty = require('multiparty');

const {
  engine
} = require('express-handlebars');
const handlers = require('./lib/handlers');
const bodyParse = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParse.urlencoded({
  extended: true
}));
app.use(bodyParse.json());
app.use(express.static(__dirname + '/public'));
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

app.listen(port)