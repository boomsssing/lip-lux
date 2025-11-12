// Track Order Page JavaScript

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
    setupTrackingForm();
    
    // Check if tracking code is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        document.getElementById('trackingCode').value = code;
        trackOrder(code);
    }
});

// Setup tracking form
function setupTrackingForm() {
    const trackForm = document.getElementById('trackForm');
    
    if (trackForm) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const trackingCode = document.getElementById('trackingCode').value.trim().toUpperCase();
            trackOrder(trackingCode);
        });
    }
}

// Get all orders from localStorage
function getOrders() {
    const saved = localStorage.getItem('liplux_orders');
    return saved ? JSON.parse(saved) : [];
}

// Track order
function trackOrder(code) {
    const orders = getOrders();
    const order = orders.find(o => o.code === code);

    const orderDetails = document.getElementById('orderDetails');
    const errorMessage = document.getElementById('errorMessage');

    if (order) {
        displayOrderDetails(order);
        orderDetails.style.display = 'block';
        errorMessage.style.display = 'none';
    } else {
        orderDetails.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// Display order details
function displayOrderDetails(order) {
    // Order info
    document.getElementById('displayOrderCode').textContent = order.code;
    document.getElementById('displayOrderDate').textContent = new Date(order.createdAt).toLocaleDateString();
    document.getElementById('displayCustomerName').textContent = order.customer.name;
    document.getElementById('displayCustomerPhone').textContent = order.customer.phone;
    document.getElementById('displayCustomerAddress').textContent = `${order.customer.address}, ${order.customer.city}`;

    // Order status
    const statusEl = document.getElementById('orderStatus');
    statusEl.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    statusEl.className = 'order-status';
    
    switch(order.status) {
        case 'pending':
            statusEl.style.background = '#f39c12';
            break;
        case 'processing':
            statusEl.style.background = '#3498db';
            break;
        case 'shipped':
            statusEl.style.background = '#9b59b6';
            break;
        case 'delivered':
            statusEl.style.background = '#2ecc71';
            break;
    }

    // Update timeline
    updateTimeline(order);

    // Display order items
    const orderItemsDiv = document.getElementById('displayOrderItems');
    orderItemsDiv.innerHTML = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #ecf0f1;">
            <div>
                <strong>${item.name}</strong><br>
                <span style="color: #95a5a6;">Quantity: ${item.quantity}</span>
            </div>
            <div style="font-weight: bold; color: #ff69b4;">
                GH₵ ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    // Display total
    document.getElementById('displayOrderTotal').textContent = `GH₵ ${order.total.toFixed(2)}`;
    
    // Display delivery image if available
    displayDeliveryImage(order);
}

// Display delivery image if order is delivered with photo
function displayDeliveryImage(order) {
    const deliveryImageContainer = document.getElementById('deliveryImageContainer');
    
    if (!deliveryImageContainer) return;
    
    if (order.status === 'delivered' && order.deliveryImage) {
        deliveryImageContainer.innerHTML = `
            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--white); border-radius: 12px; box-shadow: var(--shadow);">
                <h3 style="margin-bottom: 1rem; color: var(--dark); font-size: var(--fs-lg);">
                    <i class="fas fa-camera"></i> Delivery Photo
                </h3>
                <img src="${order.deliveryImage}" alt="Delivery Photo" 
                     style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; border: 2px solid var(--light);">
                <p style="margin-top: 0.5rem; color: var(--gray); font-size: var(--fs-xs); text-align: center;">
                    Photo taken on delivery
                </p>
            </div>
        `;
        deliveryImageContainer.style.display = 'block';
    } else {
        deliveryImageContainer.style.display = 'none';
    }
}

// Update timeline
function updateTimeline(order) {
    const timelineProcessing = document.getElementById('timelineProcessing');
    const timelineShipped = document.getElementById('timelineShipped');
    const timelineDelivered = document.getElementById('timelineDelivered');

    // Reset all
    [timelineProcessing, timelineShipped, timelineDelivered].forEach(el => {
        el.classList.remove('completed');
    });

    // Update based on status
    switch(order.status) {
        case 'delivered':
            timelineDelivered.classList.add('completed');
            // fall through
        case 'shipped':
            timelineShipped.classList.add('completed');
            // fall through
        case 'processing':
            timelineProcessing.classList.add('completed');
            break;
    }

    // Update status placed time
    if (order.timeline && order.timeline.placed) {
        document.getElementById('statusPlaced').textContent = 
            `Order placed on ${new Date(order.timeline.placed).toLocaleString()}`;
    }
}