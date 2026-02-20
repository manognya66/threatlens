// ========================
// Table of Contents Active Link
// ========================
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('.post-content-main section[id]');

function updateActiveTocLink() {
    // Get current scroll position with offset for fixed header
    const scrollPosition = window.scrollY + 200;
    
    let currentSectionId = '';
    
    // Find which section we're currently viewing
    // Loop through sections in reverse to get the current one
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        
        if (scrollPosition >= sectionTop) {
            currentSectionId = section.getAttribute('id');
            break;
        }
    }
    
    // If we're at the very top, use the first section
    if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].getAttribute('id');
    }
    
    // Update active class on TOC links
    tocLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll handler for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveTocLink, 50);
}, { passive: true });

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('TOC: Sections found:', sections.length);
    console.log('TOC: Links found:', tocLinks.length);
    setTimeout(updateActiveTocLink, 100);
});

// Also update after everything loads
window.addEventListener('load', () => {
    setTimeout(updateActiveTocLink, 200);
});

// ========================
// Code Copy Functionality
// ========================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code to clipboard');
    });
}

// Make copyCode function globally available
window.copyCode = copyCode;

// ========================
// Syntax Highlighting
// ========================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
});

// ========================
// Reading Progress Bar
// ========================
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #64ffda, #00ff88);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
}

function updateProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = progress + '%';
}

createProgressBar();
window.addEventListener('scroll', updateProgressBar);

// ========================
// Smooth Scroll with Offset for TOC
// ========================
tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================
// Share Buttons Functionality
// ========================
const shareButtons = document.querySelectorAll('.share-btn');

shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const pageUrl = window.location.href;
        const pageTitle = document.querySelector('.post-main-title').textContent;
        
        if (this.classList.contains('twitter')) {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
            window.open(twitterUrl, '_blank', 'width=550,height=450');
        } else if (this.classList.contains('linkedin')) {
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
            window.open(linkedinUrl, '_blank', 'width=550,height=450');
        } else if (this.classList.contains('reddit')) {
            const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
            window.open(redditUrl, '_blank', 'width=550,height=450');
        } else if (this.classList.contains('link')) {
            navigator.clipboard.writeText(pageUrl).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            }).catch(err => {
                alert('Failed to copy link to clipboard');
            });
        }
    });
});

// ========================
// Image Zoom on Click
// ========================
const images = document.querySelectorAll('.post-content-main img');
images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            padding: 2rem;
        `;
        
        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            modal.remove();
        });
    });
});

// ========================
// Estimated Reading Time
// ========================
function calculateReadingTime() {
    const article = document.querySelector('.post-content-main');
    if (!article) return;
    
    const text = article.textContent;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    const readingTimeElement = document.querySelector('.meta-item .fa-clock')?.parentElement?.querySelector('span');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

calculateReadingTime();

// ========================
// Code Block Line Numbers (Optional Enhancement)
// ========================
function addLineNumbers() {
    const codeBlocks = document.querySelectorAll('.code-block pre code');
    codeBlocks.forEach(codeBlock => {
        const lines = codeBlock.textContent.split('\n');
        if (lines.length > 5) { // Only add line numbers if more than 5 lines
            const lineNumbers = lines.map((_, i) => i + 1).join('\n');
            
            const lineNumbersDiv = document.createElement('div');
            lineNumbersDiv.className = 'line-numbers';
            lineNumbersDiv.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                padding: 1.5rem 0.5rem;
                background: rgba(0, 0, 0, 0.3);
                color: #666;
                text-align: right;
                user-select: none;
                border-right: 1px solid rgba(100, 255, 218, 0.1);
                font-family: 'Fira Code', monospace;
                font-size: 0.95rem;
                line-height: 1.6;
            `;
            lineNumbersDiv.textContent = lineNumbers;
            
            const pre = codeBlock.parentElement;
            pre.style.position = 'relative';
            pre.style.paddingLeft = '3.5rem';
            pre.insertBefore(lineNumbersDiv, codeBlock);
        }
    });
}

// Uncomment to enable line numbers
// addLineNumbers();

// ========================
// External Links - Open in New Tab
// ========================
const externalLinks = document.querySelectorAll('a[href^="http"]');
externalLinks.forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ========================
// Keyboard Shortcuts
// ========================
document.addEventListener('keydown', (e) => {
    // Press 'Esc' to close any modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[style*="position: fixed"]');
        modals.forEach(modal => modal.remove());
    }
    
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ========================
// Print Styles Optimization
// ========================
window.addEventListener('beforeprint', () => {
    // Hide sidebar when printing
    const sidebar = document.querySelector('.post-sidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
});

window.addEventListener('afterprint', () => {
    // Restore sidebar after printing
    const sidebar = document.querySelector('.post-sidebar');
    if (sidebar) {
        sidebar.style.display = 'block';
    }
});

// ========================
// Performance: Lazy Load Images
// ========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================
// Console Message
// ========================
console.log('%c📖 Reading: ' + document.querySelector('.post-main-title').textContent, 'color: #64ffda; font-size: 16px; font-weight: bold;');
