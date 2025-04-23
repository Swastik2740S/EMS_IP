const db = require('../models');

exports.createSalary = async (req, res) => {
  try {
    const { employee_id, amount, effective_from, effective_to } = req.body;
    const salary = await db.Salary.create({ employee_id, amount, effective_from, effective_to });
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await db.Salary.findAll({
      include: [{ model: db.Employee, attributes: ['firstName', 'lastName'] }]
    });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalaryById = async (req, res) => {
  try {
    const salary = await db.Salary.findByPk(req.params.id, {
      include: [db.Employee]
    });
    if (!salary) return res.status(404).json({ error: 'Salary record not found' });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const [updated] = await db.Salary.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Salary record not found' });
    const updatedSalary = await db.Salary.findByPk(req.params.id);
    res.json(updatedSalary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const deleted = await db.Salary.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Salary record not found' });
    res.json({ message: 'Salary record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
