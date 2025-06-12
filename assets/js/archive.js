import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Form validation
(function () {
    'use strict'

    // Form validation for all forms with needs-validation class
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

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity()) {
            // Show success message
            const formContainer = e.currentTarget.closest('.newsletter-container');
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success text-center';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle fs-1 text-success mb-3"></i>
                <h4>Thank You!</h4>
                <p>You've been successfully subscribed to our newsletter.</p>
            `;
            
            // Replace form with success message
            e.currentTarget.style.display = 'none';
            e.currentTarget.insertAdjacentElement('afterend', successMessage);
        } else {
            e.currentTarget.classList.add('was-validated');
        }
    });
}

// Subscribe form in footer
document.querySelector('.subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
        e.currentTarget.classList.add('subscribed');
    }
})

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
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matchesSearch = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                features.some(feature => feature.includes(searchTerm));
            
            card.closest('.col-md-6').style.display = matchesSearch ? 'block' : 'none';
        });
        
        updateResultsCount();
    });
}

// Price range slider functionality
function initPriceRangeSlider() {
    const rangeInput = document.querySelectorAll(".range-slider input");
    const priceInput = document.querySelectorAll(".price-inputs input");
    const range = document.querySelector(".range-slider .progress");
    let priceGap = 100;
    
    if (!rangeInput.length) return;
    
    priceInput.forEach(input => {
        input.addEventListener("input", e => {
            let minPrice = parseInt(priceInput[0].value);
            let maxPrice = parseInt(priceInput[1].value);
            
            if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
                if (e.target.className === "input-min") {
                    rangeInput[0].value = minPrice;
                } else {
                    rangeInput[1].value = maxPrice;
                }
            }
        });
    });
    
    rangeInput.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(rangeInput[0].value);
            let maxVal = parseInt(rangeInput[1].value);
            
            if ((maxVal - minVal) < priceGap) {
                if (e.target.className === "min-price") {
                    rangeInput[0].value = maxVal - priceGap;
                } else {
                    rangeInput[1].value = minVal + priceGap;
                }
            } else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
            }
        });
    });
}

// Initialize price range slider
initPriceRangeSlider();

// Archive page functionality
class ArchiveManager {
    constructor() {
        this.filters = {
            coverage: [],
            signal: [],
            carrier: [],
            price: []
        };
        this.sortBy = 'featured';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.totalItems = 24; // This would come from your data source
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initPagination();
        this.updateResultsCount();
        this.setupQuickView();
        this.setupWishlist();
        this.setupCompare();
        this.setupAddToCart();
    }

    bindEvents() {
        // Filter checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFilterChange(e);
                this.updateActiveFilters();
            });
        });

        // Apply filters button
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applySort();
            });
        }

        // Per page selector
        const perPageSelect = document.getElementById('per-page');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1; // Reset to first page
                this.applyFilters();
            });
        }
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

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        let hasActiveFilters = false;
        
        // Create filter tags for each active filter
        Object.entries(this.filters).forEach(([type, values]) => {
            values.forEach(value => {
                hasActiveFilters = true;
                
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                
                // Get readable filter name
                let filterName = value.charAt(0).toUpperCase() + value.slice(1);
                
                // Special case for coverage
                if (type === 'coverage') {
                    if (value === 'small') filterName = 'Small Space';
                    if (value === 'medium') filterName = 'Medium Space';
                    if (value === 'large') filterName = 'Large Space';
                    if (value === 'huge') filterName = 'Huge Space';
                }
                
                filterTag.innerHTML = `
                    ${filterName}
                    <button data-type="${type}" data-value="${value}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add event listener to remove button
                filterTag.querySelector('button').addEventListener('click', (e) => {
                    const type = e.currentTarget.dataset.type;
                    const value = e.currentTarget.dataset.value;
                    
                    // Uncheck the corresponding checkbox
                    const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = false;
                    
                    // Remove from filters
                    this.filters[type] = this.filters[type].filter(v => v !== value);
                    
                    // Update UI
                    this.updateActiveFilters();
                    this.applyFilters();
                });
                
                activeFiltersContainer.appendChild(filterTag);
            });
        });
        
        // Show or hide the active filters container
        activeFiltersContainer.style.display = hasActiveFilters ? 'flex' : 'none';
    }

    applyFilters() {
        // Show loading state
        this.showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            this.filterProducts();
            this.hideLoadingState();
            this.updateResultsCount();
            this.initPagination(); // Reinitialize pagination
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
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'featured';
            this.sortBy = 'featured';
        }
        
        // Reset search
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset price range
        const minPriceInput = document.querySelector('.input-min');
        const maxPriceInput = document.querySelector('.input-max');
        const minPriceSlider = document.querySelector('.min-price');
        const maxPriceSlider = document.querySelector('.max-price');
        
        if (minPriceInput && maxPriceInput && minPriceSlider && maxPriceSlider) {
            minPriceInput.value = 0;
            maxPriceInput.value = 1000;
            minPriceSlider.value = 0;
            maxPriceSlider.value = 1000;
        }
        
        // Update UI
        this.updateActiveFilters();
        this.applyFilters();
    }

    filterProducts() {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const shouldShow = this.shouldShowProduct(card);
            
            if (shouldShow) {
                card.closest('.col-md-6').style.display = 'block';
                visibleCount++;
            } else {
                card.closest('.col-md-6').style.display = 'none';
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
        const container = document.querySelector('.products-grid .row');
        const products = Array.from(container.children);
        
        products.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'newest':
                    return -1; // Newest first
                case 'rating':
                    return this.getRating(b) - this.getRating(a);
                case 'featured':
                default:
                    return 0; // Keep original order
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

    getRating(productElement) {
        const ratingElement = productElement.querySelector('.product-rating span');
        if (ratingElement) {
            return parseInt(ratingElement.textContent.replace(/[()]/g, ''));
        }
        return 0;
    }

    showLoadingState() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    }

    hideLoadingState() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }

    showEmptyState() {
        const productsGrid = document.querySelector('.products-grid .row');
        if (!document.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state text-center py-5';
            emptyState.innerHTML = `
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria to find what you're looking for.</p>
                <button class="btn-primary px-4 py-2" onclick="archiveManager.clearFilters()">
                    <i class="fas fa-undo-alt me-2"></i>Clear All Filters
                </button>
            `;
            productsGrid.appendChild(emptyState);
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

        // Calculate total pages
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // Clear existing pagination
        const prevButton = paginationContainer.querySelector('.prev');
        const nextButton = paginationContainer.querySelector('.next');
        
        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info p');
        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
            paginationInfo.innerHTML = `Showing <span>${start}-${end}</span> of <span>${this.totalItems}</span> products`;
        }
        
        // Update prev/next buttons
        if (prevButton) {
            prevButton.disabled = this.currentPage === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = this.currentPage === totalPages;
        }
        
        // Add click events to page buttons
        document.querySelectorAll('.page-btn:not(.prev):not(.next)').forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) return;
                
                document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentPage = parseInt(button.textContent);
                this.applyFilters();
                
                // Scroll to top of products
                document.querySelector('.products-header').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Add click events to prev/next buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.applyFilters();
                    
                    // Update active button
                    document.querySelectorAll('.page-btn:not(.prev):not(.next)').forEach(btn => {
                        if (parseInt(btn.textContent) === this.currentPage) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.applyFilters();
                    
                    // Update active button
                    document.querySelectorAll('.page-btn:not(.prev):not(.next)').forEach(btn => {
                        if (parseInt(btn.textContent) === this.currentPage) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            });
        }
    }

    setupQuickView() {
        // Quick view functionality
        document.querySelectorAll('.quickview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product data from the card
                const card = e.currentTarget.closest('.product-card');
                const title = card.querySelector('.product-title').textContent;
                const price = card.querySelector('.current-price').textContent;
                const originalPrice = card.querySelector('.original-price')?.textContent || '';
                const description = card.querySelector('.product-description').textContent;
                const image = card.querySelector('.product-image img').src;
                const rating = card.querySelector('.product-rating').innerHTML;
                
                // Update modal with product data
                const modal = document.getElementById('quickview-modal');
                if (modal) {
                    modal.querySelector('.product-title').textContent = title;
                    modal.querySelector('.product-rating').innerHTML = rating;
                    modal.querySelector('.current-price').textContent = price;
                    
                    if (originalPrice) {
                        modal.querySelector('.original-price').textContent = originalPrice;
                        modal.querySelector('.original-price').style.display = 'inline';
                        
                        // Calculate discount percentage
                        const currentPrice = parseFloat(price.replace('£', ''));
                        const origPrice = parseFloat(originalPrice.replace('£', ''));
                        const discount = Math.round((origPrice - currentPrice) / origPrice * 100);
                        modal.querySelector('.discount-badge').textContent = `-${discount}%`;
                        modal.querySelector('.discount-badge').style.display = 'inline';
                    } else {
                        if (modal.querySelector('.original-price')) {
                            modal.querySelector('.original-price').style.display = 'none';
                        }
                        if (modal.querySelector('.discount-badge')) {
                            modal.querySelector('.discount-badge').style.display = 'none';
                        }
                    }
                    
                    modal.querySelector('.product-description').textContent = description;
                    modal.querySelector('.quickview-image img').src = image;
                    
                    // Show modal
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                }
            });
        });
    }

    setupWishlist() {
        // Wishlist functionality
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Toggle heart icon
                const icon = e.currentTarget.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#FF4444';
                    
                    // Show notification
                    this.showNotification('Product added to wishlist', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    
                    // Show notification
                    this.showNotification('Product removed from wishlist', 'info');
                }
            });
        });
    }

    setupCompare() {
        // Compare functionality
        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product title
                const card = e.currentTarget.closest('.product-card');
                const title = card.querySelector('.product-title').textContent;
                
                // Show notification
                this.showNotification(`${title} added to compare list`, 'success');
            });
        });
    }

    setupAddToCart() {
        // Add to cart functionality
        document.querySelectorAll('.btn-cart, .btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product data
                const card = e.currentTarget.closest('.product-card') || e.currentTarget.closest('.modal-content');
                const title = card.querySelector('.product-title').textContent;
                const price = card.querySelector('.current-price').textContent;
                
                // Get quantity if in modal
                let quantity = 1;
                const quantityInput = card.querySelector('.quantity-selector input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value);
                }
                
                // Show notification
                this.showNotification(`${quantity} × ${title} added to cart`, 'success');
                
                // Update cart count
                const cartCount = document.querySelectorAll('.cart-count');
                cartCount.forEach(count => {
                    const currentCount = parseInt(count.textContent);
                    count.textContent = currentCount + quantity;
                    count.classList.add('pulse');
                    setTimeout(() => {
                        count.classList.remove('pulse');
                    }, 500);
                });
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00C73C' : type === 'error' ? '#FF4444' : '#1434CB'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto close
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize archive manager
const archiveManager = new ArchiveManager();

// Make it globally available for pagination buttons
window.archiveManager = archiveManager;

// Initialize quantity selectors in quick view modal
document.addEventListener('shown.bs.modal', function (event) {
    if (event.target.id === 'quickview-modal') {
        const quantitySelector = event.target.querySelector('.quantity-selector');
        if (quantitySelector) {
            const minusBtn = quantitySelector.querySelector('.minus');
            const plusBtn = quantitySelector.querySelector('.plus');
            const input = quantitySelector.querySelector('input');
            
            minusBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                value = Math.max(1, value - 1);
                input.value = value;
            });
            
            plusBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                value = Math.min(10, value + 1);
                input.value = value;
            });
            
            input.addEventListener('change', () => {
                let value = parseInt(input.value);
                if (isNaN(value) || value < 1) {
                    value = 1;
                } else if (value > 10) {
                    value = 10;
                }
                input.value = value;
            });
        }
    }
});

// Add CSS for cart count animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .cart-count.pulse {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);