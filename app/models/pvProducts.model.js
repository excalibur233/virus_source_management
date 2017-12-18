module.exports = function (sequelize, DataTypes) {
  const PVProducts = sequelize.define('PVProducts', {
    // id
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true,
    },
    // 商品详细细信息
    productId: { type: DataTypes.BIGINT, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT },
    soldCount: { type: DataTypes.INTEGER },

    // 商品浏览人详细信息
    viewerId: { type: DataTypes.STRING, allowNull: false },
    viewerName: { type: DataTypes.STRING },
    viewerHeadImg: { type: DataTypes.STRING, allowNull: false },

    // 分享人详细信息 如果有
    shareId: { type: DataTypes.STRING },
    shareName: { type: DataTypes.STRING },
    shareHeadImg: { type: DataTypes.STRING },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'pv_products_log',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return PVProducts;
};
