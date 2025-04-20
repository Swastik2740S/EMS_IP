module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT
    }, {
      tableName: 'departments',
      timestamps: true
    });
    return Department;
  };
  