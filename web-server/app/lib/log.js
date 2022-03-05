const log4js = require('log4js');

log4js.configure({
    appenders:{
        std: { type: "stdout", level: "all", layout:{type: "basic", } },
        file: { type: "file", filename: "log.txt", encoding: "utf-8" }
    },
    categories: {
        default: {appenders: ["std"], level: "debug"},
        custom: {appenders: ["std"], level: "all"}
    }
});

const log = log4js.getLogger('custom');
module.exports = log
