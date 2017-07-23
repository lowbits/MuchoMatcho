/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movies_genres', {
    movie_movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'movielens_id'
      }
    },
    genre_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'genres',
        key: 'id'
      }
    }
  }, {
    tableName: 'movies_genres'
  });
};
