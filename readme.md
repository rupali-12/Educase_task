# School API Project

This project provides an API for managing schools, allowing users to add schools and fetch a list of schools sorted by proximity to a user's location.

## Features

- **Add School**: Add a new school with the name, address, latitude, and longitude.
- **List Schools**: Fetch all schools and sort them by proximity to the provided latitude and longitude.

## Technologies Used

- Node.js
- Express
- MySQL Database
- Postman (for API testing)

## API Endpoints

### Base Url:

[HOSTED/LIVE_URL](https://educase-task-4oy1.onrender.com)
[Postman_Collection_Invite_Link](https://app.getpostman.com/join-team?invite_code=68484e5a75ec1642dbca495a7dbeb2a0e6954ab2cfa0727e9fc800e1192c9a2d)

### 1. **Add School**

**Endpoint**: `/api/addSchool`

**Method**: `POST`

**Request Body** (JSON):

```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": "School Latitude",
  "longitude": "School Longitude"
}
```

### 2. **List Schools**

**Endpoint**: `/api/listSchools`

**Method**: `GET`

**Query Parameters** :

```
# latitude: Latitude of the user (required)
# longitude: Longitude of the user (required)
```

## Example Request:

GET /api/listSchools?latitude=40.7128&longitude=-74.0060
