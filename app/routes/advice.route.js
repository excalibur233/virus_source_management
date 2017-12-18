const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const adviceController = require('../controllers/advice.controller');

const prefix = '/advice';
router.get('/', authController.isLogin, adviceController.index);
// router.get('/search', authController.isLogin, adviceController.findNewsList);
router.get('/edit', authController.isLogin, adviceController.edit);

module.exports = function (app) {
  app.use(prefix, router);
};
