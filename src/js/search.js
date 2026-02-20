// ========================
// Search and Filter Functionality
// ========================

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const postsContainer = document.getElementById('postsContainer');
const noResults = document.getElementById('noResults');
const countNumber = document.getElementById('countNumber');

function initSearch() {
    document.getElementById('posts').scrollIntoView({behavior:'smooth'}); 
    setTimeout(()=>document.querySelector('#posts .post-title')?.focus(),500);
}

// Get all post cards
const allPosts = Array.from(document.querySelectorAll('.post-card'));

// Set initial count on page load
if (countNumber && allPosts.length > 0) {
    countNumber.textContent = allPosts.length;
}

function filterPosts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    let visibleCount = 0;
    
    allPosts.forEach(post => {
        const title = post.getAttribute('data-title').toLowerCase();
        const tags = post.getAttribute('data-tags').toLowerCase();
        const category = post.getAttribute('data-category');
        const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
        
        // Check if post matches search term
        const matchesSearch = searchTerm === '' || 
                            title.includes(searchTerm) || 
                            tags.includes(searchTerm) ||
                            excerpt.includes(searchTerm);
        
        // Check if post matches category filter
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        
        // Show or hide post
        if (matchesSearch && matchesCategory) {
            post.style.display = 'flex';
            visibleCount++;
            
            // Add fade-in animation
            post.style.animation = 'fadeIn 0.5s ease';
        } else {
            post.style.display = 'none';
        }
    });
    
    // Update results count
    countNumber.textContent = visibleCount;
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
        postsContainer.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        postsContainer.style.display = 'flex';
    }
    
    // Clear highlights if search is empty
    if (searchTerm === '') {
        clearHighlights();
    }
}

// Event listeners
if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', filterPosts);
}

// Clear search on Escape key
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterPosts();
        }
    });
}

// ========================
// Search Modal (for navigation search icon)
// ========================

const searchIconNav = document.getElementById('searchIconNav');

if (searchIconNav) {
    searchIconNav.addEventListener('click', () => {
        // If on all-posts page, focus search input
        if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Redirect to all posts page
            window.location.href = 'all-posts.html';
        }
    });
}

// ========================
// Highlight search terms
// ========================

function clearHighlights() {
    allPosts.forEach(post => {
        const title = post.querySelector('.post-title');
        const excerpt = post.querySelector('.post-excerpt');
        
        // Only clear if there are actual mark tags
        if (title && title.innerHTML.includes('<mark')) {
            title.innerHTML = title.textContent;
        }
        if (excerpt && excerpt.innerHTML.includes('<mark')) {
            excerpt.innerHTML = excerpt.textContent;
        }
    });
}

function highlightSearchTerm() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Clear all highlights first
    clearHighlights();
    
    // Only highlight if search term is at least 2 characters
    if (searchTerm === '' || searchTerm.length < 2) return;
    
    allPosts.forEach(post => {
        if (post.style.display !== 'none') {
            const title = post.querySelector('.post-title');
            const excerpt = post.querySelector('.post-excerpt');
            
            const titleText = title.textContent;
            const excerptText = excerpt.textContent;
            
            // Escape special regex characters
            const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            if (titleText.toLowerCase().includes(searchTerm)) {
                const regex = new RegExp(`(${escapedTerm})`, 'gi');
                title.innerHTML = titleText.replace(regex, '<mark style="background: var(--accent-cyan); color: var(--primary-bg); padding: 0 0.2rem; border-radius: 2px;">$1</mark>');
            }
            
            if (excerptText.toLowerCase().includes(searchTerm)) {
                const regex = new RegExp(`(${escapedTerm})`, 'gi');
                excerpt.innerHTML = excerptText.replace(regex, '<mark style="background: var(--accent-cyan); color: var(--primary-bg); padding: 0 0.2rem; border-radius: 2px;">$1</mark>');
            }
        }
    });
}

// Add highlight on search
if (searchInput) {
    searchInput.addEventListener('input', () => {
        setTimeout(highlightSearchTerm, 100);
    });
}

// ========================
// Tag Click to Filter
// ========================

document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.style.cursor = 'pointer';
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagText = this.textContent.toLowerCase();
            
            if (searchInput) {
                searchInput.value = tagText;
                filterPosts();
                highlightSearchTerm();
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});

// ========================
// URL Parameters for Search
// ========================

// Check if there's a search parameter in URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
        filterPosts();
        highlightSearchTerm();
    }
    
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
        filterPosts();
    }
});

// Update URL when searching
function updateURL() {
    const searchTerm = searchInput?.value || '';
    const category = categoryFilter?.value || 'all';
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category !== 'all') params.set('category', category);
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

if (searchInput) {
    searchInput.addEventListener('input', updateURL);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', updateURL);
}

// ========================
// Keyboard Navigation
// ========================

let currentFocus = -1;

if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        const visiblePosts = allPosts.filter(post => post.style.display !== 'none');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= visiblePosts.length) currentFocus = 0;
            setActive(visiblePosts);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) currentFocus = visiblePosts.length - 1;
            setActive(visiblePosts);
        } else if (e.key === 'Enter' && currentFocus > -1) {
            e.preventDefault();
            if (visiblePosts[currentFocus]) {
                const link = visiblePosts[currentFocus].querySelector('.post-read-more');
                if (link) link.click();
            }
        }
    });
}

function setActive(posts) {
    removeActive(posts);
    if (currentFocus >= posts.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = posts.length - 1;
    
    if (posts[currentFocus]) {
        posts[currentFocus].style.transform = 'translateX(15px)';
        posts[currentFocus].style.boxShadow = '0 0 30px rgba(100, 255, 218, 0.3)';
        posts[currentFocus].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function removeActive(posts) {
    posts.forEach(post => {
        post.style.transform = '';
        post.style.boxShadow = '';
    });
}

console.log('%c🔍 Search System Active', 'color: #64ffda; font-size: 14px; font-weight: bold;');
console.log('%cTry searching or filtering posts!', 'color: #8892b0; font-size: 12px;');
