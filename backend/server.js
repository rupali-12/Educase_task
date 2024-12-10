const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const SchoolRoutes = require("./routes/SchoolRoutes");
const db = require("./db/connection");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api", SchoolRoutes);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await db.getConnection();
    console.log("Connected to the database successfully.");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

startServer();
