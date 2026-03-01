const ServiceCategory = require('../models/ServiceCategory');

exports.getServices = async (req, res) => {
  try {
    const services = await ServiceCategory.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = new ServiceCategory(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ServiceCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceCategory.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
