import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Archive page functionality
(function () {
    'use strict'

    // Form validation
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()

// Subscribe form
document.querySelector('.subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
        e.currentTarget.classList.add('subscribed');
    }
})

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity()) {
            // Show success message
            const formContainer = e.currentTarget.closest('.card-body');
            formContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                    <h4 class="mt-3" style="color: var(--primary-color);">Thank You!</h4>
                    <p class="mb-0">You've been successfully subscribed to our newsletter.</p>
                </div>
            `;
        } else {
            e.currentTarget.classList.add('was-validated');
        }
    });
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('[data-bs-toggle="collapse"]');
    const fullscreenNav = document.querySelector(".fullscreen-nav");

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        fullscreenNav.classList.toggle("active");
    });
});

// Menu list toggle
function handleMenuList(e) {
    e.currentTarget.classList.toggle('active');
}

document.querySelectorAll('.navbar-list > li').forEach((el) => {
    el.addEventListener('click', handleMenuList);
});

// Country selection
document.querySelectorAll('.country-item').forEach((country) => {
    country.addEventListener('click', (e) => {
        if (e.currentTarget.querySelector('input[type=radio]').checked) {
            document.querySelector('#openPopup img').src = e.currentTarget.querySelector('img').src;
        } else {
            document.querySelector('#openPopup img').src = 'https://flagcdn.com/gb.svg';
        }
    })
})

// Back to top button
const backToTopButton = document.getElementById('back-to-top');
if (backToTopButton) {
    // Show button when user scrolls down 300px
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Product search functionality
const productSearch = document.getElementById('productSearch');
if (productSearch) {
    productSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.archive-product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matchesSearch = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                features.some(feature => feature.includes(searchTerm));
            
            card.closest('.col-12').style.display = matchesSearch ? 'block' : 'none';
        });
        
        updateResultsCount();
    });
}

// Archive-specific functionality
class ArchiveManager {
    constructor() {
        this.filters = {
            coverage: [],
            signal: [],
            carrier: [],
            price: []
        };
        this.sortBy = 'newest';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.totalItems = 24; // This would come from your data source
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initPagination();
        this.updateResultsCount();
        this.setupLoadMore();
    }

    bindEvents() {
        // Filter checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFilterChange(e);
            });
        });

        // Apply filters button
        document.getElementById('apply-filters')?.addEventListener('click', () => {
            this.applyFilters();
        });

        // Clear filters button
        document.getElementById('clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Sort dropdown
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applySort();
        });
    }

    handleFilterChange(e) {
        const filterType = e.target.name;
        const filterValue = e.target.value;
        
        if (e.target.checked) {
            if (!this.filters[filterType].includes(filterValue)) {
                this.filters[filterType].push(filterValue);
            }
        } else {
            this.filters[filterType] = this.filters[filterType].filter(value => value !== filterValue);
        }
    }

    applyFilters() {
        // Show loading state
        this.showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            this.filterProducts();
            this.hideLoadingState();
            this.updateResultsCount();
        }, 500);
    }

    clearFilters() {
        // Reset all filters
        this.filters = {
            coverage: [],
            signal: [],
            carrier: [],
            price: []
        };
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset sort
        document.getElementById('sort-select').value = 'newest';
        this.sortBy = 'newest';
        
        // Reset search
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Apply changes
        this.applyFilters();
    }

    filterProducts() {
        const productCards = document.querySelectorAll('.archive-product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const shouldShow = this.shouldShowProduct(card);
            
            if (shouldShow) {
                card.parentElement.style.display = 'block';
                visibleCount++;
            } else {
                card.parentElement.style.display = 'none';
            }
        });
        
        this.totalItems = visibleCount;
        
        // Show empty state if no products match
        if (visibleCount === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
        }
    }

    shouldShowProduct(card) {
        // This is a simplified example - in a real app, you'd have product data
        // and match against the actual product attributes
        
        // For demo purposes, we'll show/hide based on some basic logic
        const hasActiveFilters = Object.values(this.filters).some(arr => arr.length > 0);
        
        if (!hasActiveFilters) {
            return true; // Show all products if no filters are active
        }
        
        // In a real implementation, you'd check the product's actual attributes
        // against the selected filters
        return Math.random() > 0.3; // Random for demo
    }

    applySort() {
        const container = document.querySelector('.archive-products-grid .row');
        const products = Array.from(container.children);
        
        products.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'newest':
                    return 1; // Keep current order for newest
                case 'oldest':
                    return -1; // Reverse order for oldest
                case 'popular':
                    return Math.random() - 0.5; // Random for demo
                default:
                    return 0;
            }
        });
        
        // Re-append sorted products
        products.forEach(product => container.appendChild(product));
    }

    getPrice(productElement) {
        const priceElement = productElement.querySelector('.current-price');
        if (priceElement) {
            return parseFloat(priceElement.textContent.replace('£', ''));
        }
        return 0;
    }

    showLoadingState() {
        const productCards = document.querySelectorAll('.archive-product-card');
        productCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    }

    hideLoadingState() {
        const productCards = document.querySelectorAll('.archive-product-card');
        productCards.forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }

    showEmptyState() {
        const container = document.querySelector('.archive-products-grid');
        if (!document.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria to find what you're looking for.</p>
                <button class="btn-primary" onclick="archiveManager.clearFilters()">Clear All Filters</button>
            `;
            container.appendChild(emptyState);
        }
    }

    hideEmptyState() {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.totalItems;
        }
    }

    initPagination() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        // Set up pagination buttons
        const prevButton = paginationContainer.querySelector('.prev');
        const nextButton = paginationContainer.querySelector('.next');
        const pageButtons = paginationContainer.querySelectorAll('.page-btn:not(.prev):not(.next)');
        
        // Add click events
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                pageButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current page
                this.currentPage = parseInt(button.textContent);
                
                // Enable/disable prev/next buttons
                prevButton.disabled = this.currentPage === 1;
                nextButton.disabled = this.currentPage === pageButtons.length;
                
                // Scroll to top of results
                document.querySelector('.archive-results-header').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Prev button
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                
                // Update active button
                pageButtons.forEach(btn => {
                    if (parseInt(btn.textContent) === this.currentPage) {
                        btn.click();
                    }
                });
            }
        });
        
        // Next button
        nextButton.addEventListener('click', () => {
            if (this.currentPage < pageButtons.length) {
                this.currentPage++;
                
                // Update active button
                pageButtons.forEach(btn => {
                    if (parseInt(btn.textContent) === this.currentPage) {
                        btn.click();
                    }
                });
            }
        });
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', () => {
            // Show loading state
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                this.loadMoreProducts();
                
                // Reset button
                loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Load More Products';
                loadMoreBtn.disabled = false;
            }, 1000);
        });
    }

    loadMoreProducts() {
        const container = document.querySelector('.archive-products-grid .row');
        const productTemplate = container.querySelector('.col-12').cloneNode(true);
        
        // Add 3 more products
        for (let i = 0; i < 3; i++) {
            const newProduct = productTemplate.cloneNode(true);
            
            // Randomize some details to make it look different
            const productCard = newProduct.querySelector('.archive-product-card');
            const productTitle = newProduct.querySelector('h4');
            const productPrice = newProduct.querySelector('.current-price');
            
            productTitle.textContent = `Signal Booster ${Math.floor(Math.random() * 1000)}`;
            productPrice.textContent = `£${(Math.random() * 500 + 100).toFixed(2)}`;
            
            // Remove any badges
            const badge = newProduct.querySelector('.product-badge');
            if (badge) badge.remove();
            
            // Add to container
            container.appendChild(newProduct);
        }
        
        // Update total count
        this.totalItems += 3;
        this.updateResultsCount();
    }
}

// Initialize archive manager
const archiveManager = new ArchiveManager();

// Make it globally available for pagination buttons
window.archiveManager = archiveManager;

// Add CSS for back to top button
const style = document.createElement('style');
style.textContent = `
    .back-to-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-hover-color));
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 99;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top-btn.show {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);