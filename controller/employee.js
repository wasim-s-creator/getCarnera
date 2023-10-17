const Employee = require("../model/employeeModel");

async function getAllUsers(req, res) {
  try {
    // const users = await User.getAllUsers();
    // res.json(users);

    res.send("hello");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function employees(req, res) {
  try {
    const { name, email, age, department } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!isValidDepartment(department)) {
      return res.status(400).json({ error: "Invalid department" });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'name' field" });
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'email' field" });
    }

    if (!age || typeof age !== "number" || age < 18 || age > 100) {
      return res.status(400).json({ error: "Invalid or missing 'age' field" });
    }

    if (
      !department ||
      typeof department !== "string" ||
      !isValidDepartment(department)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'department' field" });
    }

    // Check if the email already exists in the database
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      // Email already exists, respond with a 400 Bad Request status and a message
      return res.status(400).json({ error: "Email address already exists" });
    }

    const newEmployee = new Employee({
      name,
      email,
      age,
      department,
    });

    await newEmployee.save();

    // Respond with the saved employee data and a 201 Created status
    res.status(201).json(newEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", responseCode: 500 });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
}

function isValidDepartment(department) {
  const validDepartments = ["HR", "IT", "Finance", "Sales"];
  return validDepartments.includes(department);
}

async function getAllEmployees(req, res) {
  try {
    // Use the Employee model to find all employees in the database
    const employees = await Employee.find();

    if (!employees) {
      // If no employees are found, respond with a 404 Not Found status and a message
      return res.status(404).json({ error: "No employees found" });
    }

    // Respond with the list of employees
    res.status(200).json(employees);
  } catch (error) {
    // Handle any errors and respond with a 500 Internal Server Error status
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Use the Employee model to find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Validate and update the employee's details based on the request body
    if (req.body.name) {
      employee.name = req.body.name;
    }
    if (req.body.email) {
      // Add email validation
      if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      employee.email = req.body.email;
    }
    if (req.body.age) {
      // Add age validation
      if (req.body.age < 18 || req.body.age > 100) {
        return res.status(400).json({ error: "Invalid age" });
      }
      employee.age = req.body.age;
    }
    if (req.body.department) {
      // Add department validation
      if (!isValidDepartment(req.body.department)) {
        return res.status(400).json({ error: "Invalid department" });
      }
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
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
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
};

module.exports = {
  getAllUsers,
  employees,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  //getUserById,
};
