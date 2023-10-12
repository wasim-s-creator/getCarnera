const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const db = mongoose.connection;
const Employee = require("./employeeModel");
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

// TO ADD EMMPLOYEE
app.post("/employees", async (req, res) => {
  try {
    // Check if the email already exists in the database
    const existingEmployee = await Employee.findOne({ email: req.body.email });

    if (existingEmployee) {
      // Email already exists, respond with a 400 Bad Request status and a message
      return res.status(400).json({ error: "Email address already exists" });
    }

    // If the email is unique, create a new employee
    const newEmployee = new Employee({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      department: req.body.department,
    });

    // Save the new employee to the database
    await newEmployee.save();

    // Respond with the saved employee data and a 201 Created status
    res.status(201).json(newEmployee);
  } catch (error) {
    // Handle any errors and respond with a 500 Internal Server Error status
    res.status(500).json({ error: "Internal server error" });
  }
});

// TO get All the employees from the database

app.get("/getAllEmployees", async (req, res) => {
  try {
    // Use the Employee model to find all employees in the database
    const employees = await Employee.find();

    // Respond with the list of employees
    res.status(200).json(employees);
  } catch (error) {
    // Handle any errors and respond with a 500 Internal Server Error status
    res.status(500).json({ error: "Internal server error" });
  }
});

// TO UPDATE RECORD ACCORDING TO ID

app.put("/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Use the Employee model to find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update the employee's details based on the request body
    if (req.body.name) {
      employee.name = req.body.name;
    }
    if (req.body.email) {
      employee.email = req.body.email;
    }
    if (req.body.age) {
      employee.age = req.body.age;
    }
    if (req.body.department) {
      employee.department = req.body.department;
    }

    // Save the updated employee to the database
    await employee.save();

    // Respond with the updated employee data
    res.status(200).json(employee);
  } catch (error) {
    // Handle any errors and respond with a 500 Internal Server Error status
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE Employee
app.delete("/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Use the Employee model to find and remove the employee by ID
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    // Handle any errors and respond with a 500 Internal Server Error status
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
