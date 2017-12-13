const url = require('url');
const config = require('../../config/config');
const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const qiniu = require('qiniu');
const crypto = require('crypto');
const Model = require('../models/index');
const logger = require('../utils/log.util').getLogger('infoLogger');

// 中间件：判断是否已经登录
exports.isLogin = (req, res, next) => {
  const manager = req.session.manager || {};

  // 记载用户的起始url，方便登录/注册后跳转
  const originalUrl = url.format({
    protocol: req.protocol,
    host: req.hostname,
    pathname: req.originalUrl,
  });

  req.session.originalUrl = originalUrl;

  if (!manager || !manager.managerId) {
    res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
  } else {
    next();
  }
};

// 中间件：判断是否属于超级管理员 目前只有超级管理员可以添加后台账号
exports.isSuperManager = (req, res, next) => {
  const manager = req.session.manager || {};

  if (!manager || !manager.managerId) {
    res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
    return;
  }

  if (parseInt(manager.type, 0) !== 1) {
    const err = new Error('抱歉，只有超级管理员有此权限');
    next(err);
    return;
  }

  next();
};

// 登录页面
exports.loginPage = (req, res) => {
  res.render('login');
};

// 请求登录
exports.login = (req, res) => {
  const account = req.body.account || '';
  let password = req.body.password || '';
  const httpUtil = new HttpUtil(req, res);

  if (!password || !account) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数不能为空');
    return;
  }

  password = crypto.createHash('md5').update(password).digest('hex');
  // console.log(password);
  Model.Manager.findOne({ where: { account } }).then((managerInfo) => {
    if (!managerInfo.dataValues || password !== managerInfo.dataValues.password) {
      httpUtil.sendJson(constants.HTTP_FAIL, '账户或者密码错误');
      return;
    }

    req.session.manager = {
      managerId: managerInfo.dataValues.managerId,
      account: managerInfo.dataValues.account,
      type: managerInfo.dataValues.type,
    };

    httpUtil.sendJson(constants.HTTP_SUCCESS, '登入成功', '/news');

    // res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}/index`);
  }).catch((err) => {
    logger.info(err);
    // console.log(err);
    httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
  });
};

exports.logout = (req, res) => {
  req.session.manager = {};
  res.redirect('/');
};
// 请求注册
exports.register = (req, res) => {
  const account = req.body.account || '';
  let password = req.body.password || '';
  const type = parseInt(req.body.type, 0) || 2;
  const httpUtil = new HttpUtil(req, res);

  if (!password || !account) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数不能为空');
    return;
  }

  password = md5.update(password).digest('hex');
  Model.Manager.create({ account, password, type }).then((managerInfo) => {
    if (!managerInfo.dataValues) {
      httpUtil.sendJson(constants.HTTP_FAIL, '账户注册失败');
      return;
    }
    httpUtil.sendJson(constants.HTTP_SUCCESS, '账户注册成功');
  }).catch((err) => {
    logger.info(err);
    httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
  });
};

// 获取七牛云的上传凭证
exports.getQiNiuToken = (req, res) => {
  const mac = new qiniu.auth.digest.Mac(config.qiNiuConfig.accessKey, config.qiNiuConfig.secretKey);
  const options = {
    scope: config.qiNiuConfig.bucket,
    returnBody: `{"key":"$(key)","hash":"$(etag)","state":"SUCCESS","url":"${config.qiNiuConfig.showLink}/$(key)","title":"$(key)","original":"$(key)"}`,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  // console.log(req.body);
  res.end(uploadToken);
};

