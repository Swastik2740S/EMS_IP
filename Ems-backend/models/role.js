module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT,
      salaryGrade: {
        type: DataTypes.STRING,
        field: 'salaryGrade'
      }
    }, {
      tableName: 'roles',
      timestamps: true
    });
    return Role;
  };
  