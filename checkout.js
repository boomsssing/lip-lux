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
            } else if (item.image.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                // Regular image file
                imageDisplay = `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            } else {
                imageDisplay = `<div style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${item.image}</div>`;
            }
            
            const colorInfo = item.selectedColor ? 
                `<div style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${item.selectedColor.hex}; margin-right: 0.5rem; border: 1px solid #ddd;"></span>
                    ${item.selectedColor.name}
                </div>` : '';
            
            return `
                <div class="summary-item">
                    <div class="summary-item-image">${imageDisplay}</div>
                    <div class="summary-item-info">
                        <div><strong>${item.name}</strong></div>
                        ${colorInfo}
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

    // Validate required fields
    if (!momoNumber || !momoName) {
        showPaymentError('Please fill in all required payment details');
        return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+233|0)[2-9][0-9]{8}$/;
    if (!phoneRegex.test(momoNumber.replace(/\s/g, ''))) {
        showPaymentError('Please enter a valid Ghana mobile number');
        return;
    }

    // Confirm payment was made
    const totalAmount = (getCartTotal() + DELIVERY_FEE).toFixed(2);
    const confirmed = confirm(
        'Please confirm that you have sent GH₵ ' + totalAmount + 
        ' to 0246780686 (Doris Agyakwaa Brown) via Mobile Money.\n\n' +
        'Click OK to confirm and place your order.'
    );

    if (!confirmed) {
        return;
    }

    // Get the button and show loading state
    const btn = event.target;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Processing...';

    // Add loading spinner
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Show processing status
    showProcessingStatus('Validating payment details...');

    // Set timeout protection (30 seconds max)
    const timeoutId = setTimeout(() => {
        resetPaymentButton(btn, originalText);
        hideProcessingStatus();
        showPaymentError('Payment processing timed out. Please try again.');
    }, 30000);

    try {
        // Simulate payment processing with better error handling
        processPaymentAsync()
            .then((order) => {
                clearTimeout(timeoutId);
                hideProcessingStatus();
                
                // Save order
                saveOrder(order);

                // Clear cart
                clearCart();

                // Show confirmation
                showConfirmation(order);

                // Reset button
                resetPaymentButton(btn, originalText);
                
                // Show success message
                showPaymentSuccess('Order placed successfully!');
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                hideProcessingStatus();
                resetPaymentButton(btn, originalText);
                showPaymentError(error.message || 'Payment processing failed. Please try again.');
                console.error('Payment processing error:', error);
            });
    } catch (error) {
        clearTimeout(timeoutId);
        resetPaymentButton(btn, originalText);
        showPaymentError('An unexpected error occurred. Please try again.');
        console.error('Payment processing error:', error);
    }
}

// Async payment processing function with progress tracking
function processPaymentAsync() {
    return new Promise((resolve, reject) => {
        let step = 0;
        const steps = [
            'Verifying payment information...',
            'Processing transaction...',
            'Generating order details...',
            'Finalizing order...'
        ];
        
        function nextStep() {
            if (step < steps.length) {
                if (step === 0) {
                    showProcessingStatus(steps[step]);
                } else {
                    updateProcessingStatus(steps[step]);
                }
                step++;
                setTimeout(nextStep, 800 + Math.random() * 400); // 800-1200ms per step
            } else {
                completeProcessing();
            }
        }
        
        function completeProcessing() {
            try {
                // Get customer data
                const customerData = JSON.parse(sessionStorage.getItem('checkout_customer'));
                
                if (!customerData) {
                    reject(new Error('Customer information not found. Please go back and fill in your details.'));
                    return;
                }

                // Generate order code
                const orderCode = generateOrderCode();
                
                // Get form values
                const momoNumber = document.getElementById('momoNumber').value;
                const momoName = document.getElementById('momoName').value;
                const momoReference = document.getElementById('momoReference').value;

                // Enhance customer data with user ID if logged in
                if (typeof currentUser !== 'undefined' && currentUser && !currentUser.guest) {
                    customerData.userId = currentUser.id;
                    customerData.email = currentUser.email;
                    customerData.phone = currentUser.phone;
                }

                // Validate cart
                if (!cart || cart.length === 0) {
                    reject(new Error('Your cart is empty. Please add items before checkout.'));
                    return;
                }

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

                // Simulate random failure (2% chance for testing)
                if (Math.random() < 0.02) {
                    reject(new Error('Payment verification failed. Please check your payment details and try again.'));
                    return;
                }

                updateProcessingStatus('Order created successfully!');
                setTimeout(() => resolve(order), 500);
            } catch (error) {
                reject(error);
            }
        }
        
        // Start processing
        nextStep();
    });
}

// Reset payment button to original state
function resetPaymentButton(btn, originalText) {
    btn.disabled = false;
    btn.textContent = originalText;
    btn.innerHTML = originalText;
}

// Show payment error message with retry option
function showPaymentError(message, showRetry = true) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.payment-notification');
    existingNotifications.forEach(n => n.remove());

    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'payment-notification error';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s;
    `;
    
    const retryButton = showRetry ? `
        <button onclick="retryPayment()" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        ">
            <i class="fas fa-redo"></i> Try Again
        </button>
    ` : '';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: ${showRetry ? '0.5rem' : '0'};">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
        ${retryButton}
    `;
    document.body.appendChild(notification);

    // Remove after 8 seconds (longer for retry option)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 8000);
}

// Retry payment function
function retryPayment() {
    // Remove notification
    const existingNotifications = document.querySelectorAll('.payment-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Trigger payment process again
    processPayment();
}

// Show payment success message
function showPaymentSuccess(message) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.payment-notification');
    existingNotifications.forEach(n => n.remove());

    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'payment-notification success';
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
        max-width: 400px;
        animation: slideIn 0.3s;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show processing status
function showProcessingStatus(message) {
    // Remove existing status
    hideProcessingStatus();
    
    // Create processing status overlay
    const statusOverlay = document.createElement('div');
    statusOverlay.id = 'processingStatus';
    statusOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 15000;
        animation: fadeIn 0.3s ease;
    `;
    
    statusOverlay.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            margin: 0 1rem;
        ">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #ff69b4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <h3 style="
                margin-bottom: 0.5rem;
                color: #2c3e50;
                font-family: var(--font-heading);
            ">Processing Payment</h3>
            <p style="
                color: #7f8c8d;
                margin: 0;
                font-size: 0.95rem;
            " id="statusMessage">${message}</p>
        </div>
    `;
    
    document.body.appendChild(statusOverlay);
}

// Update processing status message
function updateProcessingStatus(message) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = message;
    }
}

// Hide processing status
function hideProcessingStatus() {
    const statusOverlay = document.getElementById('processingStatus');
    if (statusOverlay) {
        statusOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (statusOverlay.parentNode) {
                statusOverlay.remove();
            }
        }, 300);
    }
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
            ${order.items.map(item => {
                const colorInfo = item.selectedColor ? ` (${item.selectedColor.name})` : '';
                return `
                    <div style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">
                        ${item.name}${colorInfo} × ${item.quantity} - GH₵ ${(item.price * item.quantity).toFixed(2)}
                    </div>
                `;
            }).join('')}
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

// Test function to verify payment processing works
function testPaymentFlow() {
    console.log('Testing payment flow...');
    
    // Mock cart data
    if (!window.cart || cart.length === 0) {
        window.cart = [
            {
                id: 1,
                itemKey: '1_test',
                name: 'Test Lipstick',
                price: 25.00,
                image: '💄',
                quantity: 1,
                selectedColor: { name: 'Red', hex: '#ff0000', stock: 10 }
            }
        ];
        console.log('Mock cart created:', cart);
    }
    
    // Mock customer data
    sessionStorage.setItem('checkout_customer', JSON.stringify({
        name: 'Test Customer',
        phone: '0241234567',
        email: 'test@example.com',
        address: 'Test Address',
        city: 'Accra',
        notes: 'Test order'
    }));
    
    // Mock form values
    const momoNumberInput = document.getElementById('momoNumber');
    const momoNameInput = document.getElementById('momoName');
    
    if (momoNumberInput) momoNumberInput.value = '0241234567';
    if (momoNameInput) momoNameInput.value = 'Test Customer';
    
    console.log('Test data prepared. Payment flow should work now.');
    return true;
}

// Add to window for testing
window.testPaymentFlow = testPaymentFlow;