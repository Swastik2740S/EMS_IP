const db = require('../models');

exports.createRole = async (req, res) => {
  try {
    const role = await db.Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const [updated] = await db.Role.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedRole = await db.Role.findByPk(req.params.id);
      res.json(updatedRole);
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const deleted = await db.Role.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Role deleted successfully' });
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
