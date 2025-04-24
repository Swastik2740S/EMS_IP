const db = require('../models');

// Check-in
exports.checkIn = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find employee
    const employee = await db.Employee.findOne({ 
      where: { UserId: userId },
      transaction
    });
    
    if (!employee) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Employee not found' });
    }

    // Check existing attendance
    const existing = await db.Attendance.findOne({
      where: {
        employee_id: employee.id,
        date: currentDate
      },
      transaction
    });

    if (existing) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Create attendance record
    const attendance = await db.Attendance.create({
      employee_id: employee.id,
      date: currentDate,
      check_in: new Date().toLocaleTimeString('en-US', { hour12: false })
    }, { transaction });

    await transaction.commit();
    res.json(attendance);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Check-out
exports.checkOut = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find employee
    const employee = await db.Employee.findOne({ 
      where: { UserId: userId },
      transaction
    });
    
    if (!employee) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Employee not found' });
    }

    // Find today's attendance
    const attendance = await db.Attendance.findOne({
      where: {
        employee_id: employee.id,
        date: currentDate
      },
      transaction
    });

    if (!attendance) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Not checked in yet' });
    }

    if (attendance.check_out) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Already checked out' });
    }

    // Update check-out time
    await attendance.update({
      check_out: new Date().toLocaleTimeString('en-US', { hour12: false })
    }, { transaction });

    await transaction.commit();
    res.json(attendance);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    let whereClause = {};
    
    // For employees, only get their records
    if (req.user.role === 'employee') {
      const employee = await db.Employee.findOne({ where: { UserId: userId } });
      if (!employee) return res.status(400).json({ error: 'Employee not found' });
      whereClause.employee_id = employee.id;
    }

    const attendance = await db.Attendance.findAll({
      where: whereClause,
      include: [{
        model: db.Employee,
        attributes: ['firstName', 'lastName']
      }],
      order: [['date', 'DESC']]
    });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
