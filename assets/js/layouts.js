// Layouts Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Filter Section Toggle
    const filterHeaders = document.querySelectorAll('.filter-header');
    
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const arrow = this.querySelector('.filter-arrow');
            const content = this.nextElementSibling;
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                arrow.classList.remove('rotated');
            } else {
                content.classList.add('expanded');
                arrow.classList.add('rotated');
            }
        });
    });
    
    // Price Range Slider
    const priceSlider = document.getElementById('price-range');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            minPriceInput.value = '$' + this.value + '.00';
        });
    }
    
    // Checkbox functionality
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // You can add filtering logic here
            console.log('Filter changed:', this.name, this.checked);
        });
    });
    
    // Network option selection in quiz
    const networkOptions = document.querySelectorAll('.network-option');
    
    networkOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Toggle selection
            this.classList.toggle('selected');
            
            // Update styling for selected state
            if (this.classList.contains('selected')) {
                this.style.borderColor = '#1434CB';
                this.style.backgroundColor = 'rgba(1, 59, 148, 0.10)';
            } else {
                this.style.borderColor = '#CCE6FF';
                this.style.backgroundColor = 'transparent';
            }
        });
    });
    
    // Pagination buttons
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.pagination-next)');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Product card hover effects are handled by CSS
    
    // Apply filter button
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Apply filters logic here
            console.log('Applying filters...');
            
            // Show a brief feedback
            const originalText = this.textContent;
            this.textContent = 'Applied!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'var(--primary-color)';
            }, 1500);
        });
    }
    
    // View all links functionality
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the parent filter section
            const filterSection = this.closest('.filter-section');
            const list = filterSection.querySelector('.provider-list, .frequency-list');
            
            // Toggle showing more items (placeholder functionality)
            if (list.style.maxHeight && list.style.maxHeight !== 'none') {
                list.style.maxHeight = 'none';
                this.querySelector('span').textContent = 'View Less';
            } else {
                list.style.maxHeight = '300px';
                this.querySelector('span').textContent = 'View All';
            }
        });
    });
    
    // Quiz next button
    const nextBtn = document.querySelector('.quiz-navigation .btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Check if any network is selected
            const selectedNetworks = document.querySelectorAll('.network-option.selected');
            
            if (selectedNetworks.length === 0) {
                alert('Please select at least one network to continue.');
                return;
            }
            
            // Proceed to next step of quiz (placeholder)
            console.log('Proceeding to next quiz step...');
            
            // You would implement actual quiz navigation here
            alert('Quiz functionality would continue to the next step here.');
        });
    }
    
    // Product card interactions
    const productBtns = document.querySelectorAll('.product-btn');
    
    productBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get product title
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            
            // Navigate to product page (placeholder)
            console.log('Viewing details for:', productTitle);
            
            // In a real implementation, you would navigate to the product page
            // window.location.href = '/product/' + productSlug;
        });
    });
    
    // Smooth scrolling for any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
});

// Helper function to format currency
function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
}

// Helper function to update URL parameters for filtering
function updateUrlParams(params) {
    const url = new URL(window.location);
    
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    
    window.history.pushState({}, '', url);
}

// Export functions for potential use in other scripts
window.LayoutsPage = {
    formatCurrency,
    updateUrlParams
}; 