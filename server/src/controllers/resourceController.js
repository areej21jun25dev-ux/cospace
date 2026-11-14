const Resource = require('../models/Resource');

const errMsg = (err) =>
  err.errors ? Object.values(err.errors)[0].message : err.message;

// GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.floor) filter.floor = Number(req.query.floor);

    const resources = await Resource.find(filter).sort({ floor: 1, name: 1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resources/:id
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: 'Invalid resource id' });
  }
};

// POST /api/resources (admin)
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: errMsg(err) });
  }
};

// PUT /api/resources/:id (admin)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: errMsg(err) });
  }
};

// DELETE /api/resources/:id (admin): soft delete
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource removed' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid resource id' });
  }
};