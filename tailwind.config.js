/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cel: ['ClashDisplay-Extralight', 'Microsoft YaHei', 'PingFang SC'],
        cl: ['ClashDisplay-Light', 'Microsoft YaHei', 'PingFang SC'],
        cr: 'ClashDisplay-Regular',
        cm: 'ClashDisplay-Medium',
        cs: 'ClashDisplay-Semibold',
        cb: ['ClashDisplay-Bold', 'Microsoft YaHei', 'PingFang SC'],
      }
    },
  },
  plugins: [],
}