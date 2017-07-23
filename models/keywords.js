/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('keywords', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tmdb_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'keywords'
  });
};
