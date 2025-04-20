const db = require('../models');

exports.createEmployee = async (req, res) => {
  try {
    const employee = await db.Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await db.Employee.findAll({
      include: [db.User, db.Department, db.Role]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await db.Employee.findByPk(req.params.id, {
      include: [db.User, db.Department, db.Role]
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const [updated] = await db.Employee.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedEmployee = await db.Employee.findByPk(req.params.id);
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await db.Employee.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
