const express = require("express");
const path = require("path");
const connection = require(path.join(__dirname, "../../database/db"));
const router = express.Router();

// Create profile
router.post("/", async (req, res) => {
  try {
    const { user_id, skills, interests, bio, is_public } = req.body;

    const query = `
            INSERT INTO profile (user_id, skills, interests, bio, is_public)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                skills = VALUES(skills),
                interests = VALUES(interests),
                bio = VALUES(bio)
        `;

    const [result] = await connection
      .promise()
      .query(query, [user_id, skills, interests, bio]);

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: {
        skills,
        interests,
        bio,
        is_public,
      },
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
});

// Update profile
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills, interests, bio } = req.body;

    const query = `
            UPDATE profile
            SET skills = ?, interests = ?, bio = ?
            WHERE user_id = ?
        `;

    const [result] = await connection
      .promise()
      .query(query, [skills, interests, bio, userId]);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

// Get Profile
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
            SELECT p.*, u.first_name, u.last_name, u.role
            FROM profile p
            JOIN user u ON p.user_id = u.id
            WHERE p.user_id = ?
        `;

    const [results] = await connection.promise().query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

module.exports = router;
