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
      const lists = await Model.Commission.findAndCountAll({
        attributes: ['recordId', 'shareId', 'operator', 'operatorResult', 'changeNum', 'phone', 'aliPayAccount', 'aliPayAccountName', 'createdAt'],
        where: { operator: 2 },
        limit,
        offset: (page - 1) * limit,
        include: ['Share'],
      });
      // console.log(lists);
      lists.currentPage = page;
      lists.limit = limit;
      lists.titles = '提现管理';
      res.render('commission', lists);
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
  (async () => {
    try {
      tepArr.forEach((item) => {
        Model.Commission.update({
          operatorResult: 1,
        }, { where: { recordId: item } });
      });
      httpUtil.sendJson(constants.HTTP_SUCCESS, '修改成功');
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    }
  })();
};

