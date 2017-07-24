/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var movies_directors = sequelize.define('movies_directors', {
    movie_movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'movielens_id'
      }
    },
    director_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'directors',
        key: 'id'
      }
    }
  }, {
    tableName: 'movies_directors'
  });

  movies_directors.removeAttribute('id');

  return movies_directors;

};
