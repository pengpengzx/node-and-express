const fortune = require('./fortune.js');
const path = require('path');
const fs = require('fs');
const {
  promisify
} = require('util');

const dataDir = path.resolve(__dirname, '..', 'data');
const vacationPhotoDir = path.join(dataDir, 'vacation-photo');


if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(vacationPhotoDir)) {
  fs.mkdirSync(vacationPhotoDir);
}

function saveContentEntry(contestName, email, year, month, photoPath) {
  // TODO
}

const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);

console.log(dataDir)
console.log(vacationPhotoDir)
exports.home = (req, res) => {
  res.cookie('user', 'zyp');
  res.cookie('user_signed', 'nom nom', {
    signed: true
  });
  res.render('home');
};
exports.about = (req, res) => res.render('about', {
  fortune: fortune.getFortune()
});
exports.notFound = (req, res) => res.render('404');
exports.serverError = (req, res) => res.render('500');
exports.newsletterSignup = (req, res) => res.render('newsletter-signup', {
  csrf: 'CSRF token goes here'
});
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
    res.send({
      result: 'success'
    });
  },
}

exports.api.vacationPhotosDir = async (req, res, fields, files) => {
  const photo = files.photo[0];
  const dir = `vacationPhotosDir/${Date.now()}`;
  const path = `${dir}/${photo.originalFilename}`;

  await mkdir(dir)
  await rename(photo.path, path);

  saveContentEntry('vacation-photo',
    fields.email,
    req.params.year,
    req.params.month,
    path
  );

  res.send({result: 'success'})
}