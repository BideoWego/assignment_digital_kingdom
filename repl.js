const repl = require('repl').start({});
const db = require('./models');

repl.context.db = db;
repl.context.lg = console.log;




