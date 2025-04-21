const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getAllCategories, getCategory, createCategory, updateCategory, deleteCategory
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', auth, roleCheck('admin'), createCategory);
router.put('/:id', auth, roleCheck('admin'), updateCategory);
router.delete('/:id', auth, roleCheck('admin'), deleteCategory);

module.exports = router;
