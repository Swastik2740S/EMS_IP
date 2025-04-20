const db = require('../models');

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const department = await db.Department.create({ name, description });
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll({
      order: [['name', 'ASC']]
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await db.Department.findByPk(req.params.id, {
      include: [{
        model: db.Employee,
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.Department.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const updatedDepartment = await db.Department.findByPk(id);
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.Department.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
