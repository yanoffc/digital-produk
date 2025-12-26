// Advanced Access Control - Only RifalosID can access
class AccessControl {
    constructor() {
        this.allowedUsername = 'RifalosID';
        this.allowedIPs = []; // Add your IPs here
        this.allowedDevices = []; // Device fingerprints
        this.init();
    }

    init() {
        // Load allowed IPs and devices from localStorage
        this.loadAccessList();
        
        // Generate device fingerprint
        this.deviceFingerprint = this.generateDeviceFingerprint();
        
        // Check access on page load
        this.checkAccess();
    }

    // Generate unique device fingerprint
    generateDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
        
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvasHash: canvas.toDataURL().substring(0, 50),
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack || 'unknown'
        };
        
        // Create hash from fingerprint
        const fingerprintString = JSON.stringify(fingerprint);
        return this.simpleHash(fingerprintString);
    }

    // Simple hash function
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Get client IP (approximate)
    async getClientIP() {
        try {
            // Try to get IP from external service
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (e) {
            // Fallback: use stored IP or generate from fingerprint
            return localStorage.getItem('clientIP') || 'unknown';
        }
    }

    // Load access list
    loadAccessList() {
        const stored = localStorage.getItem('accessControl');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.allowedIPs = data.allowedIPs || [];
                this.allowedDevices = data.allowedDevices || [];
            } catch (e) {
                console.error('Error loading access list:', e);
            }
        }
    }

    // Save access list
    saveAccessList() {
        const data = {
            allowedIPs: this.allowedIPs,
            allowedDevices: this.allowedDevices
        };
        localStorage.setItem('accessControl', JSON.stringify(data));
    }

    // Add current device to allowed list
    authorizeCurrentDevice() {
        if (!this.allowedDevices.includes(this.deviceFingerprint)) {
            this.allowedDevices.push(this.deviceFingerprint);
            this.saveAccessList();
        }
    }

    // Add current IP to allowed list
    async authorizeCurrentIP() {
        const ip = await this.getClientIP();
        if (ip !== 'unknown' && !this.allowedIPs.includes(ip)) {
            this.allowedIPs.push(ip);
            this.saveAccessList();
        }
    }

    // Check if access is allowed
    async checkAccess() {
        // Check if on login page - allow access
        if (window.location.pathname.includes('login.html')) {
            return true;
        }

        // Check if on admin page
        if (window.location.pathname.includes('admin.html')) {
            // Get session
            const session = sessionStorage.getItem('adminSession');
            if (!session) {
                this.denyAccess('No session found');
                return false;
            }

            try {
                const sessionData = JSON.parse(session);
                
                // Check username
                if (sessionData.username !== this.allowedUsername) {
                    this.denyAccess('Username not authorized');
                    return false;
                }

                // Check device fingerprint
                if (this.allowedDevices.length > 0 && !this.allowedDevices.includes(this.deviceFingerprint)) {
                    // First time access - authorize device
                    if (confirm('Device baru terdeteksi. Izinkan device ini untuk akses admin?')) {
                        this.authorizeCurrentDevice();
                        return true;
                    } else {
                        this.denyAccess('Device not authorized');
                        return false;
                    }
                }

                // Check IP (optional, can be disabled)
                if (this.allowedIPs.length > 0) {
                    const currentIP = await this.getClientIP();
                    if (!this.allowedIPs.includes(currentIP)) {
                        // First time from this IP - authorize
                        if (confirm('IP baru terdeteksi. Izinkan IP ini untuk akses admin?')) {
                            await this.authorizeCurrentIP();
                            return true;
                        } else {
                            this.denyAccess('IP not authorized');
                            return false;
                        }
                    }
                }

                return true;
            } catch (e) {
                // Silent error handling
                this.denyAccess('Session error');
                return false;
            }
        }

        return true;
    }

    // Deny access
    denyAccess(reason) {
        // Silent logging - no console output
        // Log security event
        if (typeof SecurityUtils !== 'undefined') {
            SecurityUtils.logSecurityEvent('access_denied', {
                reason: reason,
                device: this.deviceFingerprint,
                path: window.location.pathname
            });
        }

        // Clear session
        localStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminSession');
        
        // Show generic message and redirect
        alert('Akses ditolak. Silakan hubungi administrator.');
        window.location.href = 'login.html';
    }

    // Verify on login
    async verifyLogin(username) {
        if (username !== this.allowedUsername) {
            return {
                allowed: false,
                message: 'Hanya RifalosID yang diizinkan mengakses admin panel.'
            };
        }

        // Authorize device and IP on successful login
        this.authorizeCurrentDevice();
        await this.authorizeCurrentIP();

        return {
            allowed: true
        };
    }
}

// Initialize access control
const accessControl = new AccessControl();

// Check access on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Only check on admin pages
    if (window.location.pathname.includes('admin.html')) {
        const allowed = await accessControl.checkAccess();
        if (!allowed) {
            return;
        }
    }
});

