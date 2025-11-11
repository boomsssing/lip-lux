// User Authentication Management
let currentUser = null;

// Load current user
function loadUser() {
    const saved = localStorage.getItem('liplux_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

// Save user
function saveUser(user) {
    currentUser = user;
    localStorage.setItem('liplux_user', JSON.stringify(user));
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('liplux_user');
    updateUserUI();
}

// Get all users
function getUsers() {
    const saved = localStorage.getItem('liplux_users');
    return saved ? JSON.parse(saved) : [];
}

// Save all users
function saveUsers(users) {
    localStorage.setItem('liplux_users', JSON.stringify(users));
}

// Register new user
function registerUser(userData) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }

    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    // Auto login
    saveUser({ id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone });
    
    return { success: true, user: newUser };
}

// Login user
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        saveUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
        return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

// Continue as guest
function continueAsGuest() {
    currentUser = { guest: true };
    closeUserModal();
}

// Password Recovery - Verify user by email and phone
function verifyUserForRecovery(email, phone) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.phone === phone);
    
    if (user) {
        return { success: true, userId: user.id };
    }
    
    return { success: false, message: 'Email and phone number do not match our records' };
}

// Reset password
function resetPassword(userId, newPassword) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
        return { success: true, message: 'Password reset successfully!' };
    }
    
    return { success: false, message: 'User not found' };
}

// Update user UI
function updateUserUI() {
    const userBtn = document.getElementById('userBtn');
    if (userBtn && currentUser && !currentUser.guest) {
        userBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
        userBtn.title = currentUser.name;
        // Change click behavior to go to dashboard
        userBtn.onclick = function() {
            window.location.href = 'user-dashboard.html';
        };
    }
}

// Initialize auth
loadUser();
updateUserUI();
