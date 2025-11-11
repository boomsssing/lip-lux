// Checkout Page JavaScript

let selectedMomoProvider = 'mtn';
const DELIVERY_FEE = 10.00;

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
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'index.html';
        return;
    }

    loadOrderSummary();
    setupCheckoutListeners();
    prefillUserData();
});

// Prefill user data if logged in
function prefillUserData() {
    if (currentUser && !currentUser.guest) {
        document.getElementById('customerName').value = currentUser.name || '';
        document.getElementById('customerEmail').value = currentUser.email || '';
        document.getElementById('customerPhone').value = currentUser.phone || '';
    }
}

// Load order summary
function loadOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDelivery = document.getElementById('summaryDelivery');
    const summaryTotal = document.getElementById('summaryTotal');

    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => {
            // Handle different image types
            let imageDisplay;
            if (item.image.startsWith('data:image') || item.image.startsWith('http')) {
                imageDisplay = `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            } else {
                imageDisplay = item.image; // Emoji
            }
            
            return `
                <div class="summary-item">
                    <div class="summary-item-image">${imageDisplay}</div>
                    <div class="summary-item-info">
                        <div><strong>${item.name}</strong></div>
                        <div>Qty: ${item.quantity} × GH₵ ${item.price.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const subtotal = getCartTotal();
    const total = subtotal + DELIVERY_FEE;

    if (summarySubtotal) summarySubtotal.textContent = `GH₵ ${subtotal.toFixed(2)}`;
    if (summaryDelivery) summaryDelivery.textContent = `GH₵ ${DELIVERY_FEE.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `GH₵ ${total.toFixed(2)}`;
}

// Setup checkout listeners
function setupCheckoutListeners() {
    // MoMo provider selection
    const momoBtns = document.querySelectorAll('.momo-btn');
    momoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            momoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedMomoProvider = this.dataset.provider;
        });
    });

    // Update checkout steps display
    updateStepDisplay(1);
}

// Update step display
function updateStepDisplay(stepNumber) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update step content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// Go to payment step
function goToPayment() {
    const form = document.getElementById('checkoutForm');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const customerData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        city: document.getElementById('customerCity').value,
        notes: document.getElementById('orderNotes').value
    };

    // Save to session
    sessionStorage.setItem('checkout_customer', JSON.stringify(customerData));

    // Go to step 2
    updateStepDisplay(2);
    
    // Display payment amount
    const total = getCartTotal() + DELIVERY_FEE;
    const paymentAmountEl = document.getElementById('paymentAmount');
    if (paymentAmountEl) {
        paymentAmountEl.textContent = `GH₵ ${total.toFixed(2)}`;
    }
    
    window.scrollTo(0, 0);
}

// Back to info
function backToInfo() {
    updateStepDisplay(1);
    window.scrollTo(0, 0);
}

// Process payment
function processPayment() {
    const momoNumber = document.getElementById('momoNumber').value;
    const momoName = document.getElementById('momoName').value;
    const momoReference = document.getElementById('momoReference').value;

    if (!momoNumber || !momoName) {
        alert('Please fill in all required payment details');
        return;
    }

    // Confirm payment was made
    const confirmed = confirm(
        'Please confirm that you have sent GH₵ ' + (getCartTotal() + DELIVERY_FEE).toFixed(2) + 
        ' to 0246780686 (Doris Agyakwaa Brown) via Mobile Money.\n\n' +
        'Click OK to confirm and place your order.'
    );

    if (!confirmed) {
        return;
    }

    // Show loading
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Processing...';

    // Simulate payment processing
    setTimeout(() => {
        // Generate order code
        const orderCode = generateOrderCode();
        
        // Get customer data
        const customerData = JSON.parse(sessionStorage.getItem('checkout_customer'));
        
        // Create order
        const order = {
            code: orderCode,
            customer: customerData,
            items: [...cart],
            subtotal: getCartTotal(),
            delivery: DELIVERY_FEE,
            total: getCartTotal() + DELIVERY_FEE,
            payment: {
                method: 'momo',
                provider: selectedMomoProvider,
                customerNumber: momoNumber,
                customerName: momoName,
                reference: momoReference || 'N/A',
                paidTo: '0246780686',
                paidToName: 'Doris Agyakwaa Brown'
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            timeline: {
                placed: new Date().toISOString()
            }
        };

        // Save order
        saveOrder(order);

        // Clear cart
        clearCart();

        // Show confirmation
        showConfirmation(order);

        btn.disabled = false;
        btn.textContent = 'Confirm Order';
    }, 2000);
}

// Generate unique order code
function generateOrderCode() {
    const prefix = 'LL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Save order
function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('liplux_orders', JSON.stringify(orders));
}

// Get all orders
function getOrders() {
    const saved = localStorage.getItem('liplux_orders');
    return saved ? JSON.parse(saved) : [];
}

// Show confirmation
function showConfirmation(order) {
    updateStepDisplay(3);
    window.scrollTo(0, 0);

    // Display order code
    document.getElementById('orderCode').textContent = order.code;

    // Display order summary
    const confirmationSummary = document.getElementById('confirmationSummary');
    confirmationSummary.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Delivery Address:</strong><br>
            ${order.customer.address}, ${order.customer.city}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Items:</strong>
            ${order.items.map(item => `
                <div style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">
                    ${item.name} × ${item.quantity} - GH₵ ${(item.price * item.quantity).toFixed(2)}
                </div>
            `).join('')}
        </div>
        <div style="font-size: 1.2rem; font-weight: bold; color: #ff69b4; margin-top: 1rem;">
            Total: GH₵ ${order.total.toFixed(2)}
        </div>
    `;

    // Clear session data
    sessionStorage.removeItem('checkout_customer');
}

// Track this order - redirect to track page with order code
function trackThisOrder() {
    const orderCode = document.getElementById('orderCode').textContent;
    if (orderCode && orderCode !== 'LOADING...') {
        window.location.href = `track-order.html?code=${orderCode}`;
    }
}
