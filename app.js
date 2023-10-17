const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const db = mongoose.connection;
const Employee = require("./model/employeeModel");
const bodyParser = require("body-parser");
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://sayyadwasim99:F2QTCfckOxEXbbPS@cluster0.rfs9hgx.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

app.use("/emp", require("./routes/employee")); // User routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
