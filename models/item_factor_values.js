/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item_factor_values', {
    factor_index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    value: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    tableName: 'item_factor_values'
  });
};
