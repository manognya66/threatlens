// ========================
// Navigation Functionality
// ========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    // If we have sections on the page, highlight based on scroll position
    if (sections.length > 0) {
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    
                    // Check if link points to this section (handle both #id and ./index.html#id)
                    if (href === `#${sectionId}` || href === `./index.html#${sectionId}` || href.endsWith(`#${sectionId}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Highlight nav based on current page on load
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || './index.html';
    const currentHash = window.location.hash;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        // Check if it's the All Posts page
        if (linkHref === 'all-posts.html' && currentPage === 'all-posts.html') {
            link.classList.add('active');
        }
        // Check if it's the home page
        else if ((linkHref === './index.html' || linkHref === '') && (currentPage === './index.html' || currentPage === '')) {
            // If there's a hash, highlight the section link
            if (currentHash && linkHref.includes(currentHash)) {
                link.classList.add('active');
            } else if (!currentHash && !linkHref.includes('#')) {
                link.classList.add('active');
            }
        }
        // Check for section links with hash
        else if (currentHash && linkHref.includes(currentHash)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);
document.addEventListener('DOMContentLoaded', highlightCurrentPage);
window.addEventListener('hashchange', highlightCurrentPage);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    highlightNavLink();
    
    // Also check URL hash on load
    const hash = window.location.hash;
    if (hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash || link.getAttribute('href').endsWith(hash)) {
                link.classList.add('active');
            }
        });
    }
});

// ========================
// Smooth Scrolling
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================
// Intersection Observer for Animations
// ========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe track cards
const trackCards = document.querySelectorAll('.track-card');
trackCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe post cards
const postCards = document.querySelectorAll('.post-card');
postCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe skill badges
const skillBadges = document.querySelectorAll('.skill-badge');
skillBadges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.8)';
    badge.style.transition = `all 0.5s ease ${index * 0.05}s`;
    observer.observe(badge);
});

// ========================
// Dynamic Year in Footer
// ========================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.innerHTML = `&copy; ${currentYear} Network Security Administrator Learning Blog. All rights reserved.`;
}

// ========================
// Search Functionality
// ========================
const searchIcon = document.querySelector('.nav-search');
if (searchIcon && !searchIcon.onclick) {
    // Only add if onclick not already set (to avoid conflict with inline onclick)
    searchIcon.style.cursor = 'pointer';
    if (!searchIcon.getAttribute('onclick')) {
        searchIcon.addEventListener('click', () => {
            window.location.href = 'all-posts.html';
        });
    }
}

// ========================
// Track Card Click Analytics (Placeholder)
// ========================
trackCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('track-link')) {
            const trackLink = card.querySelector('.track-link');
            if (trackLink) {
                // In production, you might want to track this click
                console.log(`Track clicked: ${card.querySelector('.track-title').textContent}`);
            }
        }
    });
});

// ========================
// Add hover effect to post titles
// ========================
const postTitles = document.querySelectorAll('.post-title');
postTitles.forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', function() {
        const readMoreLink = this.closest('.post-card').querySelector('.post-read-more');
        if (readMoreLink) {
            readMoreLink.click();
        }
    });
});

// ========================
// Hero Background Animation
// ========================
const heroBackground = document.querySelector('.hero-background');
if (heroBackground) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        heroBackground.style.backgroundPosition = `${x * 50}px ${y * 50}px`;
    });
}

// ========================
// Loading Animation
// ========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================
// Tag Click Handler
// ========================
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        const tagText = this.textContent.toLowerCase();
        // Redirect to all-posts page with search parameter
        window.location.href = `../all-posts.html?search=${encodeURIComponent(tagText)}`;
    });
});

// ============================================================
// AUTO POST COUNT
// Reads data-category from every .post-card in #posts-timeline
// and writes the total into each track card — automatically.
//
// ADDING A POST  → add data-category="category-name" to the article
// REMOVING A POST → delete the article block
// COUNT UPDATES on every page load. No manual editing needed.
//
// Valid category values:
//   "networking"     → Networking track
//   "windows-server" → Windows Server track
//   "web"            → Web Fundamentals track
//   "presec"         → Pre Security track
//   "pentest"        → Jr Penetration Tester track
// ============================================================
(function updatePostCounts() {
    const categories = {
        'networking':     { badge: 'badge-networking'     },
        'windows-server': { badge: 'badge-windows-server' },
        'web':            { badge: 'badge-web'            },
        'presec':         { badge: 'badge-presec'         },
        'pentest':        { badge: 'badge-pentest'        },
    };

    // Tally each category
    const totals = Object.fromEntries(Object.keys(categories).map(k => [k, 0]));
    document.querySelectorAll('#posts-timeline .post-card[data-category]').forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat in totals) totals[cat]++;
    });

    // Update badge text based on post count
    Object.entries(categories).forEach(([cat, ids]) => {
        const n = totals[cat];

        const badgeEl = document.getElementById(ids.badge);
        if (!badgeEl) return;

        if (n === 0) {
            badgeEl.textContent = 'Getting Started';
            badgeEl.style.cssText = '';
        } else if (n <= 3) {
            badgeEl.textContent = 'In Progress';
            badgeEl.style.cssText = 'background:rgba(6,182,212,0.15);color:#22d3ee;';
        } else {
            badgeEl.textContent = 'Active';
            badgeEl.style.cssText = 'background:rgba(16,185,129,0.15);color:#34d399;';
        }
    });
})();

// ========================
// Console Easter Egg
// ========================
console.log('%c🔒 Network Security Administrator Blog', 'color: #64ffda; font-size: 20px; font-weight: bold;');
console.log('%cLearning in public, one lab at a time.', 'color: #8892b0; font-size: 14px;');
console.log('%cInterested in contributing? Check out the source code!', 'color: #64ffda; font-size: 12px;');