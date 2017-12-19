module.exports = function (sequelize, DataTypes) {
  const SelfTestRecord = sequelize.define('SelfTestRecord', {
    // 主键
    recordId: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 用户信息
    userId: { type: DataTypes.STRING, allowNull: false },
    userName: { type: DataTypes.STRING },
    headImg: { type: DataTypes.STRING },

    // 用户选项
    options: { type: DataTypes.STRING, allowNull: false },

    // 分数
    totalScore: { type: DataTypes.INTEGER, allowNull: false },

    // 评价id
    estimateId: { type: DataTypes.BIGINT },
    // 评价内容
    estimate: { type: DataTypes.TEXT },

    // 自测题id
    newsId: { type: DataTypes.BIGINT, allowNull: false },
    // 自测题标题
    title: { type: DataTypes.STRING },
    // 自测题所属类别id
    newsClass: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'self_test_log',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  SelfTestRecord.associate = (models) => {
    SelfTestRecord.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'newsId' });
    SelfTestRecord.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'userId' });
  };

  return SelfTestRecord;
};
