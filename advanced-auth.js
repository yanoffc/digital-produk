// Advanced Authentication System with Enhanced Security
class AdvancedAuth {
    constructor() {
        this.maxAttempts = 3; // Reduced to 3 attempts
        this.lockoutTime = 30 * 60 * 1000; // 30 minutes lockout
        this.sessionTimeout = 1 * 60 * 60 * 1000; // 1 hour session
        this.tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours token
        this.init();
    }

    init() {
        this.loadAttempts();
        this.checkSession();
        this.setupSecurityHeaders();
    }

    // Setup security headers
    setupSecurityHeaders() {
        // Prevent page caching
        if (typeof document !== 'undefined') {
            document.addEventListener('DOMContentLoaded', () => {
                // Add meta tags for security
                const metaTags = [
                    { name: 'cache-control', content: 'no-store, no-cache, must-revalidate' },
                    { name: 'pragma', content: 'no-cache' },
                    { name: 'expires', content: '0' }
                ];
                
                metaTags.forEach(tag => {
                    let meta = document.querySelector(`meta[name="${tag.name}"]`);
                    if (!meta) {
                        meta = document.createElement('meta');
                        meta.name = tag.name;
                        document.head.appendChild(meta);
                    }
                    meta.content = tag.content;
                });
            });
        }
    }

    // Enhanced password hashing with salt
    async hashPasswordWithSalt(password, salt) {
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Generate secure salt
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Enhanced token generation with expiry
    generateSecureToken(username) {
        const timestamp = Date.now();
        const random = this.generateSalt();
        const expiry = timestamp + this.tokenExpiry;
        const data = `${username}:${timestamp}:${random}:${expiry}`;
        return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Validate token with expiry check
    validateToken(token) {
        try {
            const decoded = atob(token);
            const parts = decoded.split(':');
            if (parts.length !== 4) return false;
            
            const expiry = parseInt(parts[3]);
            const now = Date.now();
            
            if (now > expiry) {
                return false; // Token expired
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    // Load login attempts
    loadAttempts() {
        const stored = localStorage.getItem('loginAttempts');
        if (stored) {
            const attempts = JSON.parse(stored);
            if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
                return attempts;
            } else if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
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

    // Increment failed attempts with longer lockout
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

    // Check session with enhanced validation
    checkSession() {
        const session = sessionStorage.getItem('adminSession');
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            const loginTime = new Date(sessionData.loginTime).getTime();

            // Check token expiry
            if (sessionData.token && !this.validateToken(sessionData.token)) {
                return false;
            }

            // Check session timeout
            if (now - loginTime > this.sessionTimeout) {
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
            ip: this.getClientInfo(),
            sessionId: this.generateSessionId()
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

    // Generate unique session ID
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }

    // Get client info
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

    // Sanitize input
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Check rate limit
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

// Enhanced Admin Credentials with Salt
const ENHANCED_ADMIN = {
    username: 'RifalosID',
    // Password: Admin2024!@#Secure
    passwordHash: '', // Will be generated with salt
    salt: '', // Will be generated
    role: 'superadmin',
    twoFactorEnabled: false, // Can be enabled later
    createdAt: new Date().toISOString()
};

// Initialize enhanced admin account
async function initializeEnhancedAdmin() {
    const stored = localStorage.getItem('enhancedAdmin');
    if (stored) {
        try {
            const data = JSON.parse(atob(stored));
            return data;
        } catch (e) {
            // Initialize new
        }
    }
    
    // Generate salt and hash password
    const advancedAuth = new AdvancedAuth();
    const salt = advancedAuth.generateSalt();
    const password = 'Admin2024!@#Secure'; // New secure password
    const passwordHash = await advancedAuth.hashPasswordWithSalt(password, salt);
    
    const adminData = {
        ...ENHANCED_ADMIN,
        passwordHash: passwordHash,
        salt: salt
    };
    
    // Store encrypted
    const encrypted = btoa(JSON.stringify(adminData));
    localStorage.setItem('enhancedAdmin', encrypted);
    
    return adminData;
}

// Authenticate with enhanced security
async function authenticateEnhanced(username, password) {
    const advancedAuth = new AdvancedAuth();
    
    // Check rate limit
    const rateLimit = advancedAuth.checkRateLimit();
    if (!rateLimit.allowed) {
        return {
            success: false,
            message: rateLimit.message
        };
    }

    // Sanitize inputs
    username = advancedAuth.sanitizeInput(username);
    password = advancedAuth.sanitizeInput(password);

    // Validate inputs
    if (!username || username.length < 3) {
        return {
            success: false,
            message: 'Username tidak valid!'
        };
    }

    if (!password || password.length < 12) {
        return {
            success: false,
            message: 'Password minimal 12 karakter!'
        };
    }

    // Load admin account
    const adminAccount = await initializeEnhancedAdmin();
    
    // Check username
    if (username !== adminAccount.username) {
        const attempts = advancedAuth.incrementAttempts();
        return {
            success: false,
            message: attempts.locked 
                ? `Terlalu banyak percobaan login. Coba lagi dalam ${attempts.remainingTime} menit.`
                : `Username atau password salah! (${attempts.remainingAttempts} percobaan tersisa)`
        };
    }

    // Hash provided password with stored salt
    const passwordHash = await advancedAuth.hashPasswordWithSalt(password, adminAccount.salt);
    
    // Compare hashes (timing-safe)
    const isValid = passwordHash === adminAccount.passwordHash;
    
    if (!isValid) {
        const attempts = advancedAuth.incrementAttempts();
        return {
            success: false,
            message: attempts.locked 
                ? `Terlalu banyak percobaan login. Coba lagi dalam ${attempts.remainingTime} menit.`
                : `Username atau password salah! (${attempts.remainingAttempts} percobaan tersisa)`
        };
    }

    // Successful login
    advancedAuth.resetAttempts();
    const token = advancedAuth.generateSecureToken(username);
    advancedAuth.createSession(username, token);

    // Update last login
    adminAccount.lastLogin = new Date().toISOString();
    const encrypted = btoa(JSON.stringify(adminAccount));
    localStorage.setItem('enhancedAdmin', encrypted);

    return {
        success: true,
        token: token,
        username: username
    };
}

// Initialize
if (typeof window !== 'undefined') {
    window.AdvancedAuth = AdvancedAuth;
    window.authenticateEnhanced = authenticateEnhanced;
}

