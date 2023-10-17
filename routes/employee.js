const express = require("express");
const router = express.Router();

const employeeController = require("../controller/employee");

router.get("/getAllUsers", employeeController.getAllUsers);
router.post("/employees", employeeController.employees);
router.get("/getAllEmployees", employeeController.getAllEmployees);
router.put("/employees/:id", employeeController.updateEmployee);
router.delete("/deleteEmployee/:id", employeeController.deleteEmployee);
//router.get("/test", employeeController.test);
module.exports = router;
