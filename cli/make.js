const fs = require("fs");
const path = require("path");
const colors = require("colors");
const pluralize = require("pluralize");
const _ = require("lodash");
const User = require("../models/User");
colors.enable();

const boolValidator = ["required", "unique"];

const makeController = (args) => {
  const [controllerName, modelName, ...nextArgs] = args;
  if (!modelName) {
    return console.log("You must specify model name".red);
  }

  const templatePath = path.join(
    __dirname,
    "..",
    "cli/template/controller.txt"
  );
  let fileContent = fs.readFileSync(templatePath, "utf-8");

  fileContent = fileContent.replace(/%MODEL_NAME%/g, modelName);
  fileContent = fileContent.replace(
    /%PLURAL_NAME%/g,
    pluralize(_.camelCase(modelName))
  );
  fileContent = fileContent.replace(/%REGULAR_NAME%/g, _.camelCase(modelName));

  fs.writeFile(
    path.join(__dirname, "..", "controllers/" + controllerName + ".js"),
    fileContent,
    (err) => {
      if (err) return console.log(`${err}`.red);

      console.log(`Creating controller ${controllerName} success`.green);
    }
  );

  //Checking for route

  const routerTemplatePath = path.join(
    __dirname,
    "..",
    "cli/template/router.txt"
  );
  const mainRouterPath = path.join(__dirname, "..", "routers.js");
  let mainRouterContent = fs.readFileSync(mainRouterPath, "utf-8");
  let routerTemplateContent = fs.readFileSync(routerTemplatePath, "utf-8");

  for (const argItem of nextArgs) {
    if (argItem && argItem.startsWith("--protect=")) {
      const [, actions] = argItem.split("=");

      const actionsName = actions.split(",");
      actionsName.forEach((action) => {
        routerTemplateContent = routerTemplateContent.replace(
          `%${action.toUpperCase()}_PROTECT%`,
          `AuthController.protect`
        );
        routerTemplateContent = routerTemplateContent.replace(
          `%${action.toUpperCase()}_RESTRICT%`,
          `AuthController.restrictTo('${modelName}${_.startCase(action)}')`
        );
      });
    }
  }

  routerTemplateContent = routerTemplateContent.replace(/%\w+%,/g, "");
  mainRouterContent = mainRouterContent.replace(
    "//umi-import-do-not-delete",
    `
const ${controllerName} = require('./controllers/${controllerName}');
//umi-import-do-not-delete`
  );

  routerTemplateContent = routerTemplateContent.replace(
    /%CONTROLLER_NAME%/g,
    controllerName
  );
  routerTemplateContent = routerTemplateContent.replace(
    /%MODEL_NAME%/g,
    modelName.toLowerCase()
  );
  mainRouterContent = mainRouterContent.replace(
    "module.exports = router;",
    routerTemplateContent
  );

  fs.writeFile(
    path.join(__dirname, "..", "routers.js"),
    mainRouterContent,
    (err) => {
      if (err) return console.log(`${err}`.red);

      console.log(`Creating router success `.green);
    }
  );
};

module.exports = ({ command, args }) => {
  //Make super admin
  if (command === "make:superuser") {
    const user = {};
    args.forEach((field) => {
      const [key, value] = field.split("=");
      user[key] = value;
    });
    User.create(
      { ...user, passwordConfirm: user.password, userGroup: "super_adm" },
      (err) => {
        if (err) return console.log(`${err}`.red);
        console.log("Creating super user successfully".green);
      }
    );
  }

  //Make model
  if (command === "make:model") {
    const [modelName, ...rest] = args;

    if (!modelName) return console.log("Please specify model name".red);

    let fieldsArray = [];

    rest.forEach((params) => {
      //If we specified fields option
      if (params.startsWith("--fields")) {
        const [, fieldsList] = params.split("=");
        fieldsArray = fieldsList.split(",");
      }
    });

    let modelConfigurationString = "";

    fieldsArray.forEach((field) => {
      const [basic, validators] = field.split("#");

      let validateString = "";

      if (validators) {
        const rules = validators.split("-");
        rules.forEach((rule) => {
          if (boolValidator.includes(rule)) {
            validateString += rule + ":true,";
          } else {
            validateString += rule + ",";
          }
        });
      }

      if (validateString) {
        const [fieldName, type] = basic.split(":");
        modelConfigurationString += `${fieldName}:{
                  type: ${type},
                  ${validateString}
              },`;
      } else {
        modelConfigurationString += basic + ",\n\t";
      }
    });

    const templatePath = path.join(__dirname, "..", "cli/template/model.txt");
    let fileContent = fs.readFileSync(templatePath, "utf-8");

    fileContent = fileContent.replace(/%MODEL_NAME%/g, modelName);
    fileContent = fileContent.replace(
      /%MODEL_FIELDS%/g,
      modelConfigurationString
    );
    fileContent = fileContent.replace(
      /%TABLE_NAME%/g,
      pluralize(_.snakeCase(modelName))
    );

    fs.writeFile(
      path.join(__dirname, "..", "models/" + modelName + ".js"),
      fileContent,
      (err) => {
        if (err) return console.log(`${err}`.red);

        console.log(`Creating model ${modelName} success`.green);
      }
    );
  }

  if (command === "make:controller") {
    makeController(args);
  }
};
