const db = require('../models');

exports.getAdminDashboard = async (req, res) => {
  try {
    const [totalEmployees, departments, presentToday, pendingLeaves] = await Promise.all([
      db.Employee.count(),
      db.Department.findAll({
        include: [{ model: db.Employee, attributes: ['id'] }]
      }),
      db.Attendance.count({
        where: { date: new Date().toISOString().split('T')[0] }
      }),
      db.LeaveRequest.count({ where: { status: 'pending' } })
    ]);

    const departmentData = departments.map(d => ({
      name: d.name,
      employees: d.Employees.length
    }));

    res.json({
      totalEmployees,
      presentToday,
      pendingLeaves,
      departmentData,
      leaveStatus: [
        { name: 'Approved', value: await db.LeaveRequest.count({ where: { status: 'approved' } }) },
        { name: 'Pending', value: pendingLeaves },
        { name: 'Rejected', value: await db.LeaveRequest.count({ where: { status: 'rejected' } }) }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await db.Employee.findOne({
      where: { UserId: req.user.id },
      include: [
        { model: db.Attendance, limit: 30, order: [['date', 'DESC']] },
        { model: db.LeaveRequest }
      ]
    });

    const attendanceData = employee.Attendances.map(a => ({
      date: a.date,
      hours: a.check_out ? 
        (new Date(`1970-01-01T${a.check_out}`) - new Date(`1970-01-01T${a.check_in}`)) / 3600000 : 0
    }));

    res.json({
      attendance: attendanceData,
      totalLeaves: employee.LeaveRequests.length,
      upcomingLeaves: employee.LeaveRequests.filter(l => 
        new Date(l.start_date) > new Date()
      ).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
