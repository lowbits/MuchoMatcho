/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('label', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    factor_index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    matching_input: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    guesses: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'label'
  });
};
