const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./db");


const userRoutes = require('./routes/userRoutes');
const apiRoutes = require("./routes/apiRoutes");

// Init
const app = express();
app.use(express.json());
app.use(apiRoutes);
app.use(userRoutes);

app.listen(1234, function() {
  console.log("Server started");
});
