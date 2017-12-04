module.exports = function (sequelize, DataTypes) {
  const SelfTestEstimate = sequelize.define('SelfTestEstimate', {
    // 主键
    estimateId: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 对应的资讯id
    newsId: { type: DataTypes.BIGINT, allowNull: false },
    // 分数段 最小值
    minScore: { type: DataTypes.INTEGER, allowNull: false },
    // 分数段 最大值
    maxScore: { type: DataTypes.INTEGER },
    // 评价结果 为了防止不同自测题给出的结果展示图不一样  这里采用富文本的方式
    estimate: { type: DataTypes.TEXT },
    // 分享文案
    shareContext: { type: DataTypes.TEXT },
    // 相关推荐
    recommendContext: { type: DataTypes.TEXT },
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'self_test_estimate',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  SelfTestEstimate.associate = (models) => { SelfTestEstimate.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'newsId' }); };

  return SelfTestEstimate;
};
