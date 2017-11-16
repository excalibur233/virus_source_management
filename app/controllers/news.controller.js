const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const Model = require('../models/index');
const redisClient = require('../../config/redis')();
const redisUtil = require('../utils/redis.util');
const logger = require('../utils/log.util').getLogger('errLogger');

const qryNewsList = async (page = 1, limit = constants.NEWS_PAGE_LIMIT, condition = {}) => {
  const rtnList = {
    newsList: [],
    totalPage: 1,
    currentPage: page,
    limit,
  };

  try {
    const conditions = {
      attributes: ['newsId', 'writerName', 'type', 'newsClass', 'title', 'introduction'],
      offset: (page - 1) * limit,
      limit,
      order: ['createdAt', 'DESC'],
    };

    if (condition.newsClass) {
      conditions.where.newsClass = condition.newsClass;
    }
    if (condition.type) {
      conditions.where.type = condition.type;
    }
    if (condition.title) {
      conditions.where.title = { $like: `%${condition.title}%` };
    }
    if (condition.writerName) {
      conditions.where.writerName = { $like: `%${condition.writerName}%` };
    }
    const newsList = await Model.News.findAndCountAll(conditions);

    const totalPage = newsList.count;
    if (!newsList.dataValues || totalPage === 0) {
      return rtnList;
    }

    rtnList.newsList = newsList.dataValues;
    rtnList.totalPage = totalPage;
    return rtnList;
  } catch (err) {
    logger.info(err);
    return rtnList;
  }
};

// 显示所有新闻列表
exports.index = (req, res, next) => {
  const mainFunction = async () => {
    try {
      const datas = await qryNewsList();
      res.render('index', datas);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };

  mainFunction();
};

// 按照条件模糊查询新闻
exports.findNewsList = (req, res) => {
  const httpUtil = new HttpUtil(req, res);
  const page = req.query.page || 1;
  const newsClass = req.query.newsClass || 0;
  const type = req.query.type || 0;
  const title = req.query.title || '';
  const writerName = req.query.writerName || '';

  const mainFunction = async () => {
    try {
      const conditionList = {};
      if (newsClass) {
        conditionList.newsClass = newsClass;
      }
      if (type) {
        conditionList.type = type;
      }
      if (title) {
        conditionList.title = title;
      }
      if (writerName) {
        conditionList.writerName = writerName;
      }
      const datas = await qryNewsList(page, constants.NEWS_PAGE_LIMIT, conditionList);
      httpUtil.sendJson(constants.HTTP_SUCCESS, '', datas);
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL);
    }
  };

  mainFunction();
};

// 查询文章的详细信息
exports.qryNewsDetails = (req, res, next) => {
  const newsId = req.params.newsId || 0;

  const mainFunction = async () => {
    try {
      const newsInfo = Model.News.findOne({ where: { newsId } });
      if (!newsInfo.dataValues) {
        throw new Error('文章不存在！');
      }

      res.render('index', newsInfo.dataValues);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};

// 查询自测题目的详细信息（ 目前自测题没用）
// exports.qryTestDetails = (req, res, next) => {
//   const newsId = req.params.testId || 0;
//
//   const mainFunction = async () => {
//     try {
//       // 检查newsId是否正确
//       const newsInfo = await Model.News.findOne({ where: { newsId } });
//       if (!newsInfo || !newsInfo.dataValues) {
//         throw new Error('自测题不存在！');
//       }
//
//       // 查询自测题题目
//       const questionLists = await Model.SelfTest.findAll({
//         where: { newsId },
//         order: ['order', 'ASC'],
//       });
//       if (!questionLists.length) {
//         throw new Error('自测题题目缺失');
//       }
//
//       const questLists = [];
//       for (const questionInfo of questionLists) {
//         questLists.push({
//           order: questionInfo.dataValues.order,
//           newsId: questionInfo.dataValues.newsId,
//           testId: questionInfo.dataValues.testId,
//           imgUrl: questionInfo.dataValues.imgUrl,
//           question: questionInfo.dataValues.question,
//           options: JSON.parse(questionInfo.dataValues.options),
//         });
//       }
//
//       res.render('index', { questLists, testId: newsId });
//     } catch (err) {
//       logger.info(err);
//       next(err);
//     }
//   };
//   mainFunction();
// };

// 编辑/新增新闻
exports.editNews = (req, res) => {
  const newsClass = req.body.newsClass || 0;
  const type = req.body.type || 0;
  const title = req.body.title || '';
  const writerName = req.body.writerName || '';
  const introduction = req.body.introduction || '';
  const imgUrl = req.body.imgUrl || '';
  const context = req.body.context || '';
  // 非空edit 空为add
  const newsId = req.body.newsId || 0;
  const httpUtil = new HttpUtil(req, res);

  if (!newsClass || !title || !writerName || !introduction || !context || !imgUrl || !type) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
    return;
  }

  const mainFunction = async () => {
    try {
      if (newsId) {
        const affectedRow = await Model.News.update({
          writerName,
          type,
          newsClass,
          title,
          introduction,
          imgUrl,
          context,
        }, { where: { newsId } });
        if (affectedRow === 1) {
          httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功', {
            newsInfo: {
              newsId,
              writerName,
              type,
              newsClass,
              title,
              introduction,
              imgUrl,
              context,
            },
          });
        } else {
          httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
        }
      } else {
        const newsInfo = await Model.News.create({
          writerName,
          type,
          newsClass,
          title,
          introduction,
          imgUrl,
          context,
        });
        if (newsInfo.dataValues && newsInfo.dataValues.newsId) {
          // 加入热门排行榜和热门分类排行榜
          // 按照加入的时间顺序排序
          const timestamp = `0.${new Date().getTime()}`;
          const rankKey = redisUtil.getRedisPrefix(2);
          const rankTypeKey = redisUtil.getRedisPrefix(2, type);
          await redisClient.multi()
            .zadd(rankKey, timestamp, newsInfo.dataValues.newsId)
            .zadd(rankTypeKey, timestamp, newsInfo.dataValues.newsId)
            .execAsync();

          httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功', { newsInfo: newsInfo.dataValues });
        } else {
          httpUtil.sendJson(constants.HTTP_FAIL, '新增失败');
        }
      }
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    }
  };
  mainFunction();
};

// 编辑/新增自测题 （ 目前自测题没用）
// exports.editTests = (req, res) => {
//   const newsId = req.body.newsId || 0;
//   const testId = req.body.testId || 0;
//   const question = req.body.question || '';
//   const order = req.body.order || '';
//   const imgUrl = req.body.imgUrl || '';
//   const options = req.body.options || '';
//   const scores = req.body.scores || '';
//   const type = req.body.type || 0;
//   const httpUtil = new HttpUtil(req, res);
//
//   if (!newsId || !question || !order || !imgUrl || !options || !scores || !type) {
//     httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
//     return;
//   }
//
//   const mainFunction = async () => {
//     try {
//       // 新增/编辑自测题
//       if (testId) {
//         const affectedRow = await Model.SelfTest.update({
//           order,
//           type,
//           imgUrl,
//           question,
//           options,
//           scores,
//         }, { where: { testId, newsId } });
//         if (affectedRow !== 1) {
//           httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
//         } else {
//           httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功', {
//             testInfo: {
//               order,
//               type,
//               imgUrl,
//               question,
//               options,
//               scores,
//               testId,
//               newsId,
//             },
//           });
//         }
//       } else {
//         const selfTestInfo = await Model.SelfTest.create({
//           newsId,
//           order,
//           type,
//           imgUrl,
//           question,
//           options,
//           scores,
//         });
//         if (!selfTestInfo.dataValues || !selfTestInfo.dataValues.testId) {
//           httpUtil.sendJson(constants.HTTP_FAIL, '新增失败');
//         } else {
//           httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功', { testInfo: selfTestInfo.dataValues });
//         }
//       }
//     } catch (err) {
//       logger.info(err);
//       httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
//     }
//   };
//   mainFunction();
// };

// 删除新闻
exports.delNews = (req, res) => {
  const newsId = req.body.newsId || 0;
  const httpUtil = new HttpUtil(req, res);

  const mainFunction = async () => {
    try {
      const newsInfo = await Model.News.findOne({ where: newsId });
      if (newsInfo.dataValues) {
        const type = parseInt(newsInfo.dataValues.type, 0);

        // 删除热门排行榜和热门分类排行榜
        const rankKey = redisUtil.getRedisPrefix(2);
        const rankTypeKey = redisUtil.getRedisPrefix(2, type);

        if (type === 1) {
          // 普通资讯文章
          const affectedRows = await Model.News.destroy({ where: newsId });
          if (affectedRows > 0) {
            const resData = await redisClient.multi()
              .zrem(rankKey, newsId)
              .zrem(rankTypeKey, newsId)
              .execAsync();
            if (res.length === 2) {
              resData.sendJson(constants.HTTP_SUCCESS, '删除成功');
            } else {
              logger.info(resData);
              httpUtil.sendJson(constants.HTTP_FAIL, '删除redis失败');
            }
          } else {
            httpUtil.sendJson(constants.HTTP_FAIL, '删除失败');
          }
        } else {
          // 自测题 cascade delete
          Model.sequelize.transaction(async (transaction) => {
            await Model.News.destroy({ where: newsId }, { transaction });
            await Model.SelfTest.destroy({ where: newsId }, { transaction });
          }).then(async () => {
            const result = await redisClient.multi()
              .zrem(rankKey, newsId)
              .zrem(rankTypeKey, newsId)
              .execAsync();
            if (result.length === 2) {
              httpUtil.sendJson(constants.HTTP_SUCCESS, '删除成功');
            } else {
              logger.info(result);
              httpUtil.sendJson(constants.HTTP_FAIL, '删除redis失败');
            }
          }).catch((err) => {
            // Rolled back
            httpUtil.sendJson(constants.HTTP_FAIL, '删除失败');
            logger.info(err);
          });
        }
      } else {
        httpUtil.sendJson(constants.HTTP_SUCCESS, '该文章不存在！');
      }
    } catch (err) {
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
      logger.info(err);
    }
  };
  mainFunction();
};

