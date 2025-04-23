module.exports = (sequelize, DataTypes) => {
    const LeaveRequest = sequelize.define('LeaveRequest', {
      type: {
        type: DataTypes.ENUM('sick', 'vacation', 'personal'),
        defaultValue: 'vacation'
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'leave_requests',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    LeaveRequest.associate = (models) => {
      LeaveRequest.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    };
  
    return LeaveRequest;
  };
  