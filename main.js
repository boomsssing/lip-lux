// Main JavaScript for Homepage

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductsGrid();
    setupEventListeners();
    updateCartUI();
});

// Load products grid
function loadProductsGrid(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredProducts = getProductsByCategory(filter);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">GH₵ ${product.price.toFixed(2)}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProductsGrid(this.dataset.filter);
        });
    });

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            closeUserModal();
        });
    }

    // User button
    const userBtn = document.getElementById('userBtn');
    const userModal = document.getElementById('userModal');

    if (userBtn && userModal) {
        userBtn.addEventListener('click', () => {
            userModal.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // Close user modal
    const closeUserModalBtn = document.getElementById('closeUserModal');
    if (closeUserModalBtn) {
        closeUserModalBtn.addEventListener('click', closeUserModal);
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = loginUser(email, password);
            if (result.success) {
                showNotification('Login successful!');
                closeUserModal();
                updateUserUI();
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            } else {
                alert(result.message);
            }
        });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userData = {
                name: document.getElementById('signupName').value,
                email: document.getElementById('signupEmail').value,
                phone: document.getElementById('signupPhone').value,
                password: document.getElementById('signupPassword').value
            };
            
            const result = registerUser(userData);
            if (result.success) {
                showNotification('Account created successfully!');
                closeUserModal();
                updateUserUI();
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            } else {
                alert(result.message);
            }
        });
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    }
}

// Close user modal
function closeUserModal() {
    const userModal = document.getElementById('userModal');
    const overlay = document.getElementById('overlay');
    if (userModal) userModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}
