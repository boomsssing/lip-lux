# 📱 LipLux By Jay - Store Owner Quick Guide

## 🎯 How Your Payment System Works

### When a Customer Places an Order:

1. **Customer shops** and adds items to cart
2. **Customer fills delivery info** (name, phone, address)
3. **Payment page shows YOUR MoMo details:**
   - 📱 **MoMo Number:** 0246780686
   - 👤 **Name:** Doris Agyakwaa Brown
   - 📍 **Location:** New Legon
   - 💰 **Amount:** Automatically calculated (products + GH₵10 delivery)

4. **Customer sends money** to your number (0246780686)
5. **Customer confirms** by entering their details and clicking "Confirm Order"
6. **Order is created** with a unique tracking code (e.g., LL123456789)

---

## 👨‍💼 Admin Portal Access

### How to Access:
1. **From Homepage:** Scroll to footer, click the small shield icon (🛡️) in bottom-right
2. **Direct URL:** Open `admin.html` in browser

### Login Details:
- **Username:** `admin`
- **Password:** `admin123`

### 🔴 LIVE Real-Time Features:
- **Auto-refresh every 30 seconds** - Orders update automatically
- **New order notifications** - Pop-up alerts when new orders arrive
- **Live indicator** - Green "LIVE" badge shows system is active
- **Last updated timestamp** - See exactly when data was refreshed

### What You Can Do:

#### 📊 Dashboard
- See total orders, pending, shipped, delivered
- View recent orders at a glance

#### 📦 Orders Management
- **View all orders** with customer details
- **See payment info:** Customer's number, name, transaction reference
- **Update order status:** 
  - Pending → Processing → Shipped → Delivered
- **Search orders** by code or customer name
- **Filter by status**

#### 📦 Product Management
- Add new lip gloss products
- Edit existing products (price, stock, description)
- Delete products

#### 👥 Customer Database
- View all registered customers
- See their order history
- Track total spending

---

## 💰 Checking Payments

### When You Receive a MoMo Payment:

1. **Check your MoMo account** for incoming payment
2. **Login to admin portal** (`admin.html`)
3. **Go to Orders section**
4. **Find the order** (use search or filter)
5. **Click "View"** to see full details including:
   - Customer's MoMo number (they paid from)
   - Customer's name
   - Transaction reference (if provided)
   - Amount paid
   - Delivery address

6. **Verify payment matches** the order total
7. **Update order status:**
   - Click "Update" button
   - Status will change: Pending → Processing → Shipped → Delivered

---

## 📋 Daily Workflow

### Morning:
1. Login to admin portal
2. Check dashboard for new orders
3. Verify MoMo payments received
4. Update pending orders to "Processing"

### During Day:
1. Prepare orders (pack lip glosses)
2. Update status to "Shipped" when ready for delivery
3. Respond to customer inquiries (they can track with their code)

### After Delivery:
1. Update order status to "Delivered"
2. Order is complete!

---

## 🔍 Customer Order Tracking

Customers can track their orders at `track-order.html`:
- They enter their tracking code (e.g., LL123456789)
- They see:
  - Order status
  - Delivery address
  - Items ordered
  - Timeline (Placed → Processing → Shipped → Delivered)

---

## ⚙️ Important Settings

### Your MoMo Details (Currently Set):
- **Number:** 0246780686
- **Name:** Doris Agyakwaa Brown
- **Location:** New Legon

### Delivery Fee:
- Currently set to **GH₵ 10.00**
- To change: Edit `js/checkout.js` line 3

### Admin Password:
- Currently: `admin123`
- **IMPORTANT:** Change this in `js/admin.js` for security!

---

## 📱 Customer Support

When customers contact you:

1. **Ask for their tracking code** (e.g., LL123456789)
2. **Search in admin portal** to find their order
3. **View full order details** to help them
4. **Update status** if needed

---

## ✅ Tips for Success

1. **Check MoMo regularly** - Don't miss payments
2. **Update order status promptly** - Keeps customers informed
3. **Keep stock updated** - Edit products when running low
4. **Respond quickly** - Happy customers return!
5. **Track your sales** - Use customer database to see trends

---

## 🆘 Common Issues

### "Customer says they paid but I don't see it"
- Check your MoMo account first
- Ask customer for transaction reference
- Check order details in admin portal
- Verify the amount matches

### "How do I change my MoMo number?"
- See README.md "Change Store Owner MoMo Details" section
- Edit `checkout.html` and `js/checkout.js`

### "Customer lost their tracking code"
- Search by their name or phone in admin portal
- Find their order and give them the code

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- All files are in the `lip lux` folder
- Contact your developer for technical issues

---

**🎉 You're all set! Start selling those beautiful lip glosses! 💄✨**
