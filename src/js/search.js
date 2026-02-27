// ========================
// Simple and Reliable Search
// ========================

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const postsContainer = document.getElementById('postsContainer');
const noResults = document.getElementById('noResults');
const countNumber = document.getElementById('countNumber');

// Get all post cards
const allPosts = Array.from(document.querySelectorAll('.post-card'));

console.log(`🔍 Search initialized: Found ${allPosts.length} posts`);

// Set initial count
if (countNumber && allPosts.length > 0) {
    countNumber.textContent = allPosts.length;
}

function filterPosts() {
    if (!searchInput || !categoryFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    let visibleCount = 0;
    
    allPosts.forEach(post => {
        // Get category from data-category or from the category badge
        let category = post.getAttribute('data-category');
        if (!category) {
            const categoryBadge = post.querySelector('.post-category');
            if (categoryBadge) {
                const badgeText = categoryBadge.textContent.toLowerCase().trim();
                if (badgeText.includes('networking')) category = 'networking';
                else if (badgeText.includes('windows')) category = 'windows-server';
                else if (badgeText.includes('web')) category = 'web';
                else if (badgeText.includes('security') || badgeText.includes('presec')) category = 'presec';
                else if (badgeText.includes('pentest')) category = 'pentest';
            }
        }
        
        // Get ALL text content from the post card
        const allText = post.textContent.toLowerCase();
        
        // Check if matches search
        const matchesSearch = searchTerm === '' || allText.includes(searchTerm);
        
        // Check if matches category
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        
        // Show or hide
        if (matchesSearch && matchesCategory) {
            post.style.display = 'flex';
            visibleCount++;
        } else {
            post.style.display = 'none';
        }
    });
    
    // Update count
    if (countNumber) {
        countNumber.textContent = visibleCount;
    }
    
    // Show/hide no results
    if (visibleCount === 0) {
        if (noResults) noResults.style.display = 'block';
        if (postsContainer) postsContainer.style.display = 'none';
    } else {
        if (noResults) noResults.style.display = 'none';
        if (postsContainer) postsContainer.style.display = 'flex';
    }
    
    // Highlight search terms
    if (searchTerm.length >= 2) {
        highlightSearchTerm(searchTerm);
    } else {
        clearHighlights();
    }
}

function clearHighlights() {
    allPosts.forEach(post => {
        const title = post.querySelector('.post-title');
        const excerpt = post.querySelector('.post-excerpt');
        
        if (title && title.innerHTML.includes('<mark')) {
            title.innerHTML = title.textContent;
        }
        if (excerpt && excerpt.innerHTML.includes('<mark')) {
            excerpt.innerHTML = excerpt.textContent;
        }
    });
}

function highlightSearchTerm(searchTerm) {
    clearHighlights();
    
    allPosts.forEach(post => {
        if (post.style.display !== 'none') {
            const title = post.querySelector('.post-title');
            const excerpt = post.querySelector('.post-excerpt');
            
            if (title) {
                const titleText = title.textContent;
                const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                try {
                    if (titleText.toLowerCase().includes(searchTerm)) {
                        const regex = new RegExp(`(${escapedTerm})`, 'gi');
                        title.innerHTML = titleText.replace(regex, '<mark style="background: var(--accent-cyan); color: var(--primary-bg); padding: 0 0.2rem; border-radius: 2px;">$1</mark>');
                    }
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
            
            if (excerpt) {
                const excerptText = excerpt.textContent;
                const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                try {
                    if (excerptText.toLowerCase().includes(searchTerm)) {
                        const regex = new RegExp(`(${escapedTerm})`, 'gi');
                        excerpt.innerHTML = excerptText.replace(regex, '<mark style="background: var(--accent-cyan); color: var(--primary-bg); padding: 0 0.2rem; border-radius: 2px;">$1</mark>');
                    }
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
        }
    });
}

// Event listeners
if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', filterPosts);
}

// Clear search on Escape
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            categoryFilter.value = 'all';
            filterPosts();
        }
    });
}

// URL parameters
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }
    
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
    }
    
    if (searchParam || categoryParam) {
        filterPosts();
    }
});

console.log('%c✅ Simple Search Active', 'color: #64ffda; font-weight: bold;');
