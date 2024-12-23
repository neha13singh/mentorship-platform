const express = require("express");
const path = require("path");
const connection = require(path.join(__dirname, "../../database/db"));
const router = express.Router();

// Get All Users with Profiles
router.get("/users", (req, res) => {
  const query = `
        SELECT u.id, u.username, u.role, p.skills, p.interests, p.bio 
        FROM user u
        LEFT JOIN profile p ON u.id = p.user_id
        WHERE p.is_public = TRUE
    `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Send Mentorship Request
router.post("/request", (req, res) => {
  const { user_id, requestor_user_id, message } = req.body;

  const query =
    'INSERT INTO mentor_request_list (user_id, requestor_user_id, message, status) VALUES (?, ?, ?, "pending")';
  connection.query(
    query,
    [user_id, requestor_user_id, message],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(201)
        .json({ success: true, message: "Request sent successfully" });
    }
  );
});

// Get User's Mentorship Requests
router.get("/requests/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
        SELECT r.*, u.username as requestor_username, u.role as requestor_role
        FROM mentor_request_list r
        JOIN user u ON r.requestor_user_id = u.id 
        WHERE r.user_id = ?
    `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Get User's Sent Requests
router.get("/sent-requests/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
        SELECT r.*, u.username, u.role
        FROM mentor_request_list r
        JOIN user u ON r.user_id = u.id
        WHERE r.requestor_user_id = ?
    `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Accept Mentorship Request
router.post("/accept", (req, res) => {
  const { requestId } = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // First update the request status
    const updateQuery =
      'UPDATE mentor_request_list SET status = "accepted" WHERE id = ?';
    connection.query(updateQuery, [requestId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          console.error("Error updating request:", err);
          res.status(500).json({ error: "Database error" });
        });
      }

      // Get the request details
      const getRequestQuery =
        "SELECT user_id, requestor_user_id FROM mentor_request_list WHERE id = ?";
      connection.query(getRequestQuery, [requestId], (err, requestResults) => {
        if (err || !requestResults.length) {
          return connection.rollback(() => {
            console.error("Error getting request details:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        // Add to accepted list
        const acceptQuery =
          "INSERT INTO mentor_accepted_list (user_id, mentor_user_id) VALUES (?, ?)";
        connection.query(
          acceptQuery,
          [requestResults[0].requestor_user_id, requestResults[0].user_id],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Error adding to accepted list:", err);
                res.status(500).json({ error: "Database error" });
              });
            }

            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({ error: "Database error" });
                });
              }
              res
                .status(200)
                .json({
                  success: true,
                  message: "Request accepted successfully",
                });
            });
          }
        );
      });
    });
  });
});

// Reject Mentorship Request
router.post("/reject", (req, res) => {
  const { requestId } = req.body;

  const query =
    'UPDATE mentor_request_list SET status = "rejected" WHERE id = ?';
  connection.query(query, [requestId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(200)
      .json({ success: true, message: "Request rejected successfully" });
  });
});

// Get User's Accepted Mentors
router.get("/accepted-mentors/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
        SELECT m.*, u.username, u.role, p.bio, p.skills, p.interests
        FROM mentor_accepted_list m
        JOIN user u ON m.mentor_user_id = u.id
        LEFT JOIN profile p ON u.id = p.user_id
        WHERE m.user_id = ?
    `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Get User's Mentees
router.get("/mentees/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
        SELECT m.*, u.username, u.role, p.bio, p.skills, p.interests
        FROM mentor_accepted_list m
        JOIN user u ON m.user_id = u.id
        LEFT JOIN profile p ON u.id = p.user_id
        WHERE m.mentor_user_id = ?
    `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
