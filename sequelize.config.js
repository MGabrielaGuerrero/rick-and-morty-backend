// sequelize.config.js
require('ts-node').register({ transpileOnly: true }); // habilita TS
const cfg = require('./src/database/config/config.ts');
module.exports = cfg.default || cfg;

  