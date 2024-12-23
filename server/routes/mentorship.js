const express = require('express');
const path = require('path');
const connection = require(path.join(__dirname, '../../database/db'));
const router = express.Router();

// Get All Users with Profiles
router.get('/users', (req, res) => {
    const query = `
        SELECT u.id, u.username, u.role, p.skills, p.interests, p.bio
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

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

// Get User Connections
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM mentorship_requests WHERE from_user_id = ? OR to_user_id = ?';
    connection.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Accept Mentorship Request
router.post('/accept', (req, res) => {
    const { requestId } = req.body;

    const query = 'UPDATE mentorship_requests SET status = "accepted" WHERE id = ?';
    connection.query(query, [requestId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Request accepted successfully' });
    });
});

// Decline Mentorship Request
router.post('/decline', (req, res) => {
    const { requestId } = req.body;

    const query = 'UPDATE mentorship_requests SET status = "declined" WHERE id = ?';
    connection.query(query, [requestId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Request declined successfully' });
    });
});

// Update User Profile
router.post('/profile', (req, res) => {
    const { user_id, skills, interests, bio } = req.body;

    const query = `
        UPDATE profiles
        SET skills = ?, interests = ?, bio = ?
        WHERE user_id = ?
    `;
    connection.query(query, [skills, interests, bio, user_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    });
});

module.exports = router;