/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movies_info', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    actor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    character_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    original_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title_de: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    importance: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'movies_info'
  });
};
