// Load secure auth
let secureAuth;
if (typeof SecureAuth !== 'undefined') {
    secureAuth = new SecureAuth();
}

// Enhanced Authentication Check
function checkAuth() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const session = sessionStorage.getItem('adminSession');
    
    if (!loggedIn || loggedIn !== 'true' || !session) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        const sessionData = JSON.parse(session);
        
        // Validate session data
        if (!sessionData || !sessionData.username || sessionData.username !== 'RifalosID') {
            logout();
            return false;
        }

        // Check if using app.min.js auth system
        if (typeof auth !== 'undefined' && typeof auth.checkSession === 'function') {
            if (!auth.checkSession()) {
                logout();
                return false;
            }
        } else if (secureAuth) {
            // Use SecureAuth if available
            if (!secureAuth.checkSession()) {
                logout();
                return false;
            }
        } else {
            // Fallback: check session timeout manually
            if (sessionData.loginTime) {
                const now = Date.now();
                const loginTime = new Date(sessionData.loginTime).getTime();
                const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
                
                if (isNaN(loginTime) || (now - loginTime > sessionTimeout)) {
                    logout();
                    return false;
                }
            }
        }

        // Update last activity
        sessionData.lastActivity = Date.now();
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));

        return true;
    } catch (e) {
        logout();
        return false;
    }
}

// Enhanced Logout function
function logout() {
    // Clear all session data
    localStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminSession');
    
    // Clear any sensitive data
    localStorage.removeItem('tempData');
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Auto-logout on inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (confirm('Tidak ada aktivitas dalam 30 menit. Apakah Anda ingin tetap login?')) {
            resetInactivityTimer();
        } else {
            logout();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// Track user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Product Management System
let products = [];
let currentEditId = null;
let currentDeleteId = null;
let settings = {
    whatsappNumber: '6281234567890',
    tripayApiKey: '',
    tripayPrivateKey: '',
    tripayMerchantCode: '',
    tripayMode: 'sandbox',
    // Payment Integrity Settings
    paymentVerification: 'auto',
    paymentTimeout: 30,
    autoRefund: 'enabled',
    paymentWebhook: '',
    paymentSecret: '',
    minPaymentAmount: 10000,
    maxPaymentAmount: 100000000,
    enablePaymentLogging: true,
    enableEmailNotification: true,
    // Callback Settings
    callbackUrl: '',
    returnUrl: '',
    callbackSecret: '',
    enableCallback: true,
    enableCallbackLogging: true
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load secure auth
    if (typeof SecureAuth !== 'undefined') {
        secureAuth = new SecureAuth();
    }
    
    // Check authentication first - use checkAuth from app.min.js if available
    let authCheck = checkAuth;
    if (typeof window.checkAuth === 'function') {
        authCheck = window.checkAuth;
    }
    
    if (!authCheck()) {
        return;
    }
    
    // Initialize inactivity timer
    if (typeof resetInactivityTimer === 'function') {
        resetInactivityTimer();
    }
    
    // Load data
    if (typeof loadSettings === 'function') {
        loadSettings();
    }
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
    
    // Initialize default products if empty (for localhost/testing)
    if (products.length === 0 && isLocalhost()) {
        if (typeof initializeDefaultProducts === 'function') {
            initializeDefaultProducts();
        }
    }
    
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    if (typeof updateStats === 'function') {
        updateStats();
    }
    
    // Silent initialization - no console logs
});

// Check if running on localhost
function isLocalhost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '' ||
           window.location.protocol === 'file:';
}

// Initialize default products for localhost/testing
function initializeDefaultProducts() {
    const defaultProducts = [
        {
            id: Date.now() + 1,
            name: 'Digital Ocean Droplet - Starter',
            category: 'Digital Ocean',
            price: 50000,
            stock: 10,
            description: 'Digital Ocean Droplet dengan 1GB RAM, 1 vCPU, 25GB SSD. Cocok untuk website kecil dan testing.',
            lowStockThreshold: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: 'Digital Ocean Droplet - Professional',
            category: 'Digital Ocean',
            price: 150000,
            stock: 5,
            description: 'Digital Ocean Droplet dengan 4GB RAM, 2 vCPU, 80GB SSD. Cocok untuk aplikasi production.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            name: 'AWS EC2 t2.micro',
            category: 'AWS',
            price: 75000,
            stock: 8,
            description: 'AWS EC2 instance t2.micro dengan 1GB RAM. Free tier eligible. Cocok untuk development.',
            lowStockThreshold: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            name: 'AWS EC2 t3.small',
            category: 'AWS',
            price: 200000,
            stock: 5,
            description: 'AWS EC2 instance t3.small dengan 2GB RAM. Cocok untuk aplikasi production kecil.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 5,
            name: 'AWS EC2 t3.medium',
            category: 'AWS',
            price: 350000,
            stock: 6,
            description: 'AWS EC2 instance t3.medium dengan 4GB RAM, 2 vCPU. Cocok untuk aplikasi production menengah.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            name: 'AWS EC2 t3.large',
            category: 'AWS',
            price: 500000,
            stock: 4,
            description: 'AWS EC2 instance t3.large dengan 8GB RAM, 2 vCPU. Cocok untuk aplikasi production besar.',
            lowStockThreshold: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            name: 'AWS EC2 t3.xlarge',
            category: 'AWS',
            price: 800000,
            stock: 3,
            description: 'AWS EC2 instance t3.xlarge dengan 16GB RAM, 4 vCPU. Cocok untuk aplikasi enterprise.',
            lowStockThreshold: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 8,
            name: 'AWS S3 Storage - 100GB',
            category: 'AWS',
            price: 30000,
            stock: 20,
            description: 'AWS S3 storage 100GB dengan transfer unlimited. Cocok untuk backup dan file storage.',
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 9,
            name: 'AWS S3 Storage - 500GB',
            category: 'AWS',
            price: 120000,
            stock: 15,
            description: 'AWS S3 storage 500GB dengan transfer unlimited. Cocok untuk backup besar dan media storage.',
            lowStockThreshold: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 10,
            name: 'AWS S3 Storage - 1TB',
            category: 'AWS',
            price: 200000,
            stock: 10,
            description: 'AWS S3 storage 1TB dengan transfer unlimited. Cocok untuk enterprise backup dan archive.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 11,
            name: 'AWS RDS MySQL - db.t2.micro',
            category: 'AWS',
            price: 150000,
            stock: 8,
            description: 'AWS RDS MySQL database dengan 1GB RAM, 20GB storage. Cocok untuk aplikasi kecil.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 12,
            name: 'AWS RDS MySQL - db.t3.small',
            category: 'AWS',
            price: 300000,
            stock: 5,
            description: 'AWS RDS MySQL database dengan 2GB RAM, 50GB storage. Cocok untuk aplikasi production.',
            lowStockThreshold: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 13,
            name: 'AWS RDS PostgreSQL - db.t2.micro',
            category: 'AWS',
            price: 150000,
            stock: 8,
            description: 'AWS RDS PostgreSQL database dengan 1GB RAM, 20GB storage. Cocok untuk aplikasi modern.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 14,
            name: 'AWS CloudFront CDN - 1TB Transfer',
            category: 'AWS',
            price: 250000,
            stock: 12,
            description: 'AWS CloudFront CDN dengan 1TB data transfer per bulan. Cocok untuk website dengan traffic tinggi.',
            lowStockThreshold: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 15,
            name: 'AWS CloudFront CDN - 5TB Transfer',
            category: 'AWS',
            price: 800000,
            stock: 6,
            description: 'AWS CloudFront CDN dengan 5TB data transfer per bulan. Cocok untuk website enterprise.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 16,
            name: 'AWS Lambda - 1M Requests',
            category: 'AWS',
            price: 100000,
            stock: 25,
            description: 'AWS Lambda serverless dengan 1 juta requests per bulan. Cocok untuk microservices dan API.',
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 17,
            name: 'AWS Lambda - 10M Requests',
            category: 'AWS',
            price: 500000,
            stock: 10,
            description: 'AWS Lambda serverless dengan 10 juta requests per bulan. Cocok untuk aplikasi high-traffic.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 18,
            name: 'AWS Route 53 Domain',
            category: 'AWS',
            price: 150000,
            stock: 50,
            description: 'AWS Route 53 domain dengan DNS management. Include SSL certificate dan high availability.',
            lowStockThreshold: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 19,
            name: 'AWS Elastic Beanstalk',
            category: 'AWS',
            price: 400000,
            stock: 8,
            description: 'AWS Elastic Beanstalk untuk deploy aplikasi dengan auto-scaling. Support Node.js, Python, PHP, Java.',
            lowStockThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 20,
            name: 'AWS CloudWatch Monitoring',
            category: 'AWS',
            price: 80000,
            stock: 20,
            description: 'AWS CloudWatch monitoring dan logging untuk semua AWS services. Real-time alerts dan dashboards.',
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            name: 'VPS Cloud - Basic',
            category: 'VPS',
            price: 100000,
            stock: 15,
            description: 'VPS Cloud dengan 2GB RAM, 1 Core, 40GB SSD. Full root access, support 24/7.',
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            name: 'Domain .com',
            category: 'Domain',
            price: 150000,
            stock: 50,
            description: 'Domain .com dengan harga terjangkau. Include DNS management dan privacy protection.',
            lowStockThreshold: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 8,
            name: 'SSL Certificate - Let\'s Encrypt',
            category: 'SSL Certificate',
            price: 0,
            stock: 999,
            description: 'SSL Certificate gratis dari Let\'s Encrypt. Auto-renewal, support semua browser.',
            lowStockThreshold: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 9,
            name: 'SSL Certificate - Premium',
            category: 'SSL Certificate',
            price: 250000,
            stock: 30,
            description: 'SSL Certificate premium dengan warranty tinggi. Support wildcard dan multi-domain.',
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 10,
            name: 'QR Code Payment Gateway',
            category: 'QR Code Payment',
            price: 500000,
            stock: 10,
            description: 'Integrasi QR Code Payment untuk website dan aplikasi. Support semua bank dan e-wallet.',
            lowStockThreshold: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    products = defaultProducts;
    saveProducts();
    showNotification('Produk default telah ditambahkan untuk testing!', 'success');
}

// Load products from localStorage
function loadProducts() {
    const stored = localStorage.getItem('products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        // Sample data (optional)
        products = [];
    }
}

// Save products to localStorage
function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        updateStats();
        return true;
    } catch (e) {
        console.error('Error saving products:', e);
        alert('Gagal menyimpan produk. Pastikan browser mendukung localStorage.');
        return false;
    }
}

// Render products table
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Belum ada produk. Klik "Tambah Produk Baru" untuk menambahkan produk.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map((product, index) => {
        const status = getStockStatus(product.stock, product.lowStockThreshold || 10);
        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>Rp ${formatNumber(product.price)}</td>
                <td>
                    <div class="stock-control">
                        <button class="btn-stock btn-minus" onclick="updateStock(${product.id}, -1)" title="Kurangi 1">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="stock-input" 
                               value="${product.stock}" 
                               min="0"
                               onchange="quickUpdateStock(${product.id}, this.value)"
                               onblur="quickUpdateStock(${product.id}, this.value)">
                        <button class="btn-stock btn-plus" onclick="updateStock(${product.id}, 1)" title="Tambah 1">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>${getStatusBadge(status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editProduct(${product.id})" title="Edit Produk">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})" title="Hapus Produk">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Get stock status
function getStockStatus(stock, threshold) {
    if (stock === 0) return 'out-of-stock';
    if (stock < threshold) return 'low-stock';
    return 'in-stock';
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        'in-stock': '<span class="status-badge in-stock">Tersedia</span>',
        'low-stock': '<span class="status-badge low-stock">Stok Menipis</span>',
        'out-of-stock': '<span class="status-badge out-of-stock">Habis</span>'
    };
    return badges[status] || badges['in-stock'];
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + parseInt(p.stock || 0), 0);
    const lowStock = products.filter(p => {
        const threshold = p.lowStockThreshold || 10;
        return p.stock > 0 && p.stock < threshold;
    }).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = formatNumber(totalStock);
    document.getElementById('lowStock').textContent = lowStock;
}

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Quick update stock (direct input)
function quickUpdateStock(id, value) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const stock = parseInt(value) || 0;
    if (stock < 0) {
        alert('Stok tidak boleh negatif!');
        renderProducts();
        return;
    }
    
    product.stock = stock;
    product.updatedAt = new Date().toISOString();
    saveProducts();
    showNotification(`Stok ${product.name} diperbarui menjadi ${stock}`, 'success');
}

// Update stock (increment/decrement)
function updateStock(id, change) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newStock = Math.max(0, (product.stock || 0) + change);
    product.stock = newStock;
    product.updatedAt = new Date().toISOString();
    saveProducts();
    showNotification(`Stok ${product.name} ${change > 0 ? 'ditambah' : 'dikurangi'} menjadi ${newStock}`, 'success');
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        renderProducts();
        return;
    }

    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Produk tidak ditemukan.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map((product, index) => {
        const status = getStockStatus(product.stock, product.lowStockThreshold || 10);
        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>Rp ${formatNumber(product.price)}</td>
                <td>
                    <div class="stock-control">
                        <button class="btn-stock btn-minus" onclick="updateStock(${product.id}, -1)" title="Kurangi 1">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="stock-input" 
                               value="${product.stock}" 
                               min="0"
                               onchange="quickUpdateStock(${product.id}, this.value)"
                               onblur="quickUpdateStock(${product.id}, this.value)">
                        <button class="btn-stock btn-plus" onclick="updateStock(${product.id}, 1)" title="Tambah 1">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>${getStatusBadge(status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editProduct(${product.id})" title="Edit Produk">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})" title="Hapus Produk">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Open add modal
function openAddModal() {
    try {
        currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
        
        // Reset form completely
        const form = document.getElementById('productForm');
        if (form) {
            form.reset();
        }
        
        // Clear all fields explicitly
        document.getElementById('productId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productStock').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('lowStockThreshold').value = '10';
        
        // Show modal
        document.getElementById('productModal').classList.add('show');
        
        // Focus on first input after modal shows
        setTimeout(() => {
            const nameInput = document.getElementById('productName');
            if (nameInput) {
                nameInput.focus();
            }
        }, 100);
    } catch (e) {
        alert('Gagal membuka form tambah produk. Silakan refresh halaman.');
        console.error('Error opening add modal:', e);
    }
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Produk';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('lowStockThreshold').value = product.lowStockThreshold || 10;
    
    document.getElementById('productModal').classList.add('show');
}

// Save product (add or update)
function saveProduct(event) {
    event.preventDefault();

    // Validate required fields
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value) || 0;

    if (!name) {
        alert('Nama produk harus diisi!');
        document.getElementById('productName').focus();
        return;
    }

    if (!category) {
        alert('Kategori harus dipilih!');
        document.getElementById('productCategory').focus();
        return;
    }

    if (price < 0) {
        alert('Harga tidak boleh negatif!');
        document.getElementById('productPrice').focus();
        return;
    }

    if (stock < 0) {
        alert('Stok tidak boleh negatif!');
        document.getElementById('productStock').focus();
        return;
    }

    const id = currentEditId || Date.now();
    const product = {
        id: currentEditId || id,
        name: name,
        category: category,
        price: price,
        stock: stock,
        description: document.getElementById('productDescription').value.trim(),
        lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value) || 10,
        updatedAt: new Date().toISOString()
    };

    if (currentEditId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = { ...products[index], ...product };
        } else {
            alert('Produk tidak ditemukan!');
            return;
        }
    } else {
        // Add new product
        product.createdAt = new Date().toISOString();
        products.push(product);
    }

    // Save to localStorage
    if (saveProducts()) {
        closeModal();
        // Show success message
        showNotification(currentEditId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!', 'success');
    } else {
        alert('Gagal menyimpan produk. Silakan coba lagi.');
    }
}

// Delete product
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentDeleteId = id;
    document.getElementById('deleteProductName').textContent = product.name;
    document.getElementById('deleteModal').classList.add('show');
}

// Confirm delete
function confirmDelete() {
    if (currentDeleteId) {
        products = products.filter(p => p.id !== currentDeleteId);
        saveProducts();
        closeDeleteModal();
        showNotification('Produk berhasil dihapus!', 'success');
    }
}

// Close modal
function closeModal() {
    try {
        document.getElementById('productModal').classList.remove('show');
        currentEditId = null;
        // Reset form
        document.getElementById('productForm').reset();
    } catch (e) {
        // Silent error
    }
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    currentDeleteId = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === productModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Settings Management
function loadSettings() {
    const stored = localStorage.getItem('adminSettings');
    if (stored) {
        try {
            const loaded = JSON.parse(stored);
            settings = { ...settings, ...loaded };
        } catch (e) {
            // Use default settings
        }
    }
}

function saveSettingsToStorage() {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
}

// Open Settings Modal
function openSettings() {
    // Load current settings
    loadSettings();
    
    // Fill form with current settings
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('tripayApiKey').value = settings.tripayApiKey || '';
    document.getElementById('tripayPrivateKey').value = settings.tripayPrivateKey || '';
    document.getElementById('tripayMerchantCode').value = settings.tripayMerchantCode || '';
    document.getElementById('tripayMode').value = settings.tripayMode || 'sandbox';
    
    // Payment Integrity Settings
    document.getElementById('paymentVerification').value = settings.paymentVerification || 'auto';
    document.getElementById('paymentTimeout').value = settings.paymentTimeout || 30;
    document.getElementById('autoRefund').value = settings.autoRefund || 'enabled';
    document.getElementById('paymentWebhook').value = settings.paymentWebhook || '';
    document.getElementById('paymentSecret').value = settings.paymentSecret || '';
    document.getElementById('minPaymentAmount').value = settings.minPaymentAmount || 10000;
    document.getElementById('maxPaymentAmount').value = settings.maxPaymentAmount || 100000000;
    document.getElementById('enablePaymentLogging').checked = settings.enablePaymentLogging !== false;
    document.getElementById('enableEmailNotification').checked = settings.enableEmailNotification !== false;
    
    // Callback Settings
    document.getElementById('callbackUrl').value = settings.callbackUrl || '';
    document.getElementById('returnUrl').value = settings.returnUrl || '';
    document.getElementById('callbackSecret').value = settings.callbackSecret || '';
    document.getElementById('enableCallback').checked = settings.enableCallback !== false;
    document.getElementById('enableCallbackLogging').checked = settings.enableCallbackLogging !== false;
    
    document.getElementById('settingsModal').classList.add('show');
}

// Close Settings Modal
function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

// Save Settings
function saveSettings(event) {
    event.preventDefault();
    
    // Basic settings
    settings.whatsappNumber = document.getElementById('whatsappNumber').value.trim();
    settings.tripayApiKey = document.getElementById('tripayApiKey').value.trim();
    settings.tripayPrivateKey = document.getElementById('tripayPrivateKey').value.trim();
    settings.tripayMerchantCode = document.getElementById('tripayMerchantCode').value.trim();
    settings.tripayMode = document.getElementById('tripayMode').value;
    
    // Payment Integrity Settings
    settings.paymentVerification = document.getElementById('paymentVerification').value;
    settings.paymentTimeout = parseInt(document.getElementById('paymentTimeout').value) || 30;
    settings.autoRefund = document.getElementById('autoRefund').value;
    settings.paymentWebhook = document.getElementById('paymentWebhook').value.trim();
    settings.paymentSecret = document.getElementById('paymentSecret').value.trim();
    settings.minPaymentAmount = parseInt(document.getElementById('minPaymentAmount').value) || 10000;
    settings.maxPaymentAmount = parseInt(document.getElementById('maxPaymentAmount').value) || 100000000;
    settings.enablePaymentLogging = document.getElementById('enablePaymentLogging').checked;
    settings.enableEmailNotification = document.getElementById('enableEmailNotification').checked;
    
    // Callback Settings
    settings.callbackUrl = document.getElementById('callbackUrl').value.trim();
    settings.returnUrl = document.getElementById('returnUrl').value.trim();
    settings.callbackSecret = document.getElementById('callbackSecret').value.trim();
    settings.enableCallback = document.getElementById('enableCallback').checked;
    settings.enableCallbackLogging = document.getElementById('enableCallbackLogging').checked;
    
    // Validate
    if (settings.minPaymentAmount >= settings.maxPaymentAmount) {
        alert('Minimum amount harus lebih kecil dari maximum amount!');
        return;
    }
    
    if (settings.paymentTimeout < 5 || settings.paymentTimeout > 1440) {
        alert('Payment timeout harus antara 5-1440 menit!');
        return;
    }
    
    saveSettingsToStorage();
    closeSettings();
    showNotification('Settings berhasil disimpan!', 'success');
    
    // Update WhatsApp links in index.html if needed
    updateWhatsAppLinks();
}

