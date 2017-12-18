const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const Model = require('../models/index');
const logger = require('../utils/log.util').getLogger('errLogger');


// 自测题列表
exports.index = (req, res, next) => {
  const mainFunction = async () => {
    try {
      const page = req.query.page || 1;
      const limit = constants.NEWS_PAGE_LIMIT;
      const lists = await Model.Advice.findAndCountAll({
        where: {},
        limit,
        offset: (page - 1) * limit,
        include: ['User'],
      });
      lists.currentPage = page;
      lists.limit = limit;
      lists.titles = '建议与反馈';
      res.render('advice', lists);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};

// 修改状态
exports.edit = (req, res) => {
  const ids = req.query;
  // console.log(ids.id);
  const httpUtil = new HttpUtil(req, res);
  // console.log(req.body);
  if (!ids) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
    return;
  }
  const queryId = JSON.parse(ids.id);
  let tepArr;
  if (typeof queryId === 'number') {
    tepArr = [queryId];
  } else {
    tepArr = queryId;
  }
  // console.log(tepArr);
  const mainFunction = async () => {
    try {
      tepArr.forEach((item) => {
        Model.Advice.update({
          operatorResult: 1,
        }, { where: { id: item } });
      });
      httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功');
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    }
  };
  mainFunction();
};

// 删除
exports.del = (req, res) => {
  const testId = req.params.testId || 0;
  const httpUtil = new HttpUtil(req, res);

  const mainFunction = async () => {
    try {
      const affectedRows = await Model.SelfTest.destroy({ where: { testId }, force: false });
      // console.log(affectedRows);
      if (affectedRows > 0) {
        httpUtil.sendJson(constants.HTTP_SUCCESS, '删除成功');
      } else {
        httpUtil.sendJson(constants.HTTP_FAIL, '删除失败');
      }
    } catch (err) {
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
      logger.info(err);
      // console.log(err);
    }
  };
  mainFunction();
};
