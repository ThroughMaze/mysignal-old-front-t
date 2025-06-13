import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
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
        if (e.preventDefault(), e.currentTarget.checkValidity()) {
            const container = e.currentTarget.closest('.newsletter-container');
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success text-center';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle fs-1 text-success mb-3"></i>
                <h4>Thank You!</h4>
                <p>You've been successfully subscribed to our newsletter.</p>
            `;
            e.currentTarget.style.display = 'none';
            e.currentTarget.insertAdjacentElement('afterend', successMessage);
        } else {
            e.currentTarget.classList.add('was-validated');
        }
    });
}

// Subscribe form
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
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Product search
const productSearch = document.getElementById('productSearch');
if (productSearch) {
    productSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.product-card').forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
            
            const isMatch = title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           features.some(feature => feature.includes(searchTerm));
            
            card.closest('.col-md-6').style.display = isMatch ? 'block' : 'none';
        });
        
        updateResultsCount();
    });
}

// Price range slider
function setupPriceRangeSlider() {
    const rangeInput = document.querySelectorAll(".range-slider input");
    const priceInput = document.querySelectorAll(".price-inputs input");
    const progress = document.querySelector(".range-slider .progress");
    let priceGap = 100;

    if (rangeInput.length) {
        priceInput.forEach(input => {
            input.addEventListener("input", e => {
                let minVal = parseInt(priceInput[0].value);
                let maxVal = parseInt(priceInput[1].value);

                if ((maxVal - minVal >= priceGap) && maxVal <= rangeInput[1].max) {
                    if (e.target.className === "input-min") {
                        rangeInput[0].value = minVal;
                    } else {
                        rangeInput[1].value = maxVal;
                    }
                }
            });
        });

        rangeInput.forEach(input => {
            input.addEventListener("input", e => {
                let minVal = parseInt(rangeInput[0].value);
                let maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
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
}

setupPriceRangeSlider();

// Archive Manager Class
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
        this.totalItems = 24;
        
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
        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Clear filters button
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applySort();
            });
        }
        
        // Per page select
        const perPageSelect = document.getElementById('per-page');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
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
        
        Object.entries(this.filters).forEach(([filterType, values]) => {
            values.forEach(value => {
                hasActiveFilters = true;
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                
                // Format the display text
                let displayText = value.charAt(0).toUpperCase() + value.slice(1);
                if (filterType === 'coverage') {
                    if (value === 'small') displayText = 'Small Space';
                    if (value === 'medium') displayText = 'Medium Space';
                    if (value === 'large') displayText = 'Large Space';
                    if (value === 'huge') displayText = 'Huge Space';
                }
                
                filterTag.innerHTML = `
                    ${displayText}
                    <button data-type="${filterType}" data-value="${value}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                filterTag.querySelector('button').addEventListener('click', (e) => {
                    const type = e.currentTarget.dataset.type;
                    const value = e.currentTarget.dataset.value;
                    const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
                    
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                    
                    this.filters[type] = this.filters[type].filter(v => v !== value);
                    this.updateActiveFilters();
                    this.applyFilters();
                });
                
                activeFiltersContainer.appendChild(filterTag);
            });
        });
        
        activeFiltersContainer.style.display = hasActiveFilters ? 'flex' : 'none';
    }
    
    applyFilters() {
        this.showLoadingState();
        
        setTimeout(() => {
            this.filterProducts();
            this.hideLoadingState();
            this.updateResultsCount();
            this.initPagination();
        }, 500);
    }
    
    clearFilters() {
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
        const minInput = document.querySelector('.input-min');
        const maxInput = document.querySelector('.input-max');
        const minRange = document.querySelector('.min-price');
        const maxRange = document.querySelector('.max-price');
        
        if (minInput && maxInput && minRange && maxRange) {
            minInput.value = 0;
            maxInput.value = 1000;
            minRange.value = 0;
            maxRange.value = 1000;
        }
        
        this.updateActiveFilters();
        this.applyFilters();
    }
    
    filterProducts() {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            if (this.shouldShowProduct(card)) {
                card.closest('.col-md-6').style.display = 'block';
                visibleCount++;
            } else {
                card.closest('.col-md-6').style.display = 'none';
            }
        });
        
        this.totalItems = visibleCount;
        
        if (visibleCount === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
        }
    }
    
    shouldShowProduct(card) {
        // For demo purposes, we'll just use a random filter
        // In a real application, you would check the product attributes against the filters
        if (Object.values(this.filters).some(values => values.length > 0)) {
            return Math.random() > 0.3; // 70% chance of showing each product
        }
        return true;
    }
    
    applySort() {
        const productsContainer = document.querySelector('.products-grid .row');
        const productCards = Array.from(productsContainer.children);
        
        productCards.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'newest':
                    return -1; // Newest first (in a real app, you'd compare dates)
                case 'rating':
                    return this.getRating(b) - this.getRating(a);
                case 'featured':
                default:
                    return 0; // Keep original order
            }
        });
        
        productCards.forEach(card => productsContainer.appendChild(card));
    }
    
    getPrice(productElement) {
        const priceElement = productElement.querySelector('.current-price');
        return priceElement ? parseFloat(priceElement.textContent.replace('£', '')) : 0;
    }
    
    getRating(productElement) {
        const ratingElement = productElement.querySelector('.product-rating span');
        return ratingElement ? parseInt(ratingElement.textContent.replace(/[()]/g, '')) : 0;
    }
    
    showLoadingState() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    }
    
    hideLoadingState() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }
    
    showEmptyState() {
        const productsContainer = document.querySelector('.products-grid .row');
        
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
            productsContainer.appendChild(emptyState);
        }
    }
    
    hideEmptyState() {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
    
    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = this.totalItems;
        }
    }
    
    initPagination() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const prevButton = pagination.querySelector('.prev');
        const nextButton = pagination.querySelector('.next');
        const paginationInfo = document.querySelector('.pagination-info p');
        
        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
            paginationInfo.innerHTML = `Showing <span>${start}-${end}</span> of <span>${this.totalItems}</span> products`;
        }
        
        if (prevButton) {
            prevButton.disabled = this.currentPage === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = this.currentPage === totalPages;
        }
        
        // Add click events to page buttons
        document.querySelectorAll('.page-btn:not(.prev):not(.next)').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.classList.contains('active')) {
                    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentPage = parseInt(btn.textContent);
                    this.applyFilters();
                    document.querySelector('.products-header').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Previous button
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.applyFilters();
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
        
        // Next button
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.applyFilters();
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
        document.querySelectorAll('.quickview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productCard = e.currentTarget.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const currentPrice = productCard.querySelector('.current-price').textContent;
                const originalPrice = productCard.querySelector('.original-price')?.textContent || '';
                const productDescription = productCard.querySelector('.product-description').textContent;
                const productImage = productCard.querySelector('.product-image img').src;
                const productRating = productCard.querySelector('.product-rating').innerHTML;
                
                const modal = document.getElementById('quickview-modal');
                if (modal) {
                    modal.querySelector('.product-title').textContent = productTitle;
                    modal.querySelector('.product-rating').innerHTML = productRating;
                    modal.querySelector('.current-price').textContent = currentPrice;
                    
                    if (originalPrice) {
                        modal.querySelector('.original-price').textContent = originalPrice;
                        modal.querySelector('.original-price').style.display = 'inline';
                        
                        // Calculate discount percentage
                        const currentPriceValue = parseFloat(currentPrice.replace('£', ''));
                        const originalPriceValue = parseFloat(originalPrice.replace('£', ''));
                        const discountPercentage = Math.round(((originalPriceValue - currentPriceValue) / originalPriceValue) * 100);
                        
                        modal.querySelector('.discount-badge').textContent = `-${discountPercentage}%`;
                        modal.querySelector('.discount-badge').style.display = 'inline';
                    } else {
                        if (modal.querySelector('.original-price')) {
                            modal.querySelector('.original-price').style.display = 'none';
                        }
                        if (modal.querySelector('.discount-badge')) {
                            modal.querySelector('.discount-badge').style.display = 'none';
                        }
                    }
                    
                    modal.querySelector('.product-description').textContent = productDescription;
                    modal.querySelector('.quickview-image img').src = productImage;
                    
                    new bootstrap.Modal(modal).show();
                }
            });
        });
    }
    
    setupWishlist() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = e.currentTarget.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#FF4444';
                    this.showNotification('Product added to wishlist', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    this.showNotification('Product removed from wishlist', 'info');
                }
            });
        });
    }
    
    setupCompare() {
        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productTitle = e.currentTarget.closest('.product-card').querySelector('.product-title').textContent;
                this.showNotification(`${productTitle} added to compare list`, 'success');
            });
        });
    }
    
    setupAddToCart() {
        document.querySelectorAll('.btn-cart, .btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productCard = e.currentTarget.closest('.product-card') || e.currentTarget.closest('.modal-content');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent;
                
                // Get quantity if available
                let quantity = 1;
                const quantityInput = productCard.querySelector('.quantity-selector input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value);
                }
                
                this.showNotification(`${quantity} × ${productTitle} added to cart`, 'success');
                
                // Update cart count
                document.querySelectorAll('.cart-count').forEach(count => {
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
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize Archive Manager
const archiveManager = new ArchiveManager();
window.archiveManager = archiveManager;

// Handle quantity controls in quickview modal
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

// Add animation styles
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