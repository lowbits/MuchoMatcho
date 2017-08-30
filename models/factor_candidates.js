/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factor_candidates', {
    factor_index: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    rank: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'factor_candidates'
  });

   factor_candidates.associate = function (models) {
        factor_candidates.belongsTo(models.movies, {foreignKey: 'item_id', as: 'movie'});
};
factor_candidates.removeAttribute('id');

return factor_candidates;


};
