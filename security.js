// Additional Security Measures

// XSS Protection - Sanitize all user inputs
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// CSRF Protection - Generate and validate tokens
function generateCSRFToken() {
    const token = btoa(Date.now() + Math.random().toString(36)).substring(0, 32);
    sessionStorage.setItem('csrfToken', token);
    return token;
}

function validateCSRFToken(token) {
    const stored = sessionStorage.getItem('csrfToken');
    return stored === token;
}

// Input validation
function validateInput(input, type = 'text') {
    if (!input) return { valid: false, message: 'Input tidak boleh kosong' };

    switch (type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input)) {
                return { valid: false, message: 'Format email tidak valid' };
            }
            break;
        case 'phone':
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(input.replace(/\D/g, ''))) {
                return { valid: false, message: 'Format nomor telepon tidak valid' };
            }
            break;
        case 'number':
            if (isNaN(input) || input < 0) {
                return { valid: false, message: 'Harus berupa angka positif' };
            }
            break;
        case 'text':
            if (input.length < 2) {
                return { valid: false, message: 'Minimal 2 karakter' };
            }
            if (input.length > 100) {
                return { valid: false, message: 'Maksimal 100 karakter' };
            }
            break;
    }

    // Check for potential XSS
    if (input.includes('<script>') || input.includes('javascript:') || input.includes('onerror=')) {
        return { valid: false, message: 'Input mengandung karakter berbahaya' };
    }

    return { valid: true };
}

// Encrypt sensitive data (simple base64, for production use proper encryption)
function encryptData(data) {
    try {
        return btoa(JSON.stringify(data));
    } catch (e) {
        console.error('Encryption error:', e);
        return null;
    }
}

// Decrypt data
function decryptData(encrypted) {
    try {
        return JSON.parse(atob(encrypted));
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
}

// Secure storage for sensitive data
const SecureStorage = {
    set: function(key, value) {
        const encrypted = encryptData(value);
        if (encrypted) {
            localStorage.setItem('secure_' + key, encrypted);
        }
    },
    
    get: function(key) {
        const encrypted = localStorage.getItem('secure_' + key);
        if (encrypted) {
            return decryptData(encrypted);
        }
        return null;
    },
    
    remove: function(key) {
        localStorage.removeItem('secure_' + key);
    }
};

// Detect suspicious activity
function detectSuspiciousActivity() {
    // Check for multiple tabs
    if (typeof Storage !== 'undefined') {
        const tabs = parseInt(localStorage.getItem('activeTabs') || '0');
        if (tabs > 3) {
            console.warn('Multiple tabs detected');
        }
    }

    // Check for dev tools
    let devtools = {open: false, orientation: null};
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                console.warn('Developer tools detected');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// Initialize security measures
document.addEventListener('DOMContentLoaded', () => {
    // Generate CSRF token
    generateCSRFToken();
    
    // Detect suspicious activity
    detectSuspiciousActivity();
    
    // Prevent right-click context menu (optional, can be disabled)
    // document.addEventListener('contextmenu', (e) => {
    //     e.preventDefault();
    // });
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+U (optional, can be disabled)
    document.addEventListener('keydown', (e) => {
        // Allow in development, disable in production if needed
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'U')) {
            // Uncomment to disable:
            // e.preventDefault();
            // return false;
        }
    });
});

// Log security events
function logSecurityEvent(event, details) {
    const log = {
        event: event,
        details: details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Store in sessionStorage (limited space)
    const logs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
    logs.push(log);
    
    // Keep only last 50 logs
    if (logs.length > 50) {
        logs.shift();
    }
    
    sessionStorage.setItem('securityLogs', JSON.stringify(logs));
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.SecurityUtils = {
        sanitizeHTML,
        validateInput,
        SecureStorage,
        logSecurityEvent,
        generateCSRFToken,
        validateCSRFToken
    };
}

