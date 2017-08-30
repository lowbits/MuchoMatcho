/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collected_data', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    guess: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    guess_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    matching_guess: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    matching_time: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    already_matched: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    factor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    movie_1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    movie_2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    movie_3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    skipped: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    skip_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'collected_data'
  });
};
