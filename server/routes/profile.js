const express = require('express');
const path = require('path'); // Import the path module
const connection = require(path.join(__dirname, '../../database/db')); // Use path.join to create the absolute path
// const router = express.Router();
const router = express.Router();

// Create or Update Profile
router.post('/', (req, res) => {
    const { user_id, skills, interests, bio } = req.body;

    const query = `
        INSERT INTO profiles (user_id, skills, interests, bio)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE skills = ?, interests = ?, bio = ?
    `;
    connection.query(query, [user_id, skills, interests, bio, skills, interests, bio], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        res.status(200).json({ message: 'Profile saved successfully', success: true });
    });
});

// Get Profile
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM profiles WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results[0]);
    });
});

// Get All Profiles
router.get('/', (req, res) => {
    const query = 'SELECT * FROM profiles';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
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
