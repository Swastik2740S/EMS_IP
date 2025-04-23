const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Employee = require('./employee')(sequelize, Sequelize);
db.Department = require('./department')(sequelize, Sequelize);
db.Role = require('./role')(sequelize, Sequelize);
db.Attendance = require('./attendance')(sequelize, Sequelize.DataTypes);
db.LeaveRequest = require('./leaveRequest')(sequelize, Sequelize.DataTypes);
db.Salary = require('./salary')(sequelize, Sequelize.DataTypes);

// Define relationships
db.Department.hasMany(db.Employee);
db.Employee.belongsTo(db.Department);

db.Role.hasMany(db.Employee);
db.Employee.belongsTo(db.Role);

db.User.hasOne(db.Employee);
db.Employee.belongsTo(db.User);


// Associations
db.Employee.hasMany(db.Attendance, { foreignKey: 'employee_id' });
db.Attendance.belongsTo(db.Employee, { foreignKey: 'employee_id' });

db.Employee.hasMany(db.LeaveRequest, { foreignKey: 'employee_id' });
db.LeaveRequest.belongsTo(db.Employee, { foreignKey: 'employee_id' });

db.Employee.hasMany(db.Salary, { foreignKey: 'employee_id' });
db.Salary.belongsTo(db.Employee, { foreignKey: 'employee_id' });

module.exports = db;
