// User Dashboard JavaScript

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('hidden');
            navbar.classList.remove('visible');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar as visible
    if (navbar) {
        navbar.classList.add('visible');
    }
    // Check if user is logged in
    if (!currentUser || currentUser.guest) {
        alert('Please login to access your dashboard');
        window.location.href = 'index.html';
        return;
    }

    loadUserDashboard();
    setupDashboardListeners();
});

// Load user dashboard
function loadUserDashboard() {
    // Display user info
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('userEmail').textContent = currentUser.email;

    // Load user orders (with real-time refresh)
    loadUserOrders();

    // Load profile data
    loadProfileData();

    // Load addresses
    loadAddresses();

    // Set up auto-refresh for orders every 30 seconds
    setInterval(() => {
        console.log('Auto-refreshing orders...'); // Debug log
        loadUserOrders();
    }, 30000);
}

// Setup dashboard listeners
function setupDashboardListeners() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.dashboard-tab');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            console.log('Switching to tab:', tabName); // Debug log
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.dashboard-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(tabName + 'Tab');
            if (targetTab) {
                targetTab.classList.add('active');
            } else {
                console.error('Tab not found:', tabName + 'Tab'); // Debug log
            }
        });
    });

    // Order filter
    const orderFilter = document.getElementById('userOrderFilter');
    if (orderFilter) {
        orderFilter.addEventListener('change', function() {
            loadUserOrders(this.value);
        });
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }

    // Add address form
    const addAddressForm = document.getElementById('addAddressForm');
    if (addAddressForm) {
        addAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    }

    // Track package form
    const trackPackageForm = document.getElementById('trackPackageForm');
    if (trackPackageForm) {
        trackPackageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            trackPackageByCode();
        });
    }

    // Overlay click
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeOrderDetailsModal();
            closeAddAddressModal();
            closeTrackPackageModal();
        });
    }
}

// Get all orders from localStorage
function getOrders() {
    const saved = localStorage.getItem('liplux_orders');
    return saved ? JSON.parse(saved) : [];
}

// Load user orders
function loadUserOrders(statusFilter = 'all') {
    const allOrders = getOrders();
    console.log('All orders:', allOrders); // Debug log
    console.log('Current user:', currentUser); // Debug log
    
    let userOrders = allOrders.filter(order => {
        const userIdMatch = order.customer.userId === currentUser.id;
        const emailMatch = order.customer.email === currentUser.email;
        const phoneMatch = order.customer.phone === currentUser.phone;
        console.log(`Order ${order.code}: userID match=${userIdMatch}, email match=${emailMatch}, phone match=${phoneMatch}`); // Debug log
        return userIdMatch || emailMatch || phoneMatch;
    });

    console.log('User orders found:', userOrders.length); // Debug log

    if (statusFilter !== 'all') {
        userOrders = userOrders.filter(order => order.status === statusFilter);
    }

    const ordersGrid = document.getElementById('userOrdersGrid');

    if (userOrders.length === 0) {
        ordersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag" style="font-size: 4rem; color: #95a5a6; margin-bottom: 1rem;"></i>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="index.html#products" class="btn btn-primary" style="margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        return;
    }

    ordersGrid.innerHTML = userOrders.reverse().map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <h3>Order ${order.code}</h3>
                    <p class="order-date">${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            
            <div class="order-card-items">
                ${order.items.slice(0, 3).map(item => {
                    let imageDisplay;
                    if (item.image.startsWith('data:image') || item.image.startsWith('http')) {
                        imageDisplay = `<img src="${item.image}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;">`;
                    } else if (item.image.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                        imageDisplay = `<img src="${item.image}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;">`;
                    } else {
                        imageDisplay = `<span class="item-emoji">${item.image}</span>`;
                    }
                    
                    const colorInfo = item.selectedColor ? ` (${item.selectedColor.name})` : '';
                    
                    return `
                        <div class="order-item-mini">
                            ${imageDisplay}
                            <span class="item-name">${item.name}${colorInfo}</span>
                            <span class="item-qty">×${item.quantity}</span>
                        </div>
                    `;
                }).join('')}
                ${order.items.length > 3 ? `<p class="more-items">+${order.items.length - 3} more items</p>` : ''}
            </div>

            <div class="order-card-footer">
                <div class="order-total">
                    <span>Total:</span>
                    <strong>GH₵ ${order.total.toFixed(2)}</strong>
                </div>
                <div class="order-actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewUserOrder('${order.code}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="trackOrder('${order.code}')">
                        <i class="fas fa-map-marker-alt"></i> Track
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// View user order details
function viewUserOrder(code) {
    const orders = getOrders();
    const order = orders.find(o => o.code === code);
    
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    const overlay = document.getElementById('overlay');

    content.innerHTML = `
        <div class="order-details-full">
            <div class="order-header-full">
                <h2>Order ${order.code}</h2>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>

            <div class="order-timeline">
                <h3>Order Status</h3>
                <div class="timeline">
                    <div class="timeline-item ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-check"></i></div>
                        <div class="timeline-content">
                            <h4>Order Placed</h4>
                            <p>${new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-box"></i></div>
                        <div class="timeline-content">
                            <h4>Processing</h4>
                            <p>Your order is being prepared</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-truck"></i></div>
                        <div class="timeline-content">
                            <h4>Out for Delivery</h4>
                            <p>Your order is on the way</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-home"></i></div>
                        <div class="timeline-content">
                            <h4>Delivered</h4>
                            <p>Order has been delivered</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-section">
                <h3>Order Items</h3>
                ${order.items.map(item => {
                    let imageDisplay;
                    if (item.image.startsWith('data:image') || item.image.startsWith('http')) {
                        imageDisplay = `<img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">`;
                    } else if (item.image.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                        imageDisplay = `<img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">`;
                    } else {
                        imageDisplay = `<div style="font-size: 2rem; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">${item.image}</div>`;
                    }
                    
                    const colorInfo = item.selectedColor ? 
                        `<p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
                            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${item.selectedColor.hex}; margin-right: 0.5rem; border: 1px solid #ddd;"></span>
                            ${item.selectedColor.name}
                        </p>` : '';
                    
                    return `
                        <div class="order-item-detail">
                            <div class="item-image-large">${imageDisplay}</div>
                            <div class="item-info-detail">
                                <h4>${item.name}</h4>
                                ${colorInfo}
                                <p>Quantity: ${item.quantity}</p>
                            </div>
                            <div class="item-price-detail">GH₵ ${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="order-section">
                <h3>Delivery Information</h3>
                <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
            </div>

            <div class="order-section">
                <h3>Order Summary</h3>
                <div class="order-summary-detail">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>GH₵ ${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery:</span>
                        <span>GH₵ ${order.delivery.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>GH₵ ${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
}

// Close order details modal
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    const overlay = document.getElementById('overlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Track order
function trackOrder(code) {
    window.location.href = `track-order.html?code=${code}`;
}

// Refresh orders manually
function refreshOrders() {
    console.log('Manually refreshing orders...'); // Debug log
    loadUserOrders();
    
    // Show a brief notification
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}

// Load profile data
function loadProfileData() {
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
}

// Update profile
function updateProfile() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;

    // Update current user
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;

    // Update in users database
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].phone = phone;
        saveUsers(users);
    }

    // Save current user
    saveUser(currentUser);

    // Update display
    document.getElementById('userName').textContent = `Welcome, ${name}!`;
    document.getElementById('userEmail').textContent = email;

    alert('Profile updated successfully!');
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPasswordProfile').value;
    const confirmPassword = document.getElementById('confirmPasswordProfile').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    // Get user from database
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);

    if (!user || user.password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }

    // Update password
    user.password = newPassword;
    saveUsers(users);

    // Clear form
    document.getElementById('passwordForm').reset();

    alert('Password changed successfully!');
}

// Load addresses
function loadAddresses() {
    const addresses = getUserAddresses();
    const addressesGrid = document.getElementById('addressesGrid');

    if (addresses.length === 0) {
        addressesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt" style="font-size: 4rem; color: #95a5a6; margin-bottom: 1rem;"></i>
                <h3>No saved addresses</h3>
                <p>Add an address for faster checkout.</p>
            </div>
        `;
        return;
    }

    addressesGrid.innerHTML = addresses.map((address, index) => `
        <div class="address-card">
            <div class="address-header">
                <h4>${address.label}</h4>
                <button class="btn-icon" onclick="deleteAddress(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p>${address.address}</p>
            <p>${address.city}</p>
            <p><i class="fas fa-phone"></i> ${address.phone}</p>
        </div>
    `).join('');
}

// Get user addresses
function getUserAddresses() {
    const key = `liplux_addresses_${currentUser.id}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
}

// Save user addresses
function saveUserAddresses(addresses) {
    const key = `liplux_addresses_${currentUser.id}`;
    localStorage.setItem(key, JSON.stringify(addresses));
}

// Open add address modal
function openAddAddressModal() {
    document.getElementById('addAddressModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Close add address modal
function closeAddAddressModal() {
    document.getElementById('addAddressModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('addAddressForm').reset();
}

// Save address
function saveAddress() {
    const address = {
        label: document.getElementById('addressLabel').value,
        address: document.getElementById('addressFull').value,
        city: document.getElementById('addressCity').value,
        phone: document.getElementById('addressPhone').value
    };

    const addresses = getUserAddresses();
    addresses.push(address);
    saveUserAddresses(addresses);

    closeAddAddressModal();
    loadAddresses();
    alert('Address saved successfully!');
}

// Delete address
function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const addresses = getUserAddresses();
        addresses.splice(index, 1);
        saveUserAddresses(addresses);
        loadAddresses();
    }
}

// Get users helper function
function getUsers() {
    const saved = localStorage.getItem('liplux_users');
    return saved ? JSON.parse(saved) : [];
}

// Save users helper function
function saveUsers(users) {
    localStorage.setItem('liplux_users', JSON.stringify(users));
}

// Save user helper function
function saveUser(user) {
    currentUser = user;
    localStorage.setItem('liplux_user', JSON.stringify(user));
}

// Open track package modal
function openTrackPackageModal() {
    document.getElementById('trackPackageModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Close track package modal
function closeTrackPackageModal() {
    document.getElementById('trackPackageModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('trackPackageForm').reset();
    
    // Hide tracking results
    const resultsDiv = document.getElementById('trackingResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
}

// Track package by code
function trackPackageByCode() {
    const trackingCode = document.getElementById('trackingCode').value.trim();
    const resultsDiv = document.getElementById('trackingResults');
    
    if (!trackingCode) {
        alert('Please enter a tracking code');
        return;
    }

    // Show loading state
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="tracking-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Searching for your package...</p>
        </div>
    `;

    // Search for the order
    setTimeout(() => {
        const allOrders = getOrders();
        const order = allOrders.find(o => o.code.toLowerCase() === trackingCode.toLowerCase());
        
        if (!order) {
            resultsDiv.innerHTML = `
                <div class="tracking-not-found">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Order Not Found</h3>
                    <p>No order found with tracking code: <strong>${trackingCode}</strong></p>
                    <p>Please check your tracking code and try again.</p>
                </div>
            `;
            return;
        }

        // Display order tracking information
        displayTrackingResults(order);
    }, 1000);
}

// Display tracking results
function displayTrackingResults(order) {
    const resultsDiv = document.getElementById('trackingResults');
    
    resultsDiv.innerHTML = `
        <div class="tracking-found">
            <div class="tracking-header">
                <i class="fas fa-check-circle" style="color: #27ae60;"></i>
                <h3>Package Found!</h3>
                <p>Order Code: <strong>${order.code}</strong></p>
            </div>

            <div class="tracking-timeline">
                <h4>Order Status</h4>
                <div class="timeline">
                    <div class="timeline-item ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-check"></i></div>
                        <div class="timeline-content">
                            <h5>Order Placed</h5>
                            <p>${new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-box"></i></div>
                        <div class="timeline-content">
                            <h5>Processing</h5>
                            <p>Your order is being prepared</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-truck"></i></div>
                        <div class="timeline-content">
                            <h5>Out for Delivery</h5>
                            <p>Your order is on the way</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon"><i class="fas fa-home"></i></div>
                        <div class="timeline-content">
                            <h5>Delivered</h5>
                            <p>Order has been delivered</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tracking-details">
                <div class="tracking-section">
                    <h4>Order Items</h4>
                    ${order.items.map(item => {
                        const colorInfo = item.selectedColor ? ` (${item.selectedColor.name})` : '';
                        return `
                            <div class="tracking-item">
                                <span class="item-name">${item.name}${colorInfo}</span>
                                <span class="item-qty">×${item.quantity}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="tracking-section">
                    <h4>Delivery Information</h4>
                    <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                </div>

                <div class="tracking-section">
                    <h4>Order Total</h4>
                    <p class="total-amount">GH₵ ${order.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
}

// User logout
function userLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
        window.location.href = 'index.html';
    }
}
