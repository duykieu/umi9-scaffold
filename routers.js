const router = require("express").Router();

//Controller
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");

//umi-import-do-not-delete

router.route("/login").post(AuthController.login);

router
  .route("/user")
  .get(
    AuthController.protect,
    AuthController.restrictTo("UserIndex"),
    UserController.get
  )
  .post(
    AuthController.protect,
    AuthController.restrictTo("UserStore"),
    UserController.store
  );
router
  .route("/user/:id")
  .get(
    AuthController.protect,
    AuthController.restrictTo("UserShow"),
    UserController.show
  )
  .patch(
    AuthController.protect,
    AuthController.restrictTo("UserUpdate"),
    UserController.update
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo("UserDestroy"),
    UserController.destroy
  );
