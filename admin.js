// Admin Portal JavaScript

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

let isAdminLoggedIn = false;
let autoRefreshInterval = null;
let lastOrderCount = 0;

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.admin-navbar');
let scrollTimeout;

window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (navbar) {
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            }
        } else {
            // Scrolling up
            if (navbar) {
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar as visible
    if (navbar) {
        navbar.classList.add('visible');
    }
    checkAdminAuth();
    setupAdminListeners();
    
    // Start auto-refresh for real-time updates
    if (isAdminLoggedIn) {
        startAutoRefresh();
    }
});

// Check admin authentication
function checkAdminAuth() {
    const saved = sessionStorage.getItem('admin_logged_in');
    if (saved === 'true') {
        isAdminLoggedIn = true;
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

// Show admin login
function showAdminLogin() {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadDashboardData();
    startAutoRefresh();
}

// Start auto-refresh for real-time updates
function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Refresh every 30 seconds
    autoRefreshInterval = setInterval(() => {
        const activeSection = document.querySelector('.admin-section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            if (sectionId === 'dashboardSection') {
                loadDashboardData();
            } else if (sectionId === 'ordersSection') {
                const statusFilter = document.getElementById('orderStatusFilter').value;
                loadAllOrders(statusFilter);
            }
        }
    }, 30000); // 30 seconds
}

// Stop auto-refresh
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Setup admin listeners
function setupAdminListeners() {
    // Login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                isAdminLoggedIn = true;
                sessionStorage.setItem('admin_logged_in', 'true');
                showAdminDashboard();
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Navigation
    const navLinks = document.querySelectorAll('.admin-nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Order status filter
    const statusFilter = document.getElementById('orderStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadAllOrders(this.value);
        });
    }

    // Order search
    const searchInput = document.getElementById('orderSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchOrders(this.value);
        });
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }

    // Image upload handler
    const imageFileInput = document.getElementById('productImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }

    // Image URL preview
    const imageUrlInput = document.getElementById('productImageUrl');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            previewImageUrl(this.value);
        });
    }
}

// Show section
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + 'Section').classList.add('active');

    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'orders':
            loadAllOrders();
            break;
        case 'products':
            loadAdminProducts();
            break;
        case 'customers':
            loadCustomers();
            break;
    }
}

// Get all orders from localStorage
function getOrders() {
    const saved = localStorage.getItem('liplux_orders');
    return saved ? JSON.parse(saved) : [];
}

// Load dashboard data
function loadDashboardData() {
    const orders = getOrders();
    
    // Check for new orders
    if (lastOrderCount > 0 && orders.length > lastOrderCount) {
        showNewOrderNotification(orders.length - lastOrderCount);
    }
    lastOrderCount = orders.length;
    
    // Update stats
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('shippedOrders').textContent = orders.filter(o => o.status === 'shipped').length;
    document.getElementById('completedOrders').textContent = orders.filter(o => o.status === 'delivered').length;

    // Update last updated time
    updateLastUpdatedTime();

    // Load recent orders
    loadRecentOrders();
}

// Update last updated time
function updateLastUpdatedTime() {
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdatedEl.textContent = timeString;
    }
}

// Show new order notification
function showNewOrderNotification(count) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff69b4, #e91e63);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s;
        font-size: 1.1rem;
        font-weight: bold;
    `;
    notification.innerHTML = `
        <i class="fas fa-bell"></i> 
        ${count} New Order${count > 1 ? 's' : ''}!
    `;
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Load recent orders
function loadRecentOrders() {
    const orders = getOrders().slice(-10).reverse();
    const tableBody = document.getElementById('recentOrdersTable');

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No orders yet</td></tr>';
        return;
    }

    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.code}</strong></td>
            <td>${order.customer.name}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><strong>GH₵ ${order.total.toFixed(2)}</strong></td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.code}')">View</button>
                <button class="action-btn btn-update" onclick="updateOrderStatus('${order.code}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// Load all orders
function loadAllOrders(statusFilter = 'all') {
    let orders = getOrders();
    
    if (statusFilter !== 'all') {
        orders = orders.filter(o => o.status === statusFilter);
    }

    const tableBody = document.getElementById('allOrdersTable');

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
        return;
    }

    tableBody.innerHTML = orders.reverse().map(order => `
        <tr>
            <td><strong>${order.code}</strong></td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td>${order.customer.address}, ${order.customer.city}</td>
            <td>${order.items.length} items</td>
            <td><strong>GH₵ ${order.total.toFixed(2)}</strong></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.code}')">View</button>
                <button class="action-btn btn-update" onclick="updateOrderStatus('${order.code}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// Search orders
function searchOrders(query) {
    const orders = getOrders();
    const filtered = orders.filter(o => 
        o.code.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.phone.includes(query)
    );

    const tableBody = document.getElementById('allOrdersTable');
    
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
        return;
    }

    tableBody.innerHTML = filtered.reverse().map(order => `
        <tr>
            <td><strong>${order.code}</strong></td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td>${order.customer.address}, ${order.customer.city}</td>
            <td>${order.items.length} items</td>
            <td><strong>GH₵ ${order.total.toFixed(2)}</strong></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.code}')">View</button>
                <button class="action-btn btn-update" onclick="updateOrderStatus('${order.code}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// View order details
function viewOrderDetails(code) {
    const orders = getOrders();
    const order = orders.find(o => o.code === code);
    
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    const overlay = document.getElementById('overlay');

    content.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h3>Order ${order.code}</h3>
            <span class="status-badge status-${order.status}">${order.status}</span>
        </div>
        
        <div style="background: #ecf0f1; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Email:</strong> ${order.customer.email || 'N/A'}</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}</p>
            ${order.customer.notes ? `<p><strong>Notes:</strong> ${order.customer.notes}</p>` : ''}
        </div>

        <div style="background: #ecf0f1; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h4>Order Items</h4>
            ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #fff;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <span style="color: #95a5a6;">Qty: ${item.quantity} × GH₵ ${item.price.toFixed(2)}</span>
                    </div>
                    <div style="font-weight: bold;">GH₵ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #fff;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Subtotal:</span>
                    <span>GH₵ ${order.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Delivery:</span>
                    <span>GH₵ ${order.delivery.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; color: #ff69b4;">
                    <span>Total:</span>
                    <span>GH₵ ${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div style="background: #ecf0f1; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h4>Payment Information</h4>
            <p><strong>Method:</strong> Mobile Money (${order.payment.provider.toUpperCase()})</p>
            <p><strong>Paid To:</strong> ${order.payment.paidTo} (${order.payment.paidToName})</p>
            <p><strong>Customer Number:</strong> ${order.payment.customerNumber}</p>
            <p><strong>Customer Name:</strong> ${order.payment.customerName}</p>
            ${order.payment.reference && order.payment.reference !== 'N/A' ? 
                `<p><strong>Transaction Reference:</strong> ${order.payment.reference}</p>` : ''}
        </div>
        
        ${order.deliveryImage ? `
            <div style="background: #ecf0f1; padding: 1.5rem; border-radius: 8px;">
                <h4><i class="fas fa-camera"></i> Delivery Photo</h4>
                <img src="${order.deliveryImage}" alt="Delivery Photo" 
                     style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; margin-top: 1rem; border: 2px solid #fff;">
                <p style="margin-top: 0.5rem; color: var(--gray); font-size: 0.9rem; text-align: center;">
                    Photo taken on delivery
                </p>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
}

// Close order modal
function closeOrderModal() {
    const modal = document.getElementById('orderDetailsModal');
    const overlay = document.getElementById('overlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Update order status
function updateOrderStatus(code) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.code === code);
    
    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    const statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' }
    ];
    
    // Create status selection prompt
    let statusOptions = statuses.map((s, i) => 
        `${i + 1}. ${s.label} ${s.value === order.status ? '(Current)' : ''}`
    ).join('\n');
    
    const selection = prompt(
        `Order ${code} - Current Status: ${order.status.toUpperCase()}\n\n` +
        `Select new status (1-4):\n${statusOptions}`,
        ''
    );
    
    if (!selection) return;
    
    const selectedIndex = parseInt(selection) - 1;
    if (selectedIndex >= 0 && selectedIndex < statuses.length) {
        const newStatus = statuses[selectedIndex].value;
        
        if (newStatus === order.status) {
            alert('Order is already in this status!');
            return;
        }
        
        // If changing to delivered, offer to add delivery image
        if (newStatus === 'delivered') {
            const addImage = confirm(`Update order ${code} to "Delivered".\n\nWould you like to add a delivery photo? (Optional)`);
            
            if (addImage) {
                showDeliveryImageUpload(order, orderIndex);
                return;
            }
        }
        
        const confirmed = confirm(`Update order ${code} to "${statuses[selectedIndex].label}"?`);
        
        if (confirmed) {
            order.status = newStatus;
            order.timeline[newStatus] = new Date().toISOString();
            localStorage.setItem('liplux_orders', JSON.stringify(orders));
            loadDashboardData();
            loadAllOrders();
            alert(`Order status updated to "${statuses[selectedIndex].label}" successfully!`);
        }
    } else {
        alert('Invalid selection!');
    }
}

// Show delivery image upload modal
function showDeliveryImageUpload(order, orderIndex) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Delivery Photo</h2>
            <p style="color: var(--gray); margin-bottom: 1.5rem;">Upload a photo of the delivered package (optional)</p>
            
            <div class="image-upload-options">
                <div class="upload-option">
                    <label for="deliveryImageFile" class="upload-label">
                        <i class="fas fa-camera"></i> Take/Upload Photo
                    </label>
                    <input type="file" id="deliveryImageFile" accept="image/*" style="display: none;">
                </div>
                
                <div class="upload-divider">OR</div>
                
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" id="deliveryImageUrl" placeholder="Paste image URL">
                </div>
            </div>
            
            <div id="deliveryImagePreview" style="display: none; margin: 1rem 0;">
                <img id="deliveryPreviewImg" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn btn-secondary" onclick="closeDeliveryImageModal()">Cancel</button>
                <button class="btn btn-secondary" onclick="skipDeliveryImage('${order.code}', ${orderIndex})">Skip - No Photo</button>
                <button class="btn btn-primary" onclick="saveDeliveryImage('${order.code}', ${orderIndex})">Save & Mark Delivered</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup image upload
    document.getElementById('deliveryImageFile').addEventListener('change', handleDeliveryImageUpload);
    document.getElementById('deliveryImageUrl').addEventListener('input', function() {
        previewDeliveryImageUrl(this.value);
    });
}

// Handle delivery image upload
function handleDeliveryImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (500KB limit)
    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
        alert('Image too large! Please use an image smaller than 500KB.');
        event.target.value = '';
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file!');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        document.getElementById('deliveryImageUrl').value = base64Image;
        previewDeliveryImageUrl(base64Image);
    };
    reader.readAsDataURL(file);
}

// Preview delivery image URL
function previewDeliveryImageUrl(url) {
    if (!url) {
        document.getElementById('deliveryImagePreview').style.display = 'none';
        return;
    }

    if (url.startsWith('data:image') || url.startsWith('http')) {
        const preview = document.getElementById('deliveryImagePreview');
        const previewImg = document.getElementById('deliveryPreviewImg');
        previewImg.src = url;
        preview.style.display = 'block';
    }
}

// Save delivery image and update status
function saveDeliveryImage(code, orderIndex) {
    const imageUrl = document.getElementById('deliveryImageUrl').value;
    
    if (!imageUrl) {
        alert('Please upload an image or click "Skip - No Photo"');
        return;
    }
    
    const orders = getOrders();
    const order = orders[orderIndex];
    
    order.status = 'delivered';
    order.timeline.delivered = new Date().toISOString();
    order.deliveryImage = imageUrl;
    
    localStorage.setItem('liplux_orders', JSON.stringify(orders));
    closeDeliveryImageModal();
    loadDashboardData();
    loadAllOrders();
    alert('Order marked as delivered with photo!');
}

// Skip delivery image
function skipDeliveryImage(code, orderIndex) {
    const orders = getOrders();
    const order = orders[orderIndex];
    
    order.status = 'delivered';
    order.timeline.delivered = new Date().toISOString();
    
    localStorage.setItem('liplux_orders', JSON.stringify(orders));
    closeDeliveryImageModal();
    loadDashboardData();
    loadAllOrders();
    alert('Order marked as delivered!');
}

// Close delivery image modal
function closeDeliveryImageModal() {
    const modal = document.querySelector('.modal.active');
    if (modal && modal.querySelector('#deliveryImageFile')) {
        modal.remove();
    }
}

// Load admin products
function loadAdminProducts() {
    const grid = document.getElementById('adminProductsGrid');
    
    grid.innerHTML = products.map(product => {
        // Check if image is Base64, URL, or file
        let imageDisplay;
        if (product.image.startsWith('data:image') || product.image.startsWith('http')) {
            imageDisplay = `<img src="${product.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">`;
        } else if (product.image.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            // Regular image file
            imageDisplay = `<img src="${product.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">`;
        } else {
            // Emoji or other content
            imageDisplay = `<div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">${product.image}</div>`;
        }
        
        return `
            <div class="admin-product-card">
                ${imageDisplay}
                <h4>${product.name}</h4>
                <p style="color: #95a5a6; font-size: 0.9rem;">${product.category}</p>
                <p style="font-size: 1.2rem; font-weight: bold; color: #ff69b4; margin: 0.5rem 0;">GH₵ ${product.price.toFixed(2)}</p>
                <p style="color: #95a5a6; font-size: 0.9rem;">Stock: ${product.stock}</p>
                <div class="admin-product-actions">
                    <button class="action-btn btn-update" onclick="editProduct(${product.id})">Edit</button>
                    <button class="action-btn btn-view" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Open add product modal
function openAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productForm').dataset.editId = '';
    document.getElementById('productModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (500KB limit for performance)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
        alert('Image too large! Please use an image smaller than 500KB for best performance.');
        event.target.value = '';
        return;
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file!');
        event.target.value = '';
        return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = base64Image;
        preview.style.display = 'block';

        // Store in hidden field
        document.getElementById('productImageUrl').value = base64Image;
    };
    reader.readAsDataURL(file);
}

// Preview image URL
function previewImageUrl(url) {
    if (!url) {
        document.getElementById('imagePreview').style.display = 'none';
        return;
    }

    // Check if it's a Base64 image or URL
    if (url.startsWith('data:image') || url.startsWith('http')) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = url;
        preview.style.display = 'block';
    } else {
        // It's probably an emoji or invalid
        document.getElementById('imagePreview').style.display = 'none';
    }
}

// Check localStorage usage
function checkStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    const usedMB = (total / 1024 / 1024).toFixed(2);
    const limitMB = 5; // Most browsers limit to 5-10MB
    
    if (usedMB > limitMB * 0.8) {
        alert(`Warning: Storage is ${usedMB}MB / ~${limitMB}MB. Consider using image URLs instead of uploads.`);
    }
    
    return { used: usedMB, limit: limitMB };
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImageUrl').value = product.image;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productForm').dataset.editId = id;

    // Show preview if image exists
    previewImageUrl(product.image);

    document.getElementById('productModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Save product
function saveProduct() {
    const form = document.getElementById('productForm');
    const editId = form.dataset.editId;

    const imageValue = document.getElementById('productImageUrl').value || '💄';

    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: imageValue,
        stock: parseInt(document.getElementById('productStock').value)
    };

    // Check storage before saving
    checkStorageUsage();

    if (editId) {
        // Update existing
        const index = products.findIndex(p => p.id == editId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Add new
        productData.id = Date.now();
        products.push(productData);
    }

    saveProducts();
    loadAdminProducts();
    closeProductModal();
    
    // Clear form and preview
    form.reset();
    document.getElementById('imagePreview').style.display = 'none';
    
    alert('Product saved successfully!');
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            saveProducts();
            loadAdminProducts();
            alert('Product deleted successfully!');
        }
    }
}

// Load customers
function loadCustomers() {
    const users = getUsers();
    const orders = getOrders();
    const tableBody = document.getElementById('customersTable');

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No registered customers yet</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map(user => {
        const userOrders = orders.filter(o => o.customer.email === user.email);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

        return `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${userOrders.length}</td>
                <td><strong>GH₵ ${totalSpent.toFixed(2)}</strong></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    }).join('');
}

// Admin logout
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        stopAutoRefresh();
        sessionStorage.removeItem('admin_logged_in');
        isAdminLoggedIn = false;
        window.location.reload();
    }
}

// Setup overlay click
document.addEventListener('click', function(e) {
    if (e.target.id === 'overlay') {
        closeOrderModal();
        closeProductModal();
    }
});