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
    classMethods: {
      associate: function(models) {
        item_factor_values.belongsTo(models.movies, {foreignKey: 'movielens_id'});
      }
    },
    tableName: 'item_factor_values'
  });
};
