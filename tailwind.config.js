module.exports = {
  content: ["./views/**/*.{handlebars,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('daisyui'),
  ],
}