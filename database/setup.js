const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'Project', // Replace with your actual database name
    password: 'Neha1313', // Replace with your actual password
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');

    // SQL commands to create tables
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) CHECK (role IN ('mentor', 'mentee')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createProfilesTable = `
        CREATE TABLE IF NOT EXISTS profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            skills TEXT,
            interests TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `;

    const createMentorshipRequestsTable = `
        CREATE TABLE IF NOT EXISTS mentorship_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            from_user_id INT,
            to_user_id INT,
            status VARCHAR(10) CHECK (status IN ('pending', 'accepted', 'declined')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (from_user_id) REFERENCES users(id),
            FOREIGN KEY (to_user_id) REFERENCES users(id)
        );
    `;

    // Execute the SQL commands
    connection.query(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Users table created successfully.');
    });

    connection.query(createProfilesTable, (err) => {
        if (err) {
            console.error('Error creating profiles table:', err);
            return;
        }
        console.log('Profiles table created successfully.');
    });

    connection.query(createMentorshipRequestsTable, (err) => {
        if (err) {
            console.error('Error creating mentorship_requests table:', err);
            return;
        }
        console.log('Mentorship requests table created successfully.');
    });

    // Close the connection
    connection.end();
}); 