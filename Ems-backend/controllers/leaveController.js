const db = require('../models');

exports.createLeaveRequest = async (req, res) => {
  try {
    // Get the user ID from the JWT token
    const userId = req.user.id;
    
    // Find the employee record for this user using db.Employee
    const employee = await db.Employee.findOne({
      where: { UserId: userId }
    });
    
    if (!employee) {
      return res.status(400).json({ error: 'No employee record found for this user' });
    }
    
    // Create leave request with db.LeaveRequest
    const leaveRequest = await db.LeaveRequest.create({
      ...req.body,
      employee_id: employee.id
    });
    
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllLeaveRequests = async (req, res) => {
  try {
    let whereClause = {};

    // If the user is an employee, only fetch their own leave requests
    if (req.user.role === 'employee') {
      const employee = await db.Employee.findOne({ where: { UserId: req.user.id } });
      if (!employee) {
        return res.status(400).json({ error: 'No employee record found for this user' });
      }
      whereClause = { employee_id: employee.id };
    }

    const leaveRequests = await db.LeaveRequest.findAll({
      where: whereClause,
      include: [{
        model: db.Employee,
        attributes: ['firstName', 'lastName']
      }]
    });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await db.LeaveRequest.findByPk(req.params.id, {
      include: [db.Employee]
    });
    if (!leaveRequest) return res.status(404).json({ error: 'Leave request not found' });
    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeaveRequest = async (req, res) => {
  try {
    const [updated] = await db.LeaveRequest.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Leave request not found' });
    const updatedLeave = await db.LeaveRequest.findByPk(req.params.id);
    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLeaveRequest = async (req, res) => {
  try {
    const deleted = await db.LeaveRequest.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Leave request not found' });
    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
