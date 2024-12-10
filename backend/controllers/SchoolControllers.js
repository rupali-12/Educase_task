const db = require("../db/connection");

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation checks
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof name !== "string" || typeof address !== "string") {
    return res.status(400).json({ error: "Name and address must be strings" });
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({
      error: "Latitude and longitude must be valid numbers",
    });
  }

  try {
    // Check if the school already exists in the database based on name only
    const queryCheck = `SELECT * FROM schools WHERE name = ?`;
    const [existingSchool] = await db.query(queryCheck, [name]);

    if (existingSchool.length > 0) {
      return res.status(409).json({ error: "School already exists" });
    }

    // Insert new school into the database
    const queryInsert =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(queryInsert, [
      name,
      address,
      latitude,
      longitude,
    ]);

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};




// Function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

exports.listSchools = async (req, res) => {
  // Extracting latitude and longitude from query parameters
  const { latitude, longitude } = req.query;

  // Validate latitude and longitude
  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Check if the values are valid numbers
  if (isNaN(lat) || isNaN(lon)) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude must be valid numbers" });
  }

  try {
    // Fetch all schools from the database
    const [schools] = await db.query("SELECT * FROM schools");

    // Define a distance threshold (e.g., 50 km)
    const MAX_DISTANCE = 50; // Maximum distance in km

    // Calculate distance for each school, sort by proximity, and filter out schools that are too far
    const sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          lat,
          lon,
          school.latitude,
          school.longitude
        );
        return { ...school, distance };
      })
      .filter((school) => school.distance <= MAX_DISTANCE) // Filter by the max distance
      .sort((a, b) => a.distance - b.distance); // Sort by distance (ascending)

    // Return sorted schools as response
    res.status(200).json(sortedSchools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
