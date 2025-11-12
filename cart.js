// Shopping Cart Management
let cart = [];

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('liplux_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('liplux_cart', JSON.stringify(cart));
    updateCartUI();
}

// Add item to cart with color selection
function addToCart(productId, selectedColor = null) {
    const product = getProductById(productId);
    if (!product) return;

    // If product has colors but no color selected, show color selection modal
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        showColorSelectionModal(product);
        return;
    }

    // Use first color as default if no color specified
    const color = selectedColor || (product.colors && product.colors[0]) || null;
    
    // Create unique identifier for product + color combination
    const itemKey = color ? `${productId}_${color.name}` : productId;
    
    const existingItem = cart.find(item => item.itemKey === itemKey);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            itemKey: itemKey,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            selectedColor: color
        });
    }

    saveCart();
    showNotification(`Added ${product.name}${color ? ` (${color.name})` : ''} to cart!`);
}

// Remove item from cart
function removeFromCart(itemKey) {
    cart = cart.filter(item => item.itemKey !== itemKey);
    saveCart();
}

// Update item quantity
function updateQuantity(itemKey, change) {
    const item = cart.find(item => item.itemKey === itemKey);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemKey);
    } else {
        saveCart();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart UI
function updateCartUI() {
    // Update cart count badge
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        const count = getCartCount();
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update cart items
    const cartItemsEl = document.getElementById('cartItems');
    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Your cart is empty</p></div>';
    } else {
        cartItemsEl.innerHTML = cart.map(item => {
            // Handle different image types - always create img tag for proper display
            let imageSrc = item.image;
            let imageDisplay;
            
            if (imageSrc.startsWith('data:image') || imageSrc.startsWith('http')) {
                // Base64 or URL image
                imageDisplay = `<img src="${imageSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            } else if (imageSrc.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                // Regular image filename
                imageDisplay = `<img src="${imageSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            } else {
                // Emoji or other non-image content
                imageDisplay = `<div style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${imageSrc}</div>`;
            }
            
            const colorInfo = item.selectedColor ? 
                `<div class="cart-item-color">
                    <span class="color-dot" style="background-color: ${item.selectedColor.hex}"></span>
                    ${item.selectedColor.name}
                </div>` : '';
            
            return `
                <div class="cart-item">
                    <div class="cart-item-image">${imageDisplay}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        ${colorInfo}
                        <div class="cart-item-price">GH₵ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateQuantity('${item.itemKey}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.itemKey}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.itemKey}')" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Update cart total
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        cartTotalEl.textContent = `GH₵ ${getCartTotal().toFixed(2)}`;
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show color selection modal
function showColorSelectionModal(product) {
    const modal = document.createElement('div');
    modal.className = 'color-selection-modal';
    modal.innerHTML = `
        <div class="color-modal-content">
            <div class="color-modal-header">
                <h3>Choose Color for ${product.name}</h3>
                <button class="close-modal" onclick="closeColorModal()">&times;</button>
            </div>
            <div class="color-options">
                ${product.colors.map(color => `
                    <div class="color-option" onclick="selectColor(${product.id}, '${color.name}', '${color.hex}', ${color.stock})">
                        <div class="color-preview" style="background-color: ${color.hex}"></div>
                        <div class="color-info">
                            <div class="color-name">${color.name}</div>
                            <div class="color-stock">${color.stock} in stock</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="color-modal-overlay" onclick="closeColorModal()"></div>
    `;
    
    document.body.appendChild(modal);
}

// Close color selection modal
function closeColorModal() {
    const modal = document.querySelector('.color-selection-modal');
    if (modal) {
        modal.remove();
    }
}

// Select color and add to cart
function selectColor(productId, colorName, colorHex, colorStock) {
    const selectedColor = { name: colorName, hex: colorHex, stock: colorStock };
    closeColorModal();
    addToCart(productId, selectedColor);
}

// Initialize cart
loadCart();
