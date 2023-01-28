const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const bcrypt = require("bcrypt");

async function validPassword(password, hash) {
  const hashResult = await bcrypt.compare(password, hash);
  return hashResult === hash;
}

async function genPassword(password) {
  saltRounds = 10;
  const result = await bcrypt.hash(password, saltRounds);
  return result;
}

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

module.exports = {
  validPassword,
  genPassword,
  issueJWT,
};
