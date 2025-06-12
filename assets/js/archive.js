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

// Archive-specific functionality
class ArchiveManager {
    constructor() {
        this.filters = {
            coverage: [],
            signal: [],
            carrier: []
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
            carrier: []
        };
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset sort
        document.getElementById('sort-select').value = 'newest';
        this.sortBy = 'newest';
        
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

        this.renderPagination();
    }

    renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn prev ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="archiveManager.goToPage(${this.currentPage - 1})"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="page-btn active">${i}</button>`;
            } else {
                paginationHTML += `<button class="page-btn" onclick="archiveManager.goToPage(${i})">${i}</button>`;
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="page-btn next ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="archiveManager.goToPage(${this.currentPage + 1})"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                >
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderPagination();
        
        // Scroll to top of results
        document.querySelector('.archive-results-header').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Initialize archive manager
const archiveManager = new ArchiveManager();

// Make it globally available for pagination buttons
window.archiveManager = archiveManager;