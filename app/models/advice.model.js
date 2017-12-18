module.exports = function (sequelize, DataTypes) {
  const Advice = sequelize.define('Advice', {
    // 用户id
    userId: { type: DataTypes.STRING, allowNull: false },
    // 操作状态   0: 待处理  1: 已处理
    operatorResult: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    // 建议内容
    advice: { type: DataTypes.TEXT, allowNull: false },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'advice',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Advice.associate = (models) => { Advice.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'userId' }); };

  return Advice;
};
