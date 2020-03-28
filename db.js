var mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27011/Ccoder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(function() {
    console.log("Database connected successfully");
  })
  .catch(function(err) {
    console.log(err.message);
  });
