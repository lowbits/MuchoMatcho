/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var actors =  sequelize.define('actors', {
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
    tableName: 'actors'
  });

   actors.associate = function (models) {
 actors.belongsToMany(models.movies, {through: 'movies_cast', foreignKey: 'actor_id'});
};

return actors;
};
