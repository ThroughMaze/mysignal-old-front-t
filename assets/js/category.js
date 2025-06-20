// Category page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Simple add to cart functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            alert(`${productTitle} added to cart!`);
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.background = '#00C73C';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '#1434CB';
            }, 2000);
        });
    });
});