const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const commissionController = require('../controllers/commission.controller');

const prefix = '/commission';
router.get('/', authController.isLogin, commissionController.index);
router.get('/edit', authController.isLogin, commissionController.edit);

module.exports = function (app) {
  app.use(prefix, router);
};
