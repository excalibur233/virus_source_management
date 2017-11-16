const constants = require('../../config/constants');
// 获取redisKey  和virus_source中保持一致
exports.getRedisPrefix = (type, id = '') => {
  let redisKey = '';
  switch (type) {
    case 1:
      redisKey = `${constants.REDIS_PREFIX}|rank|thumbUp|news`; // 文章点赞总排行 rank|thumbUp|news {newsId:num}
      break;
    case 2:
      redisKey = `${constants.REDIS_PREFIX}|rank|pv|news`; // 文章浏览总排行 rank|pv|news {newsId:num}
      break;
    case 13:
      redisKey = `${constants.REDIS_PREFIX}|rank|comment|news`; // 文章评论总排行 rank|comment|news {newsId:num}
      break;
    case 3:
      redisKey = `${constants.REDIS_PREFIX}|rank|user|pv_news`; // 用户分享出的文章 浏览pv总排行 rank|user|pv_news:userId {newsId:pv_num}
      break;
    case 4:
      redisKey = `${constants.REDIS_PREFIX}|rank|user|uv_news`; // 用户分享出的文章 浏览uv总排行 rank|user|uv_news:userId {newsId:uv_num}
      break;
    case 7:
      redisKey = `${constants.REDIS_PREFIX}|rank|user|pv_products`; // 用户分享出的商品 浏览pv总排行  rank|user|pv_products:userId {productId:pv_num}
      break;
    case 8:
      redisKey = `${constants.REDIS_PREFIX}|rank|user|uv_products`; // 用户分享出的商品 浏览uv总排行 rank|user|uv_products:userId {productId:uv_num}
      break;


    case 5:
      redisKey = `${constants.REDIS_PREFIX}|data|user|pv_news`; // 用户所有分享文章的日 uv、pv记录  data|user|pv_news:userId:20171020 {viewerId:pv_num}
      break;
    case 9:
      redisKey = `${constants.REDIS_PREFIX}|data|user|pv_products`; // 用户分享所有商品日 uv、pv记录 data|user|pv_products:20171020 {viewerId:pv_num}
      break;
    case 10:
      redisKey = `${constants.REDIS_PREFIX}|data|user|purchase_record`; // 用户分享商品后，日购买记录
      break;


    case 6:
      redisKey = `${constants.REDIS_PREFIX}|data|user|commission`; // 用户佣金总额 data|user|commission {userId:num}
      break;
    case 18:
      redisKey = `${constants.REDIS_PREFIX}|data|user|bonus_points`; // 用户积分总数
      break;


    case 11:
      redisKey = `${constants.REDIS_PREFIX}|brief_rank_info|news`; // 一些排行中需要显示的精简news信息，减小mysql压力
      break;
    case 12:
      redisKey = `${constants.REDIS_PREFIX}|brief_rank_info|products`; // 一些排行中需要显示的精简product信息
      break;


    case 14:
      redisKey = `${constants.REDIS_PREFIX}|list|comment|news`; // 文章评论列表
      break;


    case 15:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|news`; // 某文章浏览人次、人数记录 log|pv|news:newsId {userId:pv_num}
      break;
    case 16:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|user|news`; // 某用户分享出的某文章浏览人次、人数记录 log|pv|user|news:newsId:uid_1:20171020 {viewerId:pv_num}
      break;
    case 17:
      redisKey = `${constants.REDIS_PREFIX}|log|thumbUp|news`; // 某文章点赞人次、人数记录
      break;
    case 19:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|products`; // 某商品浏览人次、人数记录 log|pv|products:productId {userId:pv_num}
      break;
    case 20:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|user|products`; // 某用户分享出的某商品浏览人次、人数记录 log|pv|user|products:pid:uid_1:20171020 {viewerId:pv_num}
      break;
    case 21:
      redisKey = `${constants.REDIS_PREFIX}|log|transmit|news`; // 某文章转发人次、人数记录 log|transmit|news:newsId {userId:num}
      break;
    case 22:
      redisKey = `${constants.REDIS_PREFIX}|log|transmit|user|news`; // 某用户分享出的某文章转发人次、人数 log|transmit|user|news:newsId:uid_1:20171020 {uid:_num}
      break;


    case 996:
      redisKey = `${constants.REDIS_PREFIX}|weChat|qrcode_ticket`; // wechat全局存储用户生成临时二维码的ticket
      break;
    case 997:
      redisKey = `${constants.REDIS_PREFIX}|weChat|basic_token`; // wechat全局存储获得基础信息token
      break;
    case 998:
      redisKey = `${constants.REDIS_PREFIX}|weChat|jsapi_ticket`; // wechat全局存储jsapi_ticket
      break;
    case 999:
      redisKey = `${constants.REDIS_PREFIX}|weChat|snap_token`; // wechat全局存储授权token
      break;


    case 1111:
      redisKey = 'sum|user|bonus_points'; // 所有项目的积分总数
      break;
    default:
      break;
  }

  return !id ? redisKey : `${redisKey}:${id}`;
};

