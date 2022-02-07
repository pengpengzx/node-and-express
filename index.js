const express = require('express');
const { engine} = require('express-handlebars');
const fortune = require('./lib/fortune.js');

const app = express();
const port = process.env.PORT || 3000;

const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', engine({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars')


// routes
app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about', {fortune: fortune.getFortune()});
})

app.use((req, res) => {
  res.status(404);
  res.render('404');
})

// //定制500页
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500)
  res.render('500')
})

app.listen(port)