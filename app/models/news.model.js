const constants = require('../../config/constants');
module.exports = function (sequelize, DataTypes) {
  const News = sequelize.define('News', {
    // id
    newsId: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true,
    },
    // 文章作者id （如果是管理员后台编辑的文章，这里为空）
    writerId: { type: DataTypes.STRING },
    // 资讯类型 1.官方资讯；2.官方自测题；3.个人资讯;
    type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: constants.TYPE_NEWS },
    // 资讯所属类别 (eg. 糖尿病、痛风等)
    newsClass: { type: DataTypes.INTEGER, allowNull: false },
    // 资讯标题
    title: { type: DataTypes.STRING },
    // 资讯简介
    introduction: { type: DataTypes.STRING },
    // 资讯展示配图地址
    imgUrl: { type: DataTypes.STRING },
    // 资讯展详细内容
    context: { type: DataTypes.TEXT },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'news',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  News.associate = (models) => {
    News.belongsTo(models.User, { as: 'Writer', foreignKey: 'writerId', targetKey: 'userId' });
  };

  return News;
};
