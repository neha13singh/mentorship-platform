const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "mentorship_db",
  password: "Neha1313",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");

  // SQL commands to create tables
  const createUsersTable = `
    CREATE TABLE user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('mentor', 'mentee') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  const createProfilesTable = `
    CREATE TABLE profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      bio TEXT,
      interests TEXT,
      skills TEXT,
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_profile (user_id)
    );
  `;

  const createMentorshipRequestsTable = `
    CREATE TABLE mentor_request_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      requestor_user_id INT NOT NULL,
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (requestor_user_id) REFERENCES user(id) ON DELETE CASCADE
    );
  `;

  const createMentorAcceptanceTable = `
    CREATE TABLE mentor_accepted_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      mentor_user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (mentor_user_id) REFERENCES user(id) ON DELETE CASCADE
    );
  `;

  // Execute the SQL commands sequentially using promises
  connection
    .promise()
    .query(createUsersTable)
    .then(() => {
      console.log("Users table created successfully.");
      return connection.promise().query(createProfilesTable);
    })
    .then(() => {
      console.log("Profiles table created successfully.");
      return connection.promise().query(createMentorshipRequestsTable);
    })
    .then(() => {
      console.log("Mentorship requests table created successfully.");
      return connection.promise().query(createMentorAcceptanceTable);
    })
    .then(() => {
      console.log("Mentor acceptance table created successfully.");
      connection.end();
    })
    .catch((err) => {
      console.error("Error creating tables:", err);
      connection.end();
    });
});
