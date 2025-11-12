// Main JavaScript for Homepage

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

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductsGrid();
    setupEventListeners();
    updateCartUI();
    initHeroSlideshow();
    
    // Initialize navbar as visible
    if (navbar) {
        navbar.classList.add('visible');
    }
});

// Hero slideshow functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Load products grid
function loadProductsGrid(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredProducts = getProductsByCategory(filter);
    
    grid.innerHTML = filteredProducts.map(product => {
        // Check if image is Base64, URL, or emoji
        let imageDisplay;
        if (product.image.startsWith('data:image') || product.image.startsWith('http')) {
            imageDisplay = `<img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            imageDisplay = product.image;
        }
        
        return `
            <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description.substring(0, 80)}...</p>
                    <div class="product-footer">
                        <span class="product-price">GH₵ ${product.price.toFixed(2)}</span>
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Product card clicks - use event delegation
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.addEventListener('click', function(e) {
            // Check if clicked on product card or its child (but not the add to cart button)
            const productCard = e.target.closest('.product-card');
            const addToCartBtn = e.target.closest('.btn-add-cart');
            
            if (productCard && !addToCartBtn) {
                const productId = parseInt(productCard.dataset.productId);
                if (productId) {
                    showProductDetails(productId);
                }
            } else if (addToCartBtn) {
                // Handle add to cart button click
                e.stopPropagation();
                const productId = parseInt(addToCartBtn.dataset.productId);
                if (productId) {
                    addToCart(productId);
                }
            }
        });
    }

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
            closeProductModal();
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

    // Verify identity form
    const verifyIdentityForm = document.getElementById('verifyIdentityForm');
    if (verifyIdentityForm) {
        verifyIdentityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVerifyIdentity();
        });
    }

    // Reset password form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleResetPassword();
        });
    }
}

// Show forgot password tab
function showForgotPassword() {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show forgot password tab
    document.getElementById('forgotPasswordTab').classList.add('active');
    
    // Reset forms
    document.getElementById('verifyIdentityForm').style.display = 'block';
    document.getElementById('resetPasswordForm').style.display = 'none';
    document.getElementById('verifyIdentityForm').reset();
}

// Back to login
function backToLogin() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('loginTab').classList.add('active');
}

// Handle verify identity
let recoveryUserId = null;

function handleVerifyIdentity() {
    const email = document.getElementById('recoveryEmail').value;
    const phone = document.getElementById('recoveryPhone').value;
    
    const result = verifyUserForRecovery(email, phone);
    
    if (result.success) {
        recoveryUserId = result.userId;
        // Show reset password form
        document.getElementById('verifyIdentityForm').style.display = 'none';
        document.getElementById('resetPasswordForm').style.display = 'block';
    } else {
        alert(result.message);
    }
}

// Handle reset password
function handleResetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    const result = resetPassword(recoveryUserId, newPassword);
    
    if (result.success) {
        alert('Password reset successfully! Please login with your new password.');
        recoveryUserId = null;
        backToLogin();
        document.getElementById('resetPasswordForm').reset();
    } else {
        alert(result.message);
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

// Show product details popup
function showProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !overlay) {
        console.error('Modal elements not found');
        return;
    }
    
    // Update modal content
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalCategory = document.getElementById('modalProductCategory');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalIngredients = document.getElementById('modalProductIngredients');
    const benefitsList = document.getElementById('modalProductBenefits');
    const addToCartBtn = document.getElementById('modalAddToCart');
    
    if (modalImage) modalImage.src = product.image;
    if (modalImage) modalImage.alt = product.name;
    if (modalName) modalName.textContent = product.name;
    if (modalCategory) modalCategory.textContent = product.category;
    if (modalPrice) modalPrice.textContent = `GH₵ ${product.price.toFixed(2)}`;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalIngredients) modalIngredients.textContent = product.ingredients;
    
    // Update benefits list
    if (benefitsList && product.benefits) {
        benefitsList.innerHTML = product.benefits.map(benefit => `<li>${benefit}</li>`).join('');
    }
    
    // Update add to cart button
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            addToCart(productId);
            closeProductModal();
        };
        addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> Add to Cart - GH₵ ${product.price.toFixed(2)}`;
    }
    
    // Show modal
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Close product details modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('overlay');
    
    if (modal) modal.classList.remove('active');
    
    // Only remove overlay if no other modals are open
    const userModal = document.getElementById('userModal');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (overlay && userModal && cartSidebar) {
        if (!userModal.classList.contains('active') && 
            !cartSidebar.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    } else if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
}