// Localhost Configuration
// Auto-detect and configure for localhost environment

(function() {
    'use strict';
    
    // Detect if running on localhost
    function isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '' ||
               window.location.protocol === 'file:';
    }
    
    // Configure for localhost
    if (isLocalhost()) {
        console.log('%cLocalhost Mode Active', 'color: #25D366; font-size: 14px; font-weight: bold;');
        
        // Enable debug mode
        window.DEBUG_MODE = true;
        
        // Override console methods to show more info in localhost
        const originalLog = console.log;
        console.log = function(...args) {
            if (window.DEBUG_MODE) {
                originalLog.apply(console, args);
            }
        };
        
        // Add localhost indicator
        document.addEventListener('DOMContentLoaded', () => {
            // Add localhost badge to admin panel
            if (window.location.pathname.includes('admin.html')) {
                const header = document.querySelector('.admin-header .header-content');
                if (header) {
                    const badge = document.createElement('div');
                    badge.style.cssText = `
                        background: #ff9800;
                        color: white;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        margin-left: 10px;
                    `;
                    badge.textContent = '🔧 LOCALHOST';
                    header.appendChild(badge);
                }
            }
        });
        
        // Auto-initialize default products for localhost
        if (typeof window.loadProducts === 'function') {
            const originalLoadProducts = window.loadProducts;
            window.loadProducts = function() {
                originalLoadProducts();
                
                // Check if products empty and add defaults
                setTimeout(() => {
                    if (typeof products !== 'undefined' && products.length === 0) {
                        if (typeof initializeDefaultProducts === 'function') {
                            initializeDefaultProducts();
                        }
                    }
                }, 500);
            };
        }
    }
    
    // Export for use in other files
    window.isLocalhost = isLocalhost;
})();

