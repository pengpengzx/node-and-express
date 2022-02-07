const fortuneCookies = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Good Manners get you everywhere.",
];

exports.getFortune = () => {
  const idx = Math.floor(Math.random() * fortuneCookies.length);
  return fortuneCookies[idx];
}