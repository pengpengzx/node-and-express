const fortune = require('./fortune.js');

exports.home = (req, res) => res.render('home');
exports.about = (req, res) => res.render('about', {fortune: fortune.getFortune()});
exports.notFound = (req, res) => res.render('404');
exports.serverError = (req, res) => res.render('500');
exports.newsletterSignup = (req, res) => res.render('newsletter-signup', {csrf: 'CSRF token goes here'});
exports.newsletterSignupProcess = (req, res) => {
  console.log(req.body._csrf);
  console.log(req.body.name);
  console.log(req.body.email);
  res.redirect(303, '/newsletter-signup-thank-you');
};
exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you');
exports.newsletter = (req, res) => res.render('newsletter');
exports.vacationPhotoContestProcess = (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.redirect(303, '/contest/vacation-photo-thank-you');
};
exports.vacationPhoto = (req, res) => res.render('./contest/vacation-photo', {
  year: new Date().getFullYear(),
  month: new Date().getMonth()
});

exports.vacationPhotoContestProcess = (req, res) => {
  res.redirect(303, '/contest/vacation-photo-thank-you');
}

exports.vacationPhotoThankYou = (req, res) => res.render('contest/vacation-photo-thank-you');
exports.api = {
  newsletterSignup: (req, res) => {
    console.log(req.body.name, '?????');
    console.log(req.body.email);
    res.send({result: 'success'});
  },
}
