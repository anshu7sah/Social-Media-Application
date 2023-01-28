const { User } = require("../models/user");
const utils = require("../lib/utils");
const { hash } = require("bcrypt");

const loginController = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: "could not find user" });
      }
      const isValid = utils.validPassword(req.body.password, user.hash);

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          user: user,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "You entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const registerController = async (req, res, next) => {
  const hash = await utils.genPassword(req.body.password);
  console.log(hash);
  const newUser = new User({
    username: req.body.username,
    hash,
  });
  newUser
    .save()
    .then((user) => {
      const jwt = utils.issueJWT(user);
      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch((err) => next(err));
};

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username }, { hash: 0 });
  res.status(200).json(user);
};

const followingController = async (req, res) => {
  const username = req.params.username;
  const following = await User.findOne({ username }, { hash: 0, followers: 0 });
  res.status(200).json(following);
};

const followersController = async (req, res) => {
  const username = req.params.username;
  const followers = await User.findOne({ username }, { hash: 0, following: 0 });
  res.status(200).json(followers);
};

const followController = async (req, res) => {
  const username = req.params.username;
  const followUsername = req.body.username;
  if (followUsername != username) {
    try {
      const user = await User.findOne({ username });
      const currentUser = await User.findOne({ username: followUsername });

      if (!user.following.includes(followUsername) && currentUser) {
        await user.updateOne({
          $push: { following: followUsername },
        });
        await currentUser.updateOne({ $push: { followers: username } });
        const updatedUser = await User.findOne({ username });

        res.status(201).json(updatedUser);
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status.json("You can not follow yourself");
  }
};

const unfollowUser = async (req, res) => {
  const username = req.params.username;
  const unfollowUsername = req.body.username;
  if (unfollowUsername != username) {
    try {
      const user = await User.findOne({ username });
      const currentUser = await User.findOne({ username: unfollowUsername });

      if (user.following.includes(unfollowUsername) && currentUser) {
        await user.updateOne({
          $pull: { following: unfollowUsername },
        });
        await currentUser.updateOne({ $pull: { followers: username } });
        const updatedUser = await User.findOne({ username });

        res.status(201).json(updatedUser);
      } else {
        res.status(403).json("you did not follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status.json("You can not unfollow yourself");
  }
};

module.exports = {
  followingController,
  registerController,
  loginController,
  getUserByUsername,
  followersController,
  followController,
  unfollowUser,
};
