module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      check_in: {
        type: DataTypes.TIME,
        allowNull: true
      },
      check_out: {
        type: DataTypes.TIME,
        allowNull: true
      }
    }, {
      tableName: 'attendance',
      timestamps: true, // for createdAt/updatedAt
      createdAt: 'created_at',
      updatedAt: false
    });
  
    Attendance.associate = (models) => {
      Attendance.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    };
  
    return Attendance;
  };
  