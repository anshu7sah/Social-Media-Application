const express = require("express");
const passport = require("passport");
const userRoute = require("./routes/userRoute");
const { mongoConnect } = require("./service/database");

require("dotenv").config();

const app = express();

require("./service/passport")(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoute);

async function startServer() {
  await mongoConnect();
  app.listen(3000, () => {
    console.log(`Listenting on the port ${3000}...`);
  });
}

startServer();
