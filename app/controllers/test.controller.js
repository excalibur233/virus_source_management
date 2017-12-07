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
      const lists = await Model.SelfTest.findAndCountAll({
        where: {},
        limit,
        offset: (page - 1) * limit,
        include: ['News'],
      });
      lists.currentPage = page;
      lists.limit = limit;
      lists.titles = '自测题列表';
      res.render('test/index', lists);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};

// 编辑/添加自测题视图页面
exports.edit = (req, res, next) => {
  // console.log(req.params);
  const testId = req.params.testId || 0;
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
      if (testId) {
        const data = await Model.SelfTest.findOne({
          where: {
            testId,
          },
        });
        list.titles = '编辑自测题';
        list.data = data.dataValues;
      } else {
        list.titles = '添加自测题';
        list.data = {};
      }
      // console.log(list);
      res.render('test/edit', list);
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
  const testId = req.body.testId || 0;
  const question = req.body.question || '';
  const order = req.body.order || '';
  const imgUrl = req.body.imgUrl || '';
  let arrOptions = req.body.options || '';
  let arrScores = req.body.scores || '';
  const type = req.body.type || 0;
  const httpUtil = new HttpUtil(req, res);
  // console.log(req.body);
  if (!newsId || !question || !order/* || !imgUrl */ || !arrOptions || !arrScores || !type) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
    return;
  }
  if (typeof arrOptions === 'string') {
    arrOptions = [arrOptions];
    arrScores = [arrScores];
  }
  const objOptions = {};
  const objScores = {};
  // 将数组转换为对象
  arrOptions.forEach((elem, index) => {
    // console.log(elem, index);
    objOptions[index + 1] = elem;
    objScores[index + 1] = arrScores[index];
  });
  // console.log(JSON.stringify(objOptions));
  // console.log(objScores);
  const options = JSON.stringify(objOptions);
  const scores = JSON.stringify(objScores);
  const mainFunction = async () => {
    try {
      // 新增/编辑自测题
      if (testId) {
        const affectedRow = await Model.SelfTest.update({
          newsId,
          order,
          type,
          imgUrl,
          question,
          options,
          scores,
        }, { where: { testId } });
        // console.log(affectedRow);
        if (affectedRow[0] === false) {
          httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
        } else {
          httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功', {
            testInfo: {
              order,
              type,
              imgUrl,
              question,
              options,
              scores,
              testId,
              newsId,
            },
          });
        }
      } else {
        const selfTestInfo = await Model.SelfTest.create({
          newsId,
          order,
          type,
          imgUrl,
          question,
          options,
          scores,
        });
        if (!selfTestInfo.dataValues || !selfTestInfo.dataValues.testId) {
          httpUtil.sendJson(constants.HTTP_FAIL, '新增失败');
        } else {
          httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功', { testInfo: selfTestInfo.dataValues });
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
