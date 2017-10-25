if (process.env.NODE_ENV === 'production') {
  module.exports = require('./env/production');
} else if (process.env.NODE_ENV === 'development') {
  module.exports = require('./env/development');
} else {
  module.exports = require('./env/development');
}
