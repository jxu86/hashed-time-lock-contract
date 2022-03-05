const fileList = require('fs').readdirSync('./app/lib').filter(file => file.search(/index\.js$|event/));
const _exp = {};
fileList.filter((v) => {
  _exp[v.replace('.js', '')] = require(`./${v}`);
  return true;
});

module.exports = _exp;