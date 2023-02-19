const express = require("express");
const app = express();
require("dotenv/config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const form = require("./routes/form");

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

app.options("*", cors());
mongoose.set("strictQuery", false);

mongoose
  .connect(
   process.env.Mong_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "kt-database",
    }
  )
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(`/form`, form);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log(err);
    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    //  validation error
    return res.status(401).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json(err);
});

app.listen(process.env.port, () => {
  console.log("server listening on port 4000");
});
