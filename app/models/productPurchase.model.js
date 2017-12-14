module.exports = function (sequelize, DataTypes) {
  const ProductPurchase = sequelize.define('ProductPurchase', {
    // 主键
    id: {
      type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true,
    },
    // 分享（获利）用户id
    shareId: { type: DataTypes.STRING, allowNull: false },
    // 传播引流（购买）用户的id
    viewerId: { type: DataTypes.STRING },
    // 成交订单编号
    orderId: { type: DataTypes.STRING, allowNull: false },
    // 成交商品id
    productId: { type: DataTypes.STRING, allowNull: false },
    // 商品所属类别
    categoryId: { type: DataTypes.STRING, allowNull: false },
    // 成交商品名称
    productName: { type: DataTypes.STRING, allowNull: false },
    // 成交商品数量
    num: { type: DataTypes.STRING, allowNull: false },
    // 成交商品价格
    price: { type: DataTypes.FLOAT, allowNull: false },
    // 商品返利佣金总数
    commission: { type: DataTypes.FLOAT, allowNull: false },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'product_purchase_log',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  ProductPurchase.associate = (models) => {
    ProductPurchase.belongsTo(models.User, { as: 'Share', foreignKey: 'shareId', targetKey: 'userId' });
  };

  return ProductPurchase;
};
