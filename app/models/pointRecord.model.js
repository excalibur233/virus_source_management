module.exports = function (sequelize, DataTypes) {
  const PointRecord = sequelize.define('PointRecord', {
    // 主键
    recordId: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 操作人id
    viewerId: { type: DataTypes.STRING },
    // 可能值：operator = 1：分享上级uid，没有则为NULL ；operator = 2：分享下级uid
    shareId: { type: DataTypes.STRING },
    // 操作编号 ：
    // 1.自己浏览 2.下级浏览 3.自己转发 4.下级转发 5.后台提取, 6.原创作者被阅读后奖励，7.原创作者被转发后奖励
    operator: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // 操作状态   0: 待处理  1: 已完成
    operatorResult: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // 本次变动积分
    changeNum: { type: DataTypes.FLOAT, allowNull: false },
    // 当前总积分
    totalPoint: { type: DataTypes.FLOAT, allowNull: false },
    // 对应的资讯id
    newsId: { type: DataTypes.BIGINT },
    // 凭据id 用于追溯这笔积分变动的依据
    // 当操作编号为1、2、6时，存储pvNews表的记录id
    // 当操作编号为3、4、7时，存储transmitNews表的记录id
    // 当操作编号为5时，存储0
    proofId: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'point_record_log',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  PointRecord.associate = (models) => {
    PointRecord.belongsTo(models.User, { as: 'Share', foreignKey: 'shareId', targetKey: 'userId' });
    PointRecord.belongsTo(models.User, { as: 'Viewer', foreignKey: 'viewerId', targetKey: 'userId' });
    PointRecord.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'newsId' });
  };

  return PointRecord;
};
