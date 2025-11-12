const products = [];

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Save products to localStorage (for admin updates)
function saveProducts() {
    localStorage.setItem('liplux_products', JSON.stringify(products));
}

// Load products from localStorage
function loadProducts() {
    const saved = localStorage.getItem('liplux_products');
    if (saved) {
        const savedProducts = JSON.parse(saved);
        products.length = 0;
        products.push(...savedProducts);
    }
}

// Initialize products with your 7 specified products
function initializeYourProducts() {
    const yourProducts = [
        {
            id: 1,
            name: "Cherry Kiss",
            price: 70.00,
            category: "glossy",
            description: "Classic cherry red with glossy finish",
            image: "MG6878.jpg",
            stock: 25,
            ingredients: "Vitamin E, Cherry Extract",
            benefits: ["Classic red appeal", "High-shine finish"],
            colors: [
                { name: "Classic Red", hex: "#DC143C", stock: 25 },
                { name: "Deep Cherry", hex: "#B22222", stock: 20 },
                { name: "Bright Red", hex: "#FF0000", stock: 18 }
            ]
        },
        {
            id: 2,
            name: "Mauve Magic",
            price: 70.00,
            category: "matte",
            description: "Sophisticated mauve with matte finish",
            image: "MG6875.jpg",
            stock: 20,
            ingredients: "Vitamin E, Rosehip Oil",
            benefits: ["Professional look", "Long-lasting wear"],
            colors: [
                { name: "Classic Mauve", hex: "#915F6D", stock: 20 },
                { name: "Deep Plum", hex: "#673147", stock: 15 },
                { name: "Soft Mauve", hex: "#B19CD9", stock: 22 }
            ]
        },
        {
            id: 3,
            name: "Rose Petal",
            price: 70.00,
            category: "glossy",
            description: "Delicate rose pink with glossy finish",
            image: "65270439-191B-4110-B2C6-9BF82BC283BC.jpg",
            stock: 30,
            ingredients: "Vitamin E, Rose Oil",
            benefits: ["Natural color", "Hydrating formula"],
            colors: [
                { name: "Soft Pink", hex: "#FFB6C1", stock: 30 },
                { name: "Rose Gold", hex: "#E8B4B8", stock: 25 },
                { name: "Dusty Rose", hex: "#D4A5A5", stock: 20 }
            ]
        },
        {
            id: 4,
            name: "Nude Elegance",
            price: 70.00,
            category: "matte",
            description: "Perfect nude shade for everyday elegance",
            image: "C4D2F5EE-6E4D-4C78-BECF-1034A44A9CFB.jpg",
            stock: 25,
            ingredients: "Vitamin E, Shea Butter",
            benefits: ["All-day wear", "Comfortable finish"],
            colors: [
                { name: "Classic Nude", hex: "#D2B48C", stock: 25 },
                { name: "Warm Beige", hex: "#F5DEB3", stock: 20 },
                { name: "Cool Taupe", hex: "#B8860B", stock: 18 }
            ]
        },
        {
            id: 5,
            name: "Coral Dream",
            price: 70.00,
            category: "glossy",
            description: "Vibrant coral shade perfect for summer",
            image: "DF736709-9F1E-41B9-841F-0BA4F847B0E6.jpg",
            stock: 22,
            ingredients: "Vitamin E, Coconut Oil",
            benefits: ["Brightening effect", "Summer-ready color"],
            colors: [
                { name: "Bright Coral", hex: "#FF7F50", stock: 22 },
                { name: "Peach Coral", hex: "#FFAB91", stock: 18 },
                { name: "Orange Coral", hex: "#FF6347", stock: 15 }
            ]
        },
        {
            id: 6,
            name: "Berry Bliss",
            price: 70.00,
            category: "matte",
            description: "Rich berry shade with matte finish",
            image: "Screenshot 2025-11-12 141543.png",
            stock: 18,
            ingredients: "Vitamin E, Berry Extract",
            benefits: ["Bold color impact", "Long-lasting wear"],
            colors: [
                { name: "Deep Berry", hex: "#8B0000", stock: 18 },
                { name: "Wine Berry", hex: "#722F37", stock: 15 },
                { name: "Raspberry", hex: "#E30B5C", stock: 20 }
            ]
        },
        {
            id: 7,
            name: "Sunset Glow",
            price: 70.00,
            category: "shimmer",
            description: "Warm peachy-orange with subtle shimmer",
            image: "Screenshot 2025-11-12 141613.png",
            stock: 20,
            ingredients: "Vitamin E, Peach Extract",
            benefits: ["Warm glow", "Shimmer effect"],
            colors: [
                { name: "Golden Peach", hex: "#FFCBA4", stock: 20 },
                { name: "Sunset Orange", hex: "#FF8C69", stock: 18 },
                { name: "Copper Glow", hex: "#B87333", stock: 15 }
            ]
        },
        {
            id: 8,
            name: "Pink Print",
            price: 70.00,
            category: "glossy",
            description: "Vibrant pink with stunning glossy finish",
            image: "PHOTO-2025-11-12-22-05-06 (1).jpg",
            stock: 25,
            ingredients: "Vitamin E, Pink Pigments",
            benefits: ["Bold pink statement", "High-shine finish"],
            colors: [
                { name: "Hot Pink", hex: "#FF1493", stock: 25 },
                { name: "Bubblegum Pink", hex: "#FF69B4", stock: 20 },
                { name: "Fuchsia", hex: "#FF00FF", stock: 18 }
            ]
        },
        {
            id: 9,
            name: "Hot Coco",
            price: 70.00,
            category: "matte",
            description: "Rich chocolate brown with matte finish",
            image: "PHOTO-2025-11-12-22-05-06.jpg",
            stock: 20,
            ingredients: "Vitamin E, Cocoa Extract",
            benefits: ["Warm brown tone", "Long-lasting matte"],
            colors: [
                { name: "Milk Chocolate", hex: "#8B4513", stock: 20 },
                { name: "Dark Chocolate", hex: "#654321", stock: 18 },
                { name: "Cocoa Brown", hex: "#A0522D", stock: 15 }
            ]
        },
        {
            id: 10,
            name: "Love Potion",
            price: 70.00,
            category: "shimmer",
            description: "Magical shimmer with enchanting finish",
            image: "PHOTO-2025-11-12-22-05-07 (1).jpg",
            stock: 22,
            ingredients: "Vitamin E, Shimmer Particles",
            benefits: ["Magical shimmer", "Enchanting glow"],
            colors: [
                { name: "Mystic Purple", hex: "#9932CC", stock: 22 },
                { name: "Love Pink", hex: "#FF1493", stock: 20 },
                { name: "Magic Mauve", hex: "#DDA0DD", stock: 18 }
            ]
        },
        {
            id: 11,
            name: "Lovely",
            price: 70.00,
            category: "glossy",
            description: "Sweet and lovely with perfect glossy shine",
            image: "PHOTO-2025-11-12-22-05-07.jpg",
            stock: 28,
            ingredients: "Vitamin E, Sweet Extracts",
            benefits: ["Sweet finish", "Lovely shine"],
            colors: [
                { name: "Sweet Pink", hex: "#FFB6C1", stock: 28 },
                { name: "Lovely Rose", hex: "#FF69B4", stock: 25 },
                { name: "Candy Pink", hex: "#FF1493", stock: 20 }
            ]
        },
        {
            id: 12,
            name: "Charm Socks",
            price: 150.00,
            category: "accessories",
            description: "Stylish charm socks - perfect accessory",
            image: "PHOTO-2025-11-12-22-05-08 (1).jpg",
            stock: 15,
            ingredients: "Premium Cotton Blend",
            benefits: ["Comfortable fit", "Stylish design"],
            colors: [
                { name: "Classic White", hex: "#FFFFFF", stock: 15 },
                { name: "Soft Pink", hex: "#FFB6C1", stock: 12 },
                { name: "Charcoal", hex: "#36454F", stock: 10 }
            ]
        },
        {
            id: 13,
            name: "Lip Musk",
            price: 70.00,
            category: "matte",
            description: "Sophisticated musk-inspired matte finish",
            image: "PHOTO-2025-11-12-22-05-08.jpg",
            stock: 20,
            ingredients: "Vitamin E, Musk Essence",
            benefits: ["Sophisticated scent", "Matte perfection"],
            colors: [
                { name: "Musk Brown", hex: "#8B4513", stock: 20 },
                { name: "Earthy Nude", hex: "#D2B48C", stock: 18 },
                { name: "Deep Taupe", hex: "#483C32", stock: 15 }
            ]
        },
        {
            id: 14,
            name: "G-Shock Watch",
            price: 300.00,
            category: "accessories",
            description: "Durable G-Shock style watch - premium accessory",
            image: "PHOTO-2025-11-12-22-05-09.jpg",
            stock: 8,
            ingredients: "Premium Materials",
            benefits: ["Water resistant", "Durable design"],
            colors: [
                { name: "Classic Black", hex: "#000000", stock: 8 },
                { name: "Military Green", hex: "#4B5320", stock: 5 },
                { name: "Navy Blue", hex: "#000080", stock: 6 }
            ]
        },
        {
            id: 15,
            name: "Potion Coco",
            price: 70.00,
            category: "matte",
            description: "Magical cocoa blend with matte finish",
            image: "PHOTO-2025-11-12-22-05-10.jpg",
            stock: 18,
            ingredients: "Vitamin E, Cocoa Blend",
            benefits: ["Rich cocoa tone", "Magical finish"],
            colors: [
                { name: "Cocoa Magic", hex: "#8B4513", stock: 18 },
                { name: "Chocolate Potion", hex: "#654321", stock: 15 },
                { name: "Mocha Spell", hex: "#A0522D", stock: 12 }
            ]
        },
        {
            id: 16,
            name: "Sold Out Special",
            price: 70.00,
            category: "limited",
            description: "Limited edition - previously sold out item",
            image: "PHOTO-2025-11-12-22-05-12.jpg",
            stock: 0,
            ingredients: "Premium Formula",
            benefits: ["Limited edition", "Exclusive design"],
            colors: [
                { name: "Exclusive Shade", hex: "#800080", stock: 0 },
                { name: "Limited Pink", hex: "#FF1493", stock: 0 },
                { name: "Special Edition", hex: "#9932CC", stock: 0 }
            ]
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('liplux_products', JSON.stringify(yourProducts));
    
    // Load into products array
    products.length = 0;
    products.push(...yourProducts);
    
    console.log('All 16 products loaded into localStorage');
}

// Initialize with your products
initializeYourProducts();