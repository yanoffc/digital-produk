// Payment Handler for Landing Page
let selectedProduct = null;

// Open payment modal by product ID
function openPaymentModalById(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (product) {
        openPaymentModal(product);
    } else {
        alert('Produk tidak ditemukan!');
    }
}

// Open payment modal
function openPaymentModal(product) {
    selectedProduct = product;
    
    // Check stock
    if (product.stock <= 0) {
        alert('Maaf, produk ini sedang habis!');
        return;
    }

    document.getElementById('paymentProductName').textContent = product.name;
    document.getElementById('paymentProductPrice').textContent = 'Rp ' + formatNumber(product.price);
    document.getElementById('paymentModal').classList.add('show');
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
    document.getElementById('paymentForm').reset();
    selectedProduct = null;
}

// Process payment
async function processPayment(event) {
    event.preventDefault();
    
    if (!selectedProduct) {
        alert('Produk tidak ditemukan!');
        return;
    }

    const customer = {
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        phone: document.getElementById('customerPhone').value.trim()
    };

    // Validate
    if (!customer.name || !customer.email || !customer.phone) {
        alert('Mohon lengkapi semua data!');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
        alert('Format email tidak valid!');
        return;
    }

    // Validate phone format (minimal 10 digit)
    if (customer.phone.length < 10) {
        alert('Nomor WhatsApp minimal 10 digit!');
        return;
    }

    // Show loading
    const submitBtn = document.getElementById('submitPayment');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

    try {
        // Create Tripay transaction with QRIS
        const transaction = await tripay.createTransaction(selectedProduct, customer);
        
        // Show QRIS payment modal directly
        showQRISPayment(transaction);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    } catch (error) {
        alert('Error: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Show QRIS payment modal
function showQRISPayment(transaction) {
    closePaymentModal();
    
    const instructionsModal = document.getElementById('paymentInstructions');
    const qrImage = document.getElementById('paymentQR');
    const qrContainer = document.getElementById('qrContainer');
    const referenceEl = document.getElementById('paymentReference');
    const amountEl = document.getElementById('paymentAmount');
    const statusEl = document.getElementById('paymentStatus');
    
    // Set transaction info
    if (referenceEl) referenceEl.textContent = transaction.reference || transaction.merchant_ref;
    if (amountEl) amountEl.textContent = 'Rp ' + formatNumber(transaction.amount);
    if (statusEl) statusEl.textContent = 'Menunggu Pembayaran';
    
    // Show QR Code
    if (transaction.qr_url) {
        qrImage.src = transaction.qr_url;
        qrImage.style.display = 'block';
        qrImage.style.maxWidth = '100%';
        qrImage.style.height = 'auto';
        qrImage.style.margin = '20px auto';
        qrImage.style.border = '2px solid #e0e0e0';
        qrImage.style.borderRadius = '10px';
        qrImage.style.padding = '10px';
        qrImage.style.backgroundColor = '#fff';
    } else if (transaction.qr_string) {
        // Generate QR code from string using QR code library or API
        generateQRCode(transaction.qr_string, qrImage);
    } else {
        qrImage.style.display = 'none';
    }
    
    instructionsModal.classList.add('show');
    
    // Start auto-checking payment status
    if (transaction.reference) {
        checkPaymentStatus(transaction.reference);
    }
}

// Generate QR Code from string
function generateQRCode(qrString, imgElement) {
    // Use QR code API or library
    // Option 1: Use QR code API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`;
    imgElement.src = qrApiUrl;
    imgElement.style.display = 'block';
    imgElement.style.maxWidth = '100%';
    imgElement.style.height = 'auto';
    imgElement.style.margin = '20px auto';
    imgElement.style.border = '2px solid #e0e0e0';
    imgElement.style.borderRadius = '10px';
    imgElement.style.padding = '10px';
    imgElement.style.backgroundColor = '#fff';
}

// Check payment status automatically
let paymentCheckInterval = null;

async function checkPaymentStatus(reference) {
    const statusEl = document.getElementById('paymentStatus');
    let checkCount = 0;
    const maxChecks = 360; // 30 minutes (360 * 5 seconds)
    
    // Clear any existing interval
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    paymentCheckInterval = setInterval(async () => {
        try {
            checkCount++;
            const status = await tripay.checkStatus(reference);
            
            // Update status display
            if (statusEl) {
                if (status.status === 'UNPAID' || status.status === 'PENDING') {
                    statusEl.textContent = 'Menunggu Pembayaran...';
                    statusEl.style.color = '#f39c12';
                } else if (status.status === 'PAID') {
                    statusEl.textContent = 'Pembayaran Berhasil!';
                    statusEl.style.color = '#27ae60';
                } else if (status.status === 'EXPIRED') {
                    statusEl.textContent = 'Pembayaran Kedaluwarsa';
                    statusEl.style.color = '#e74c3c';
                } else if (status.status === 'FAILED') {
                    statusEl.textContent = 'Pembayaran Gagal';
                    statusEl.style.color = '#e74c3c';
                }
            }
            
            // Handle payment success
            if (status.status === 'PAID') {
                clearInterval(paymentCheckInterval);
                paymentCheckInterval = null;
                
                // Update product stock
                updateProductStockAfterPayment(reference);
                
                // Show success message
                setTimeout(() => {
                    window.location.href = 'payment-success.html?ref=' + reference;
                }, 2000);
            } 
            // Handle payment failed/expired
            else if (status.status === 'EXPIRED' || status.status === 'FAILED') {
                clearInterval(paymentCheckInterval);
                paymentCheckInterval = null;
                
                if (statusEl) {
                    statusEl.textContent = 'Pembayaran ' + (status.status === 'EXPIRED' ? 'Kedaluwarsa' : 'Gagal');
                    statusEl.style.color = '#e74c3c';
                }
            }
            
            // Stop after max checks
            if (checkCount >= maxChecks) {
                clearInterval(paymentCheckInterval);
                paymentCheckInterval = null;
                if (statusEl) {
                    statusEl.textContent = 'Waktu pembayaran habis';
                    statusEl.style.color = '#e74c3c';
                }
            }
        } catch (error) {
            console.error('Check status error:', error);
            // Continue checking even if there's an error
        }
    }, 5000); // Check every 5 seconds
}

// Update product stock after successful payment
function updateProductStockAfterPayment(reference) {
    try {
        const transactions = tripay.getTransactions();
        const transaction = Object.values(transactions).find(t => t.reference === reference);
        
        if (transaction && transaction.product) {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const productIndex = products.findIndex(p => p.id === transaction.product.id);
            
            if (productIndex !== -1 && products[productIndex].stock > 0) {
                products[productIndex].stock -= 1;
                products[productIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('products', JSON.stringify(products));
            }
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Format number
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Load products from admin
function loadProductsForSale() {
    const stored = localStorage.getItem('products');
    if (stored) {
        const products = JSON.parse(stored);
        return products.filter(p => p.stock > 0); // Only show products with stock
    }
    return [];
}

// Update WhatsApp links
function updateWhatsAppLinks() {
    const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    const whatsappNumber = settings.whatsappNumber || '6281234567890';
    
    // Update all WhatsApp links
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        const href = link.getAttribute('href');
        const newHref = href.replace(/wa\.me\/\d+/, 'wa.me/' + whatsappNumber);
        link.setAttribute('href', newHref);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWhatsAppLinks();
});

