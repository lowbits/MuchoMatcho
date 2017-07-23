/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var item_factor_values = sequelize.define('item_factor_values', {
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

  item_factor_values.associate = function (models) {
        item_factor_values.belongsTo(models.movies, {foreignKey: 'item_id', targetKey: 'movielens_id'});
};
item_factor_values.removeAttribute('id');

return item_factor_values;
};
