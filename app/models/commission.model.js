module.exports = function (sequelize, DataTypes) {
  const Commission = sequelize.define('Commission', {
    // 主键
    recordId: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 分享（获利）用户id
    shareId: { type: DataTypes.STRING, allowNull: false },
    // 操作编号   1：成交订单获利 2：提现 3：积分兑换 4.订单取消，取消返利
    operator: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // 操作状态   0: 待处理  1: 已完成
    operatorResult: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // 本次变动金额
    changeNum: { type: DataTypes.FLOAT, allowNull: false },
    // 当前佣金总额
    totalCommission: { type: DataTypes.FLOAT, allowNull: false },

    // 传播引流（购买）用户的id
    viewerId: { type: DataTypes.STRING },
    // 成交订单编号
    orderId: { type: DataTypes.STRING, unique: true },

    // 手机号(仅提现时有用)
    phone: { type: DataTypes.STRING(11), validate: { len: 11, is: /^1[3578]\d{9}$/ } },
    // 提现时的支付宝账号
    aliPayAccount: { type: DataTypes.STRING },
    // 支付宝账号名称
    aliPayAccountName: { type: DataTypes.STRING },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'commission',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Commission.associate = (models) => {
    Commission.belongsTo(models.User, { as: 'Share', foreignKey: 'shareId', targetKey: 'userId' });
  };

  return Commission;
};
