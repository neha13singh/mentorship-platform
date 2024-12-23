const express = require('express');
const path = require('path'); // Import the path module
const connection = require(path.join(__dirname, '../../database/db')); // Use path.join to create the absolute path
const router = express.Router();

// Send Mentorship Request
router.post('/request', (req, res) => {
    const { fromUserId, toUserId } = req.body;

    const query = 'INSERT INTO mentorship_requests (from_user_id, to_user_id, status) VALUES (?, ?, "pending")';
    connection.query(query, [fromUserId, toUserId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Request sent successfully' });
    });
});

// Get Mentorship Requests
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM mentorship_requests WHERE to_user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
