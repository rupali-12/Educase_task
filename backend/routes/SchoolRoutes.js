const express = require("express");
const { addSchool, listSchools } = require("../controllers/SchoolControllers");

const router = express.Router();

// Define routes
router.post("/addSchool", addSchool);
router.get("/listschools", listSchools);

module.exports = router;
