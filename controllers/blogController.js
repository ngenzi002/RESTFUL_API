const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

exports.getAllBlogs = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ],
  };
  const blogs = await Blog.find(query)
    .populate('author', 'username')
    .populate('category', 'name')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(blogs);
};

exports.getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'username')
    .populate('category', 'name')
    .populate('comments');
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
};

exports.createBlog = async (req, res) => {
  const { title, content, category, image } = req.body;
  const blog = new Blog({ title, content, category, image, author: req.user.id });
  await blog.save();
  res.status(201).json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  const comment = new Comment({ blog: blog._id, user: req.user.id, text });
  await comment.save();
  blog.comments.push(comment._id);
  await blog.save();
  res.status(201).json(comment);
};

exports.getStats = async (req, res) => {
  const stats = await Blog.aggregate([
    { $group: { _id: '$category', total: { $sum: 1 } } },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $project: {
        _id: 0,
        category: '$categoryInfo.name',
        total: 1,
      },
    },
  ]);
  res.json(stats);
};
