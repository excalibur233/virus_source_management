const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const testController = require('../controllers/test.controller');

const prefix = '/test';
router.get('/', authController.isLogin, testController.index);
// router.get('/search', authController.isLogin, testController.findNewsList);
router.get('/edit/:testId?', authController.isLogin, testController.edit);
// router.get('/add', authController.isLogin, testController.add);
// router.get('/tests/:testId', authController.isLogin, testController.qryTestDetails);
router.post('/save', authController.isLogin, testController.save);
// router.post('/tests/edit', authController.isLogin, testController.editTests);
router.get('/del/:testId', authController.isLogin, testController.del);

module.exports = function (app) {
  app.use(prefix, router);
};
