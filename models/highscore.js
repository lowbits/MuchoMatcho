/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('highscore', {
    Round: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Points: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Usernames: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'highscore'
  });
};
