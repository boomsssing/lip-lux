# LipLux By Jay - E-Commerce Website

A complete e-commerce website for selling lip glosses in Ghana with mobile money payment integration, order tracking, and admin portal.

## Features

### Customer Features
- 🛍️ **Product Catalog** - Browse beautiful lip gloss collection with filtering
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities
- 👤 **User Authentication** - Sign up, login, or continue as guest
- 💳 **Mobile Money Payment** - MTN MoMo, Vodafone Cash, AirtelTigo Money
- 📦 **Order Tracking** - Track orders with unique codes
- 📱 **Responsive Design** - Works on all devices

### Admin Features
- 📊 **Dashboard** - Overview of orders and statistics
- 🔴 **Real-Time Updates** - Auto-refresh every 30 seconds
- 🔔 **New Order Alerts** - Instant notifications for new orders
- 📋 **Order Management** - View all orders, update status, search/filter
- 📦 **Product Management** - Add, edit, delete products
- 👥 **Customer Management** - View registered customers and their orders
- 🔐 **Secure Login** - Protected admin portal
- ⏰ **Last Updated Timestamp** - Track when data was refreshed

## File Structure

```
lip lux/
├── index.html              # Homepage
├── checkout.html           # Checkout page
├── track-order.html        # Order tracking page
├── admin.html              # Admin portal
├── css/
│   └── style.css          # All styles
├── js/
│   ├── products.js        # Product data and management
│   ├── cart.js            # Shopping cart functionality
│   ├── auth.js            # User authentication
│   ├── main.js            # Homepage functionality
│   ├── checkout.js        # Checkout process
│   ├── track-order.js     # Order tracking
│   └── admin.js           # Admin portal functionality
└── 34D5AF78-54DE-4B62-B538-7C3E2FC51EE6.png  # Logo

```

## Getting Started

1. **Open the website**
   - Simply open `index.html` in a web browser
   - No server required - works with local file system

2. **Browse Products**
   - View all lip gloss products on the homepage
   - Filter by category (Glossy, Matte, Shimmer)
   - Add items to cart

3. **Checkout**
   - Click cart icon to view items
   - Click "Proceed to Checkout"
   - Fill in delivery information
   - Select Mobile Money provider
   - Complete payment

4. **Track Order**
   - After checkout, you'll receive a unique tracking code (e.g., LL123456789)
   - Use this code on the "Track Order" page
   - View order status and delivery progress

## Admin Portal

### Access Admin
- **From Homepage:** Click the shield icon (🛡️) in the footer (bottom-right)
- **Direct URL:** `admin.html`
- **Username:** admin
- **Password:** admin123

### Real-Time Features
- ✅ **Auto-refresh** - Updates every 30 seconds automatically
- ✅ **Live notifications** - Pop-up alerts for new orders
- ✅ **Live indicator** - Green "LIVE" badge in navigation
- ✅ **Timestamp** - Shows last update time

### Admin Functions

1. **Dashboard**
   - View total orders, pending, shipped, and completed
   - See recent orders at a glance

2. **Orders Management**
   - View all orders with customer details
   - Filter by status (pending, processing, shipped, delivered)
   - Search by order code or customer name
   - Update order status
   - View detailed order information

3. **Products Management**
   - Add new products
   - Edit existing products
   - Delete products
   - Manage stock levels

4. **Customers**
   - View all registered customers
   - See order history and total spent

## Order Status Flow

1. **Pending** - Order placed, payment processing
2. **Processing** - Order confirmed, being prepared
3. **Shipped** - Out for delivery
4. **Delivered** - Order completed

## Payment Process

### How Customers Pay:

1. **Add items to cart** and proceed to checkout
2. **Fill delivery information** (name, phone, address, etc.)
3. **Payment page displays store owner's MoMo details:**
   - **MoMo Number:** 0246780686
   - **Account Name:** Doris Agyakwaa Brown
   - **Location:** New Legon
   - **Amount to Pay:** (Automatically calculated)

4. **Customer sends payment** via their Mobile Money:
   - Dial *170# (MTN), *110# (Vodafone), or their provider's code
   - Send money to: 0246780686
   - Enter the amount shown

5. **After payment, customer:**
   - Enters their phone number (that they paid from)
   - Enters their name
   - Optionally enters transaction reference
   - Clicks "Confirm Order"

6. **Order is placed** and customer receives tracking code

### Supported Mobile Money Providers:
- MTN MoMo
- Vodafone Cash
- AirtelTigo Money

## Data Storage

All data is stored in browser's localStorage:
- `liplux_products` - Product catalog
- `liplux_cart` - Shopping cart items
- `liplux_user` - Current logged-in user
- `liplux_users` - All registered users
- `liplux_orders` - All orders

## Customization

### Add New Products
1. Login to admin portal
2. Go to Products section
3. Click "Add Product"
4. Fill in product details
5. Save

### Update Logo
Replace `34D5AF78-54DE-4B62-B538-7C3E2FC51EE6.png` with your logo

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary: #ff69b4;      /* Main pink color */
    --primary-dark: #e91e63; /* Darker pink */
    --secondary: #9b59b6;    /* Purple accent */
}
```

### Modify Delivery Fee
Edit in `js/checkout.js`:
```javascript
const DELIVERY_FEE = 10.00; // Change amount here
```

### Change Store Owner MoMo Details
Edit in `checkout.html` (around line 90-100):
```html
<div class="momo-info-item">
    <span class="momo-label">MoMo Number:</span>
    <span class="momo-value">0246780686</span> <!-- Change number -->
</div>
<div class="momo-info-item">
    <span class="momo-label">Account Name:</span>
    <span class="momo-value">Doris Agyakwaa Brown</span> <!-- Change name -->
</div>
<div class="momo-info-item">
    <span class="momo-label">Location:</span>
    <span class="momo-value">New Legon</span> <!-- Change location -->
</div>
```

Also update in `js/checkout.js` (around line 180-182):
```javascript
paidTo: '0246780686',
paidToName: 'Doris Agyakwaa Brown'
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Security Notes

⚠️ **Important:** This is a frontend-only demo. For production use:
- Implement proper backend server
- Use secure payment gateway API
- Add SSL certificate
- Implement proper authentication
- Store data in database
- Add input validation and sanitization

## Support

For issues or questions, contact the developer.

## License

© 2024 LipLux By Jay. All rights reserved.

---

**Made with ❤️ for LipLux By Jay**
