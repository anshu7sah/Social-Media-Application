const app = require("express");
const router = app.Router();
const passport = require("passport");
const {
  loginController,
  registerController,
  getUserByUsername,
  followingController,
  followersController,
  followController,
  unfollowUser,
} = require("../controllers/userController");

router.post("/login", loginController);
router.post("/users", registerController);

router.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  getUserByUsername
);
router.get(
  "/users/:username/following",
  passport.authenticate("jwt", { session: false }),
  followingController
);
router.get(
  "/users/:username/followers",
  passport.authenticate("jwt", { session: false }),
  followersController
);

router.post(
  "/users/:username/follow",
  passport.authenticate("jwt", { session: false }),
  followController
);

router.delete(
  "/users/:username/follow",
  passport.authenticate("jwt", { session: false }),
  unfollowUser
);

module.exports = router;
