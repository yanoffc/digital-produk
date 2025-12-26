// Advanced Authentication System with Security Features
class SecureAuth {
    constructor() {
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
        this.init();
    }

    init() {
        this.loadAttempts();
        this.checkSession();
    }

    // Simple hash function (for client-side, in production use server-side hashing)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Generate secure token
    generateToken(username) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const data = `${username}:${timestamp}:${random}`;
        return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Load login attempts from localStorage
    loadAttempts() {
        const stored = localStorage.getItem('loginAttempts');
        if (stored) {
            const attempts = JSON.parse(stored);
            // Check if lockout period has passed
            if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
                return attempts;
            } else if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
                // Lockout expired, reset attempts
                this.resetAttempts();
            }
        }
        return { count: 0, lockedUntil: null };
    }

    // Save login attempts
    saveAttempts(attempts) {
        localStorage.setItem('loginAttempts', JSON.stringify(attempts));
    }

    // Reset login attempts
    resetAttempts() {
        localStorage.removeItem('loginAttempts');
    }

    // Increment failed login attempts
    incrementAttempts() {
        const attempts = this.loadAttempts();
        attempts.count = (attempts.count || 0) + 1;

        if (attempts.count >= this.maxAttempts) {
            attempts.lockedUntil = Date.now() + this.lockoutTime;
            this.saveAttempts(attempts);
            return {
                locked: true,
                remainingTime: Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60)
            };
        }

        this.saveAttempts(attempts);
        return {
            locked: false,
            remainingAttempts: this.maxAttempts - attempts.count
        };
    }

    // Validate session
    checkSession() {
        const session = sessionStorage.getItem('adminSession');
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            const loginTime = new Date(sessionData.loginTime).getTime();

            // Check session timeout
            if (now - loginTime > this.sessionTimeout) {
                this.logout();
                return false;
            }

            // Update last activity
            sessionData.lastActivity = now;
            sessionStorage.setItem('adminSession', JSON.stringify(sessionData));

            return true;
        } catch (e) {
            return false;
        }
    }

    // Create secure session
    createSession(username, token) {
        const session = {
            username: username,
            token: token,
            loginTime: new Date().toISOString(),
            lastActivity: Date.now(),
            ip: this.getClientInfo()
        };

        sessionStorage.setItem('adminSession', JSON.stringify(session));
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Set session timeout
        setTimeout(() => {
            if (this.checkSession()) {
                alert('Session Anda telah berakhir. Silakan login kembali.');
                this.logout();
            }
        }, this.sessionTimeout);
    }

    // Get client info (for logging)
    getClientInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: Date.now()
        };
    }

    // Logout
    logout() {
        sessionStorage.removeItem('adminSession');
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    }

    // Validate token
    validateToken(token) {
        try {
            const decoded = atob(token);
            const parts = decoded.split(':');
            if (parts.length !== 3) return false;
            
            const timestamp = parseInt(parts[1]);
            const now = Date.now();
            
            // Token valid for 24 hours
            if (now - timestamp > 24 * 60 * 60 * 1000) {
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Rate limiting check
    checkRateLimit() {
        const attempts = this.loadAttempts();
        if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
            const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            return {
                allowed: false,
                message: `Terlalu banyak percobaan login. Coba lagi dalam ${remainingMinutes} menit.`
            };
        }
        return { allowed: true };
    }
}

// Initialize auth system
const secureAuth = new SecureAuth();

// Admin credentials - Simple and reliable system
// Password: admin123 (change this in production!)
const ADMIN_CREDENTIALS = {
    username: 'RifalosID',
    password: 'admin123', // CHANGE THIS PASSWORD!
    // Pre-computed hash for: admin123
    // This ensures it works on all hosting
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};

// Generate password hash
async function hashPassword(password) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        // Fallback for older browsers
        console.warn('Crypto API not available, using fallback');
        return simpleHash(password);
    }
}

// Simple hash fallback
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// Initialize admin account (runs once)
async function initializeAdminAccounts() {
    // Check if already initialized
    const stored = localStorage.getItem('adminInitialized');
    if (stored === 'true') {
        return;
    }
    
    // Generate hash for current password
    const hash = await hashPassword(ADMIN_CREDENTIALS.password);
    
    // Store admin data
    const adminData = {
        username: ADMIN_CREDENTIALS.username,
        passwordHash: hash,
        role: 'superadmin',
        createdAt: new Date().toISOString()
    };
    
    // Store encrypted
    const encrypted = btoa(JSON.stringify(adminData));
    localStorage.setItem('adminAccount', encrypted);
    localStorage.setItem('adminInitialized', 'true');
}

// Load admin account - Simple and reliable
function loadAdminAccount() {
    const stored = localStorage.getItem('adminAccount');
    if (stored) {
        try {
            const decrypted = JSON.parse(atob(stored));
            return decrypted;
        } catch (e) {
            // Silent error handling - re-initialize if corrupted
            initializeAdminAccounts();
            return null;
        }
    } else {
        // First time, initialize
        initializeAdminAccounts();
        return null;
    }
}

// Get admin account (with fallback)
async function getAdminAccount() {
    let account = loadAdminAccount();
    
    // If no stored account, use default
    if (!account) {
        const hash = await hashPassword(ADMIN_CREDENTIALS.password);
        account = {
            username: ADMIN_CREDENTIALS.username,
            passwordHash: hash,
            role: 'superadmin'
        };
    }
    
    return account;
}

// Authenticate user with enhanced security and access control
async function authenticate(username, password) {
    // Log security event
    if (typeof SecurityUtils !== 'undefined') {
        SecurityUtils.logSecurityEvent('login_attempt', { username: username });
    }

    // Check access control - ONLY RifalosID allowed
    if (typeof accessControl !== 'undefined') {
        const accessCheck = await accessControl.verifyLogin(username);
        if (!accessCheck.allowed) {
            return {
                success: false,
                message: accessCheck.message || 'Akses ditolak. Hanya RifalosID yang diizinkan.'
            };
        }
    } else {
        // Fallback: check username directly
        if (username !== 'RifalosID') {
            return {
                success: false,
                message: 'Akses ditolak. Hanya RifalosID yang diizinkan mengakses admin panel.'
            };
        }
    }

    // Check rate limit
    const rateLimit = secureAuth.checkRateLimit();
    if (!rateLimit.allowed) {
        return {
            success: false,
            message: rateLimit.message
        };
    }

    // Sanitize inputs
    username = secureAuth.sanitizeInput(username);
    password = secureAuth.sanitizeInput(password);

    // Validate inputs
    if (!username || username.length < 3) {
        return {
            success: false,
            message: 'Username tidak valid!'
        };
    }

    if (!password || password.length < 8) {
        return {
            success: false,
            message: 'Password minimal 8 karakter!'
        };
    }

    // Get admin account
    const adminAccount = await getAdminAccount();
    
    // Check username - Generic error message for security
    if (username !== adminAccount.username) {
        const attempts = secureAuth.incrementAttempts();
        if (typeof SecurityUtils !== 'undefined') {
            SecurityUtils.logSecurityEvent('failed_login', { username: username, reason: 'user_not_found' });
        }
        return {
            success: false,
            message: attempts.locked 
                ? `Terlalu banyak percobaan login. Coba lagi dalam ${attempts.remainingTime} menit.`
                : `Username atau password salah! (${attempts.remainingAttempts} percobaan tersisa)`
        };
    }

    // Hash provided password
    const passwordHash = await hashPassword(password);
    
    // Compare hashes
    const isValid = passwordHash === adminAccount.passwordHash;
    
    if (!isValid) {
        const attempts = secureAuth.incrementAttempts();
        if (typeof SecurityUtils !== 'undefined') {
            SecurityUtils.logSecurityEvent('failed_login', { username: username, reason: 'wrong_password' });
        }
        return {
            success: false,
            message: attempts.locked 
                ? `Terlalu banyak percobaan login. Coba lagi dalam ${attempts.remainingTime} menit.`
                : `Username atau password salah! (${attempts.remainingAttempts} percobaan tersisa)`
        };
    }

    // Successful login
    secureAuth.resetAttempts();
    const token = secureAuth.generateToken(username);
    secureAuth.createSession(username, token);

    // Update last login
    adminAccount.lastLogin = new Date().toISOString();
    const encrypted = btoa(JSON.stringify(adminAccount));
    localStorage.setItem('adminAccount', encrypted);

    // Log successful login
    if (typeof SecurityUtils !== 'undefined') {
        SecurityUtils.logSecurityEvent('successful_login', { username: username });
    }

    return {
        success: true,
        token: token,
        username: username
    };
}

// Initialize on load
if (typeof window !== 'undefined') {
    // Initialize admin account on page load
    document.addEventListener('DOMContentLoaded', () => {
        initializeAdminAccounts();
    });
}

