module.exports = function (sequelize, DataTypes) {
  const JobTitle = sequelize.define('JobTitle', {
    // 职称id
    id: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 职称
    title: { type: DataTypes.STRING },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'job_title',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return JobTitle;
};
