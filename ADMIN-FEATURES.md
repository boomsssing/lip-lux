# 🔐 Admin Portal - Complete Feature Guide

## 🎯 Quick Access

### How to Access Admin Portal:
1. **From Homepage:** Scroll to footer → Click shield icon (🛡️) in bottom-right corner
2. **Direct Link:** Open `admin.html` in your browser

### Login Credentials:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the password in `js/admin.js` for security!

---

## 🔴 LIVE Real-Time Features

### Auto-Refresh System
- **Frequency:** Every 30 seconds
- **What Updates:**
  - Dashboard statistics
  - Order lists
  - Customer data
- **Visual Indicator:** Green "LIVE" badge with blinking dot

### New Order Notifications
- **Pop-up alerts** when new orders arrive
- **Shows:** Number of new orders
- **Duration:** 5 seconds
- **Animation:** Slides in from right

### Last Updated Timestamp
- **Location:** Top-right of dashboard
- **Shows:** Exact time of last refresh
- **Format:** HH:MM:SS AM/PM

---

## 📊 Dashboard Features

### Statistics Cards
1. **Total Orders** - All orders ever placed (Pink)
2. **Pending Orders** - Awaiting processing (Purple)
3. **Out for Delivery** - Currently being shipped (Blue)
4. **Completed** - Successfully delivered (Green)

### Recent Orders Table
- Shows last 10 orders
- Displays:
  - Order code
  - Customer name
  - Order date
  - Total amount
  - Current status
  - Action buttons (View, Update)

---

## 📦 Orders Management

### View All Orders
- **Complete order list** with full details
- **Columns:**
  - Order Code
  - Customer Name
  - Phone Number
  - Delivery Address
  - Number of Items
  - Total Amount
  - Order Date
  - Status
  - Actions

### Filter & Search
- **Filter by Status:**
  - All Status
  - Pending
  - Processing
  - Shipped
  - Delivered

- **Search:** By order code or customer name/phone

### View Order Details
Click "View" button to see:
- **Customer Information:**
  - Full name
  - Phone number
  - Email (if provided)
  - Delivery address
  - Special notes

- **Order Items:**
  - Product names
  - Quantities
  - Individual prices
  - Subtotal

- **Payment Information:**
  - Payment method (MoMo provider)
  - Paid to: 0246780686 (Doris Agyakwaa Brown)
  - Customer's MoMo number
  - Customer's name
  - Transaction reference (if provided)

- **Order Summary:**
  - Subtotal
  - Delivery fee
  - Total amount

### Update Order Status
1. Click "Update" button on any order
2. System automatically advances to next status:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Delivered
3. Confirmation dialog appears
4. Status updates immediately

---

## 📦 Product Management

### View Products
- Grid display of all products
- Shows:
  - Product image (emoji)
  - Name
  - Category
  - Price
  - Stock level

### Add New Product
1. Click "Add Product" button
2. Fill in:
   - Product Name
   - Price (GH₵)
   - Category (Glossy/Matte/Shimmer)
   - Description
   - Image (emoji or URL)
   - Stock Quantity
3. Click "Save Product"

### Edit Product
1. Click "Edit" on product card
2. Modify any field
3. Click "Save Product"

### Delete Product
1. Click "Delete" on product card
2. Confirm deletion
3. Product removed from catalog

---

## 👥 Customer Management

### Customer Database
View all registered customers with:
- Full name
- Email address
- Phone number
- Number of orders placed
- Total amount spent
- Registration date

### Customer Insights
- Track repeat customers
- Identify top spenders
- Monitor customer growth

---

## 🔒 Security Features

### Secure Login
- Username and password required
- Session-based authentication
- Auto-logout on browser close

### Access Control
- Only logged-in admin can view dashboard
- Automatic redirect to login if not authenticated
- Session stored securely

---

## ⚙️ System Settings

### Auto-Refresh Control
- **Start:** Automatic on login
- **Stop:** Automatic on logout
- **Frequency:** 30 seconds (configurable in code)

### Notification Settings
- **New Orders:** Enabled by default
- **Duration:** 5 seconds
- **Position:** Top-right corner

---

## 💡 Best Practices

### Daily Routine
1. **Morning:**
   - Login to admin portal
   - Check dashboard for new orders
   - Verify MoMo payments
   - Update pending orders to "Processing"

2. **Throughout Day:**
   - Monitor real-time notifications
   - Update order statuses as you prepare items
   - Respond to customer inquiries

3. **End of Day:**
   - Review completed orders
   - Check inventory levels
   - Plan next day's deliveries

### Order Management Tips
1. **Verify Payment First**
   - Check MoMo account
   - Match transaction to order
   - Confirm amount is correct

2. **Update Status Promptly**
   - Keeps customers informed
   - Builds trust
   - Reduces inquiries

3. **Use Search Function**
   - Quick customer lookup
   - Find specific orders
   - Track order history

4. **Monitor Stock Levels**
   - Update product inventory
   - Mark out-of-stock items
   - Reorder popular products

---

## 🆘 Troubleshooting

### "Not seeing new orders?"
- Check if auto-refresh is working (look for LIVE badge)
- Manually refresh browser (F5)
- Verify orders exist in localStorage
- Check browser console for errors

### "Notifications not showing?"
- Ensure you're on Dashboard or Orders page
- Check if browser allows notifications
- Verify JavaScript is enabled

### "Can't login?"
- Verify username: `admin`
- Verify password: `admin123`
- Check caps lock is off
- Clear browser cache

### "Orders not updating?"
- Check internet connection
- Refresh browser
- Verify localStorage is enabled
- Check for JavaScript errors

---

## 🔧 Advanced Configuration

### Change Admin Password
Edit `js/admin.js` line 3-6:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'YOUR_NEW_PASSWORD'
};
```

### Change Auto-Refresh Interval
Edit `js/admin.js` line 65:
```javascript
}, 30000); // Change 30000 to desired milliseconds
```

### Disable Notifications
Edit `js/admin.js` line 165-167:
```javascript
// Comment out these lines:
// if (lastOrderCount > 0 && orders.length > lastOrderCount) {
//     showNewOrderNotification(orders.length - lastOrderCount);
// }
```

---

## 📱 Mobile Access

The admin portal works on mobile devices:
- Responsive design
- Touch-friendly buttons
- Scrollable tables
- Mobile-optimized layout

---

## 🎓 Training Resources

### For New Admins
1. Read this guide completely
2. Practice with test orders
3. Familiarize with all sections
4. Test order status updates
5. Try search and filter functions

### Quick Reference
- **View order:** Click "View" button
- **Update status:** Click "Update" button
- **Add product:** Click "Add Product"
- **Search:** Type in search box
- **Filter:** Select from dropdown

---

## 📞 Support

For technical issues:
- Check README.md for detailed documentation
- Review STORE-OWNER-GUIDE.md for workflow tips
- Contact your developer for code changes

---

**🎉 You now have a fully functional, real-time admin portal!**

**Monitor orders, manage products, and grow your business with ease! 💄✨**
