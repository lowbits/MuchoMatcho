/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var directors =  sequelize.define('directors', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    image_link: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'directors'
  });

  directors.associate = function (models) {
 directors.belongsToMany(models.movies, {through: 'movies_directors', foreignKey: 'director_id'});
};

return directors;
};
