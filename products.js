// Sample Products Data
const products = [
    {
        id: 1,
        name: "Rose Blush Gloss",
        price: 45.00,
        category: "glossy",
        description: "A beautiful rose-tinted gloss with high shine finish",
        image: "💄",
        stock: 25
    },
    {
        id: 2,
        name: "Nude Elegance",
        price: 42.00,
        category: "matte",
        description: "Perfect nude shade for everyday elegance",
        image: "💋",
        stock: 30
    },
    {
        id: 3,
        name: "Berry Shimmer",
        price: 48.00,
        category: "shimmer",
        description: "Rich berry color with stunning shimmer",
        image: "✨",
        stock: 20
    },
    {
        id: 4,
        name: "Coral Dream",
        price: 45.00,
        category: "glossy",
        description: "Vibrant coral shade perfect for summer",
        image: "🌸",
        stock: 22
    },
    {
        id: 5,
        name: "Plum Perfection",
        price: 50.00,
        category: "matte",
        description: "Deep plum color with velvety matte finish",
        image: "🍇",
        stock: 18
    },
    {
        id: 6,
        name: "Golden Glow",
        price: 52.00,
        category: "shimmer",
        description: "Luxurious gold shimmer for special occasions",
        image: "✨",
        stock: 15
    },
    {
        id: 7,
        name: "Cherry Kiss",
        price: 45.00,
        category: "glossy",
        description: "Classic cherry red with glossy finish",
        image: "🍒",
        stock: 28
    },
    {
        id: 8,
        name: "Peachy Keen",
        price: 43.00,
        category: "glossy",
        description: "Soft peach tone for a natural look",
        image: "🍑",
        stock: 26
    },
    {
        id: 9,
        name: "Mauve Magic",
        price: 47.00,
        category: "matte",
        description: "Sophisticated mauve with long-lasting formula",
        image: "💜",
        stock: 19
    },
    {
        id: 10,
        name: "Pink Sparkle",
        price: 49.00,
        category: "shimmer",
        description: "Hot pink with dazzling sparkle",
        image: "💖",
        stock: 21
    },
    {
        id: 11,
        name: "Honey Glaze",
        price: 44.00,
        category: "glossy",
        description: "Warm honey shade with glossy glaze",
        image: "🍯",
        stock: 24
    },
    {
        id: 12,
        name: "Burgundy Bliss",
        price: 51.00,
        category: "matte",
        description: "Rich burgundy for bold statements",
        image: "🍷",
        stock: 17
    }
];

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

// Initialize products
loadProducts();
