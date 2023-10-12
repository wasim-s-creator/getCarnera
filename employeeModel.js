const mongoose = require("mongoose");

// Define the enum for department values
const departmentEnum = ["HR", "Engineering", "Marketing", "Sales", "Finance"];

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    enum: departmentEnum, // Use the departmentEnum as the enum values
  },
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
