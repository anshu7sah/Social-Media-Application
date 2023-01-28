const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
};
