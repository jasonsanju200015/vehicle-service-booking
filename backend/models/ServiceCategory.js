const mongoose = require('mongoose');
const ServiceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});
module.exports = mongoose.model('ServiceCategory', ServiceCategorySchema);
