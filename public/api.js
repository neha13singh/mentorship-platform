const API_BASE_URL = 'http://localhost:3000/api'; // Base URL for API calls

// Function to register a user
async function registerUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
        const errorText = await response.text(); // Get the error text
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json(); // Parse the JSON response
}

// Function to log in a user
async function loginUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Function to fetch users by role
async function fetchUsers(role) {
    const response = await fetch(`${API_BASE_URL}/mentorship/users/${role}`);
    return response.json();
}

// Function to save user profile
async function saveProfile(data) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Export functions for use in other files
export { registerUser, loginUser, fetchUsers, saveProfile }; 