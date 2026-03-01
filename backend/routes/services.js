const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const serviceCtrl = require('../controllers/serviceController');

router.get('/', serviceCtrl.getServices);
router.post('/', auth, serviceCtrl.createService);
router.put('/:id', auth, serviceCtrl.updateService);
router.delete('/:id', auth, serviceCtrl.deleteService);

module.exports = router;
