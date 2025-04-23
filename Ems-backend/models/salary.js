module.exports = (sequelize, DataTypes) => {
    const Salary = sequelize.define('Salary', {
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      effective_from: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      effective_to: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    }, {
      tableName: 'salaries',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    Salary.associate = models => {
      Salary.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    };
  
    return Salary;
  };
  