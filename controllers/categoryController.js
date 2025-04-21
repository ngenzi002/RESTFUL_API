const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const categories = await Category.find()
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(categories);
};
