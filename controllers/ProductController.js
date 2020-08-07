const { catchAsync } = require("../libs/utils");
const AppError = require("../libs/AppError");
const Product = require("../models/Product");

/**
 * Get resources Product
 * @type {function(...[*]=)}
 */
exports.get = catchAsync(async (req, res, next) => {
  const { page, limit, ...query } = req.query;
  const skip = page && limit ? page * limit - limit : 0;

  const products = await User.find(query)
    .limit(limit ? Number(limit) : Number(process.env.DEFAULT_PER_PAGE || 15))
    .skip(skip);

  const total = await Product.countDocuments({ ...req.query });

  return res.json({
    success: true,
    entries: {
      products,
      total,
    },
  });
});

/**
 * Storing new resource Product
 * @type {function(...[*]=)}
 */
exports.store = catchAsync(async (req, res, next) => {
  const { data } = req.body;
  const product = await Product.create(data);

  return res.json({
    success: true,
    entries: {
      product,
    },
  });
});

/**
 * Get single resource Product
 * @type {function(...[*]=)}
 */
exports.show = catchAsync(async (req, res, next) => {
  const product = await Product.findById(id);

  if (!product) return next(new AppError("Item not found", 404));

  return res.json({
    success: true,
    entries: {
      product,
    },
  });
});

/**
 * Updating resource Product
 * @type {function(...[*]=)}
 */
exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  if (!product) return next(new AppError("Item not found", 404));

  return res.json({
    success: true,
    entries: {
      product,
    },
  });
});

/**
 * Destroy resource Product
 * @type {function(...[*]=)}
 */
exports.destroy = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) return next(new AppError("Item not found", 404));

  return res.json({
    success: true,
    entries: {
      product,
    },
  });
});
