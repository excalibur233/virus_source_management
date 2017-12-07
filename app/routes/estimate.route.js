const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const estimateController = require('../controllers/estimate.controller');

const prefix = '/estimate';
router.get('/', authController.isLogin, estimateController.index);
// router.get('/search', authController.isLogin, testController.findNewsList);
router.get('/edit/:estimateId?', authController.isLogin, estimateController.edit);
// router.get('/add', authController.isLogin, testController.add);
// router.get('/tests/:testId', authController.isLogin, testController.qryTestDetails);
router.post('/save', authController.isLogin, estimateController.save);
// router.post('/tests/edit', authController.isLogin, testController.editTests);
router.get('/del/:estimateId', authController.isLogin, estimateController.del);

module.exports = function (app) {
  app.use(prefix, router);
};
