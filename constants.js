const {ApiHost} = require('./config.js');
module.exports = {
  hostRegex: new RegExp('^'+ApiHost)
};