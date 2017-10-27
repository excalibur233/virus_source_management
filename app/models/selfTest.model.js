module.exports = function (sequelize, DataTypes) {
  const SelfTest = sequelize.define('SelfTest', {
    // 主键
    testId: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 对应的资讯id
    newsId: { type: DataTypes.BIGINT, allowNull: false },
    // 题目序号
    order: { type: DataTypes.INTEGER, allowNull: false },
    // 题目类型  1：判断题  2：选择题
    type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // 题目配图地址
    imgUrl: { type: DataTypes.STRING },
    // 题目内容
    question: { type: DataTypes.TEXT },
    // 题目选项 json string  {1:是，2:否}
    options: { type: DataTypes.TEXT },
    // 选项计分情况 json string  {1:1，2:0}  必须和options对应
    scores: { type: DataTypes.TEXT },
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'self_test',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  SelfTest.associate = (models) => { SelfTest.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'newsId' }); };

  return SelfTest;
};
