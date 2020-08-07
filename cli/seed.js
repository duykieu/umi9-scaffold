const acl = require("../acl/permissions");
const UserGroup = require("../models/UserGroup");

require("../database");

const seedACL = async () => {
  const permissions = {};
  for (const screen of Object.keys(acl)) {
    for (const action of Object.keys(acl[screen])) {
      for (const userGroupCode of acl[screen][action]) {
        if (!permissions[userGroupCode]) {
          permissions[userGroupCode] = [];
        }
        permissions[userGroupCode].push(screen + action);
      }
    }
  }
  for (const userGroupCode of Object.keys(permissions)) {
    const userGroup = await UserGroup.findOne({ code: userGroupCode });
    if (userGroup) {
      await UserGroup.findByIdAndUpdate(
        userGroup._id,
        {
          permissions: permissions[userGroupCode],
        },
        (error) => {
          if (error) return console.log(`${error}`.red);
          console.log(`Seeded user group ${userGroupCode} permissions`.green);
        }
      );
    }
  }
};

module.exports = async ({ command, args }) => {
  if (command === "seed:acl") {
    const userGroupCount = await UserGroup.countDocuments();
    if (!userGroupCount) {
      console.log("Creating user groups collection".green);
      UserGroup.create(
        { name: "Super Administrator", code: "super_adm" },
        (error) => {
          if (error) return console.log(`${error}`.red);
          console.log("Super Administrator group created".green);
          seedACL();
        }
      );
    }
  }
};
