/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movies_cast', {
    actor_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'actors',
        key: 'id'
      }
    },
    importance: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    movie_movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'movies',
        key: 'movielens_id'
      }
    },
    character_name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'movies_cast'
  });
};
