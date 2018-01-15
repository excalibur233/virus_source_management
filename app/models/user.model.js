module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    // 用户唯一id  目前直接用微信返回的unionId
    userId: {
      type: DataTypes.STRING, primaryKey: true, unique: true,
    },
    openId: { type: DataTypes.STRING },
    // 昵称
    userName: { type: DataTypes.STRING },
    sex: { type: DataTypes.INTEGER },
    province: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    headImgUrl: { type: DataTypes.STRING },
    // 电话号码
    phone: { type: DataTypes.STRING(11), validate: { len: 11, is: /^1[3578]\d{9}$/ } },
    // 备注字段
    remark: { type: DataTypes.STRING },
    // 真实姓名
    realName: { type: DataTypes.STRING },
    // 就职医院
    hospitalName: { type: DataTypes.STRING },
    // 职称
    jobTitleId: { type: DataTypes.BIGINT },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'user',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });


  User.associate = (models) => {
    User.belongsTo(models.JobTitle, { foreignKey: 'jobTitleId', targetKey: 'id' });
  };


  return User;
};
