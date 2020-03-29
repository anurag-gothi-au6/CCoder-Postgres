const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
require("./db");
require("./passport");

const userRoutes = require('./routes/userRoutes');
const apiRoutes = require("./routes/apiRoutes");

// Init
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type"]
  })
);
app.use(passport.initialize());
app.use(apiRoutes);
app.use(userRoutes);

app.listen(1234, function() {
  console.log("Server started");
});
