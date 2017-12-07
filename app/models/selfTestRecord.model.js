module.exports = function (sequenlize, dataType) {
  const record = sequenlize.define('selfTestRecord', {
    recordId: {
      type: dataType.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: dataType.BIGINT,
      allowNull: false,
    },
    userName: {
      type: dataType.STRING,
      allowNull: false,
    },
    headImg: {
      type: dataType.STRING,
      allowNull: false,
    },
    totalScore: {
      type: dataType.INTEGER,
      defaultValue: 0,
    },
    estimateId: {
      type: dataType.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    estimate: {
      type: dataType.TEXT,
    },
    newsId: {
      type: dataType.BIGINT,
      allowNum: false,
    },
    title: {
      type: dataType.STRING,
      allowNum: false,
    },
    newsClass: {
      type: dataType.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: dataType.DATE,
    },
    updatedAt: {
      type: dataType.DATE,
    },
    deletedAt: {
      type: dataType.DATE,
    },

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'self_test_record',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return record;
};
