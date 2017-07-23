/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('testbez', {
    factor_index: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Bezeichnung: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'testbez'
  });
};
