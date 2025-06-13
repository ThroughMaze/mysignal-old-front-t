import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Order Confirmation functionality
class OrderConfirmation {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateOrderDetails();
        this.animateElements();
    }

    bindEvents() {
        // Add to cart buttons (for recommended products)
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAddToCart(e);
            });
        });

        // Print order button (if exists)
        const printBtn = document.querySelector('.print-order');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }

        // Review button
        const reviewBtn = document.querySelector('.review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showReviewForm();
            });
        }
    }

    updateOrderDetails() {
        // In a real application, this would fetch order details from the server
        // or from localStorage. For this demo, we'll use static data.
        
        // Set current date
        const orderDate = document.querySelector('.order-info-item:nth-child(2) .info-value');
        if (orderDate) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            orderDate.textContent = today.toLocaleDateString('en-US', options);
        }
        
        // Set estimated delivery date
        const deliveryDate = document.querySelector('.delivery-info p:first-child strong');
        if (deliveryDate) {
            const today = new Date();
            const deliveryStart = new Date(today);
            const deliveryEnd = new Date(today);
            
            deliveryStart.setDate(today.getDate() + 5);
            deliveryEnd.setDate(today.getDate() + 7);
            
            const options = { month: 'long', day: 'numeric' };
            const startStr = deliveryStart.toLocaleDateString('en-US', options);
            const endStr = deliveryEnd.toLocaleDateString('en-US', options);
            
            document.querySelector('.delivery-info p:first-child').innerHTML = 
                `<strong>Estimated Delivery:</strong> ${startStr} - ${endStr}, ${deliveryEnd.getFullYear()}`;
        }
    }

    animateElements() {
        // Animate elements as they come into view
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.step-item, .confirmation-item, .support-option');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animate');
                }
            });
        };
        
        // Add animation classes
        const style = document.createElement('style');
        style.textContent = `
            .step-item, .confirmation-item, .support-option {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .step-item.animate, .confirmation-item.animate, .support-option.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .step-item:nth-child(1) { transition-delay: 0.1s; }
            .step-item:nth-child(2) { transition-delay: 0.2s; }
            .step-item:nth-child(3) { transition-delay: 0.3s; }
            .step-item:nth-child(4) { transition-delay: 0.4s; }
            
            .confirmation-item:nth-child(1) { transition-delay: 0.1s; }
            .confirmation-item:nth-child(2) { transition-delay: 0.2s; }
            .confirmation-item:nth-child(3) { transition-delay: 0.3s; }
            
            .support-option:nth-child(1) { transition-delay: 0.1s; }
            .support-option:nth-child(2) { transition-delay: 0.2s; }
            .support-option:nth-child(3) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
        
        // Run on load and scroll
        window.addEventListener('load', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll);
    }

    handleAddToCart(e) {
        const productId = e.target.dataset.productId;
        const productCard = e.target.closest('.related-product-card');
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // Add to cart logic here (in a real app, this would update the cart in localStorage or send to server)
        console.log(`Added to cart: ${productName} (${productPrice})`);
        
        // Visual feedback
        e.target.textContent = 'Added!';
        e.target.style.background = '#00C73C';
        
        setTimeout(() => {
            e.target.textContent = 'Add to Cart';
            e.target.style.background = '';
        }, 2000);
        
        // Show notification
        this.showNotification(`${productName} added to cart`, 'success');
    }

    showReviewForm() {
        // Create modal for review form
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <div class="review-modal-header">
                    <h3>Write a Review</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="review-modal-body">
                    <div class="rating-select">
                        <p>Rate your experience:</p>
                        <div class="stars">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="review-title">Review Title</label>
                        <input type="text" id="review-title" class="form-control" placeholder="Summarize your experience">
                    </div>
                    <div class="form-group">
                        <label for="review-content">Your Review</label>
                        <textarea id="review-content" class="form-control" rows="5" placeholder="Tell us what you liked or didn't like about your purchase"></textarea>
                    </div>
                </div>
                <div class="review-modal-footer">
                    <button class="btn-secondary" id="cancel-review">Cancel</button>
                    <button class="btn-primary" id="submit-review">Submit Review</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .review-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .review-modal-content {
                background: white;
                border-radius: 1rem;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                animation: modalFadeIn 0.3s ease;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .review-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #E7EBFA;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .review-modal-header h3 {
                margin: 0;
                color: var(--color-dark-navy);
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--Blue-Gray-600);
                cursor: pointer;
            }
            
            .review-modal-body {
                padding: 1.5rem;
            }
            
            .rating-select {
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .rating-select p {
                margin-bottom: 0.5rem;
                color: var(--color-dark-navy);
                font-weight: 500;
            }
            
            .stars {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                font-size: 2rem;
                color: var(--primary-hover-color);
            }
            
            .stars i {
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .stars i:hover, .stars i.active {
                transform: scale(1.2);
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--color-dark-navy);
                font-weight: 500;
            }
            
            .review-modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #E7EBFA;
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
            }
            
            .review-modal-footer button {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Add to document
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#cancel-review').addEventListener('click', () => {
            modal.remove();
        });
        
        // Star rating functionality
        const stars = modal.querySelectorAll('.stars i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                
                // Reset all stars
                stars.forEach(s => {
                    s.className = 'far fa-star';
                });
                
                // Set active stars
                for (let i = 0; i < rating; i++) {
                    stars[i].className = 'fas fa-star active';
                }
            });
        });
        
        // Submit review
        modal.querySelector('#submit-review').addEventListener('click', () => {
            const rating = modal.querySelectorAll('.stars i.active').length;
            const title = modal.querySelector('#review-title').value;
            const content = modal.querySelector('#review-content').value;
            
            if (rating === 0) {
                this.showNotification('Please select a rating', 'error');
                return;
            }
            
            if (!title || !content) {
                this.showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // In a real app, this would send the review to the server
            console.log('Review submitted:', { rating, title, content });
            
            // Show success message
            this.showNotification('Thank you for your review!', 'success');
            
            // Close modal
            modal.remove();
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
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
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Initialize order confirmation
document.addEventListener('DOMContentLoaded', () => {
    new OrderConfirmation();
    
    // Form validation for newsletter subscription
    (function () {
        'use strict'
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
});