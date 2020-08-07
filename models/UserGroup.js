const mongoose = require("mongoose");

const UserGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  permissions: [],
});

module.exports = mongoose.model("UserGroup", UserGroupSchema, "user_groups");
