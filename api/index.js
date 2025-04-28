const app = require('../index');  // <-- imports your Express app

module.exports = (req, res) => {
  app(req, res); // <-- handles every request
};
