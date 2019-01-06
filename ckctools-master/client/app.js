//app.js
var config = require('./config')
const Towxml = require('/towxml/main');
App({
  onLaunch: function() {},
  towxml: new Towxml(),
  globalData: {
    url: 'https://ckcyouth.hjzzju.xyz',
    url2: 'https://www.ckcyouth.club',
  }
})