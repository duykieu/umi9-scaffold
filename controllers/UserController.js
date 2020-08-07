const { catchAsync, toSlug } = require("../libs/utils");
const AppError = require("../libs/AppError");
const User = require("../models/User");
const UserGroup = require("../models/UserGroup");

/**
 * Get all user
 * @type {function(...[*]=)}
 */
exports.get = catchAsync(async (req, res, next) => {
  const { page, limit, ...query } = req.query;
  const skip = page && limit ? page * limit - limit : 0;

  const users = await User.find(query)
    .limit(limit ? Number(limit) : Number(process.env.DEFAULT_PER_PAGE || 15))
    .skip(skip);

  const total = await User.countDocuments(query);

  return res.json({
    success: true,
    entries: {
      users,
      total,
    },
  });
});

/**
 * Create new user
 * @type {function(...[*]=)}
 */
exports.store = catchAsync(async (req, res, next) => {
  const { data } = req.body;
  Object.keys(data).forEach((key) => {
    if (!data[key]) {
      data[key] = undefined;
    }
  });

  const user = await User.create(data);
  return res.json({
    success: true,
    entries: {
      user,
    },
  });
});

/**
 * Get single user
 * @type {function(...[*]=)}
 */
exports.show = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) return next(new AppError("Not found", 404));

  //Checking user group
  const userGroup = await UserGroup.findOne({ code: user.userGroup });

  if (userGroup && userGroup.permissions.length) {
    user.permissions = userGroup.permissions;
  }

  return res.json({
    success: true,
    entries: {
      user,
    },
  });
});

/**
 * Update user
 * @type {function(...[*]=)}
 */
exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = await User.findByIdAndUpdate(id, data, { new: true });

  if (!user) return next(new AppError("Not found", 404));

  return res.json({
    success: true,
    entries: {
      user,
    },
  });
});

/**
 * Delete User
 * @type {function(...[*]=)}
 */
exports.destroy = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) return next(new AppError("Not found", 404));

  return res.json({
    success: true,
    entries: {
      user,
    },
  });
});
