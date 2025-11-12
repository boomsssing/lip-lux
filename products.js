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
            image: "MG6875.jpg",
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
            image: "MG6908.jpg",
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
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('liplux_products', JSON.stringify(yourProducts));
    
    // Load into products array
    products.length = 0;
    products.push(...yourProducts);
    
    console.log('Your 7 products loaded into localStorage');
}

// Initialize with your products
initializeYourProducts();
