const url = require('url');
const config = require('../../config/config');
const HttpUtil = require('../utils/http.util');
const qiniu = require('qiniu');
const md5 = require('crypto').createHash('md5');
const Model = require('../models/index');

// 中间件：判断是否已经登录
exports.isLogin = (req, res, next) => {
  const managerInfo = req.session.manager || {};

  // 记载用户的起始url，方便登录/注册后跳转
  const originalUrl = url.format({
    protocol: req.protocol,
    host: req.hostname,
    pathname: req.originalUrl,
  });

  req.session.originalUrl = originalUrl;

  // if (!managerInfo || !managerInfo.managerId) {
  //   res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
  // } else {
  //   next();
  // }

  req.session.manager = {
    managerId: 1,
    account: 'root',
    type: 1,
  };
};

// 中间件：判断是否属于超级管理员 目前只有超级管理员可以添加后台账号
exports.isSuperManager = (req, res, next) => {
  const managerInfo = req.session.managerInfo || {};

  if (!managerInfo || !managerInfo.managerId) {
    res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
    return;
  }

  if (parseInt(managerInfo.type, 0) !== 1) {
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
    httpUtil.sendJson(500, '参数不能为空');
    return;
  }

  password = md5.update(password).digest('hex');
  Model.Manager.findOne({ where: { account } }).then((managerInfo) => {
    if (!managerInfo.dataValues || password !== managerInfo.dataValues.password) {
      httpUtil.sendJson(500, '账户或者密码错误');
      return;
    }

    req.session.manager = {
      managerId: managerInfo.dataValues.managerId,
      account,
      type: managerInfo.dataValues.type,
    };

    res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}/index`);
  }).catch((err) => {
    console.log(err);
    httpUtil.sendJson(500, '系统错误');
  });
};

// 请求注册
exports.register = (req, res) => {
  const account = req.body.account || '';
  let password = req.body.password || '';
  const type = parseInt(req.body.type, 0) || 2;
  const httpUtil = new HttpUtil(req, res);

  if (!password || !account) {
    httpUtil.sendJson(500, '参数不能为空');
    return;
  }

  password = md5.update(password).digest('hex');
  Model.Manager.create({ account, password, type }).then((managerInfo) => {
    if (!managerInfo.dataValues) {
      httpUtil.sendJson(500, '账户注册失败');
      return;
    }
    httpUtil.sendJson(200, '账户注册成功');
  }).catch((err) => {
    console.log(err);
    httpUtil.sendJson(500, '系统错误');
  });
};

// 获取七牛云的上传凭证
exports.getQiNiuToken = (req, res) => {
  const mac = new qiniu.auth.digest.Mac(config.qiNiuConfig.accessKey, config.qiNiuConfig.secretKey);
  const options = {
    scope: config.qiNiuConfig.bucket,
    returnBody: `{"key":"$(key)"$(key)","hash":"$(etag)","state":"SUCCESS","url":"${config.qiNiuConfig.showLink}/$(key)","title":"$(key)","original":"$(key)"}`,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  res.end(uploadToken);
};

