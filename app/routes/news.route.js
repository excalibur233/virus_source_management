const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const newsController = require('../controllers/news.controller');

const prefix = '/news';
router.get('/', authController.isLogin, newsController.index);
router.get('/search', authController.isLogin, newsController.findNewsList);
router.get('/details/:newsId', authController.isLogin, newsController.qryNewsDetails);
router.get('/tests/:testId', authController.isLogin, newsController.qryTestDetails);
router.post('/details/edit', authController.isLogin, newsController.editNews);
router.post('/tests/edit', authController.isLogin, newsController.editTests);
router.post('/del', authController.isLogin, newsController.delNews);

module.exports = function (app) {
  app.use(prefix, router);
};
