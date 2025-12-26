// Tripay Payment Integration
class TripayPayment {
    constructor() {
        this.settings = this.loadSettings();
        this.baseUrl = this.settings.tripayMode === 'production' 
            ? 'https://tripay.co.id/api' 
            : 'https://tripay.co.id/api-sandbox';
    }

    loadSettings() {
        const stored = localStorage.getItem('adminSettings');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            tripayApiKey: '',
            tripayPrivateKey: '',
            tripayMerchantCode: '',
            tripayMode: 'sandbox'
        };
    }

    // Generate signature for Tripay
    generateSignature(method, url, body = '') {
        const crypto = window.crypto || window.msCrypto;
        if (!crypto || !crypto.subtle) {
            console.error('Crypto API not available');
            return '';
        }

        const message = this.settings.tripayMerchantCode + method + url + body;
        // Note: In production, use proper HMAC-SHA256
        // This is a simplified version for client-side
        return btoa(message);
    }

    // Create payment transaction with QRIS
    async createTransaction(product, customer) {
        if (!this.settings.tripayApiKey || !this.settings.tripayMerchantCode) {
            throw new Error('Tripay settings belum dikonfigurasi. Silakan login sebagai admin dan atur di Settings.');
        }

        const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9);
        const amount = product.price;
        
        // Get base URL for callback
        const baseUrl = window.location.origin || window.location.protocol + '//' + window.location.host;
        
        // Use custom callback/return URL from settings if available
        const callbackUrl = this.settings.callbackUrl || (baseUrl + '/callback.html');
        const returnUrl = this.settings.returnUrl || (baseUrl + '/payment-success.html?ref=' + orderId);
        
        const payload = {
            method: 'QRIS', // QRIS payment method
            merchant_ref: orderId,
            amount: amount,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            order_items: [
                {
                    sku: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }
            ],
            callback_url: callbackUrl,
            return_url: returnUrl,
            expired_time: (this.settings.paymentTimeout || 30) * 60 // Convert minutes to seconds
        };

        try {
            const response = await fetch(`${this.baseUrl}/transaction/create`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.settings.tripayApiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal membuat transaksi');
            }

            const data = await response.json();
            
            if (!data.success || !data.data) {
                throw new Error(data.message || 'Gagal membuat transaksi');
            }

            const transactionData = data.data;
            
            // Save transaction to localStorage
            this.saveTransaction(orderId, {
                reference: transactionData.reference,
                merchant_ref: orderId,
                amount: transactionData.amount,
                status: transactionData.status || 'UNPAID',
                qr_url: transactionData.qr_url || transactionData.qr_string || null,
                qr_string: transactionData.qr_string || null,
                checkout_url: transactionData.checkout_url || null,
                product: product,
                customer: customer,
                createdAt: new Date().toISOString()
            });

            return {
                reference: transactionData.reference,
                merchant_ref: orderId,
                amount: transactionData.amount,
                status: transactionData.status || 'UNPAID',
                qr_url: transactionData.qr_url || null,
                qr_string: transactionData.qr_string || null,
                checkout_url: transactionData.checkout_url || null,
                expired_time: transactionData.expired_time || null
            };
        } catch (error) {
            console.error('Tripay Error:', error);
            throw error;
        }
    }

    // Save transaction
    saveTransaction(orderId, transaction) {
        const transactions = this.getTransactions();
        transactions[orderId] = {
            ...transaction,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Get transaction
    getTransaction(orderId) {
        const transactions = this.getTransactions();
        return transactions[orderId] || null;
    }

    // Get all transactions
    getTransactions() {
        const stored = localStorage.getItem('transactions');
        return stored ? JSON.parse(stored) : {};
    }

    // Check transaction status
    async checkStatus(reference) {
        if (!this.settings.tripayApiKey) {
            throw new Error('Tripay API Key belum dikonfigurasi');
        }

        try {
            const response = await fetch(`${this.baseUrl}/transaction/detail?reference=${reference}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.settings.tripayApiKey
                }
            });

            if (!response.ok) {
                throw new Error('Gagal mengecek status transaksi');
            }

            const data = await response.json();
            
            if (data.success && data.data) {
                // Update transaction status in localStorage
                const transactions = this.getTransactions();
                const transaction = Object.values(transactions).find(t => t.reference === reference);
                if (transaction) {
                    transaction.status = data.data.status;
                    this.saveTransaction(transaction.merchant_ref, transaction);
                }
                
                return data.data;
            }
            
            throw new Error('Data transaksi tidak ditemukan');
        } catch (error) {
            console.error('Check Status Error:', error);
            throw error;
        }
    }

    // Get payment methods
    async getPaymentMethods() {
        if (!this.settings.tripayApiKey) {
            return [];
        }

        try {
            const response = await fetch(`${this.baseUrl}/merchant/payment-channel`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.settings.tripayApiKey
                }
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Get Payment Methods Error:', error);
            return [];
        }
    }
}

// Initialize Tripay
const tripay = new TripayPayment();

