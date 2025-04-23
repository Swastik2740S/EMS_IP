const db = require('../models');

exports.createAttendance = async (req, res) => {
  try {
    const { employee_id, date, check_in, check_out } = req.body;
    const attendance = await db.Attendance.create({
      employee_id,
      date,
      check_in,
      check_out
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendances = await db.Attendance.findAll({
      include: [{
        model: db.Employee,
        attributes: ['firstName', 'lastName']
      }]
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await db.Attendance.findByPk(req.params.id, {
      include: [db.Employee]
    });
    if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const [updated] = await db.Attendance.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Attendance record not found' });
    const updatedAttendance = await db.Attendance.findByPk(req.params.id);
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const deleted = await db.Attendance.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Attendance record not found' });
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
