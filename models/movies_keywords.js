/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movies_keywords', {
    movie_movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'movielens_id'
      }
    },
    keyword_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'keywords',
        key: 'id'
      }
    }
  }, {
    tableName: 'movies_keywords'
  });
};
