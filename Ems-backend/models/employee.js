module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      hireDate: DataTypes.DATE,
      phone: DataTypes.STRING
    });
    return Employee;
  };
  