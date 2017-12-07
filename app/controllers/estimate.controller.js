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
      const lists = await Model.SelfTestEstimate.findAndCountAll({
        where: {},
        limit,
        offset: (page - 1) * limit,
        include: ['News'],
      });
      lists.currentPage = page;
      lists.limit = limit;
      lists.titles = '自测评估列表';
      // console.log(lists);
      res.render('estimate/index', lists);
    } catch (err) {
      // console.log(err);
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};

// 编辑/添加自测题视图页面
exports.edit = (req, res, next) => {
  // console.log(req.params);
  const estimateId = req.params.estimateId || 0;
  const list = {};

  // list.news = news.dataValues;
  // console.log(list);
  const mainFunction = async () => {
    try {
      // 查询自测文章列表
      const news = await Model.News.findAll({
        attributes: ['newsId', 'title'],
        where: {
          type: 2,
          newsClass: 4,
        },
      });
      list.news = news;
      if (estimateId) {
        const data = await Model.SelfTestEstimate.findOne({
          where: {
            estimateId,
          },
        });
        list.titles = '编辑';
        list.data = data.dataValues;
      } else {
        list.titles = '添加';
        list.data = {};
      }
      // console.log(list);
      res.render('estimate/edit', list);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};

// 编辑/新增自测题
exports.save = (req, res) => {
  const newsId = req.body.newsId || 0;
  const estimateId = req.body.estimateId || 0;
  const minScore = req.body.minScore || 0;
  const maxScore = req.body.maxScore || 0;
  const estimate = req.body.estimate || '';
  const shareContext = req.body.shareContext || '';
  const recommendContext = req.body.recommendContext || '';
  const httpUtil = new HttpUtil(req, res);
  // console.log(req.body);
  if (!newsId || !maxScore || !estimate || !shareContext) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
    return;
  }
  const mainFunction = async () => {
    try {
      // 新增/编辑自测题
      if (estimateId) {
        const affectedRow = await Model.SelfTestEstimate.update({
          newsId,
          minScore,
          maxScore,
          estimate,
          shareContext,
          recommendContext,
        }, { where: { estimateId } });
        // console.log(affectedRow);
        if (affectedRow[0] === false) {
          httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
        } else {
          httpUtil.sendJson(constants.HTTP_SUCCESS, '修改成功');
        }
      } else {
        const selfTestInfo = await Model.SelfTestEstimate.create({
          newsId,
          minScore,
          maxScore,
          estimate,
          shareContext,
          recommendContext,
        });
        if (!selfTestInfo.dataValues || !selfTestInfo.dataValues.estimateId) {
          httpUtil.sendJson(constants.HTTP_FAIL, '新增失败');
        } else {
          httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功');
        }
      }
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    }
  };
  mainFunction();
};

// 删除
exports.del = (req, res) => {
  const estimateId = req.params.estimateId || 0;
  const httpUtil = new HttpUtil(req, res);

  const mainFunction = async () => {
    try {
      const affectedRows = await Model.SelfTestEstimate.destroy({ where: { estimateId } });
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
