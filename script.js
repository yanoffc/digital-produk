// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// WhatsApp Number - Update this with your actual WhatsApp number
// Format: 6281234567890 (country code + number without + or 0)
// The links in HTML use: https://wa.me/6281234567890

// Counter Animation for Stats
const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItem = entry.target;
            if (statItem.classList.contains('animated')) return;
            
            statItem.classList.add('animated');
            const statText = statItem.querySelector('h3').textContent;
            
            // Extract number and suffix
            const match = statText.match(/(\d+)(.*)/);
            if (match) {
                const number = parseInt(match[1]);
                const suffix = match[2] || '';
                const h3Element = statItem.querySelector('h3');
                animateCounter(h3Element, number, suffix);
            }
        }
    });
}, { threshold: 0.5 });

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .testimonial-card, .step-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize stats observer
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
});


// Add click tracking for WhatsApp buttons (optional - for analytics)
document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
    button.addEventListener('click', () => {
        // You can add analytics tracking here
        console.log('WhatsApp button clicked');
    });
});

