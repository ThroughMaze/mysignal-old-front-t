import "bootstrap/dist/js/bootstrap.min.js";

// Form validation
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

    if (menuToggle && fullscreenNav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            fullscreenNav.classList.toggle("active");
        });
    }
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

// Cart functionality
class CartManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCartTotals();
    }
    
    bindEvents() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuantityChange(e);
            });
        });
        
        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleQuantityInputChange(e);
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRemoveItem(e);
            });
        });
        
        // Promo code application
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                this.handlePromoCode();
            });
        }
        
        // Add to cart buttons for related products
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAddToCart(e);
            });
        });
    }
    
    handleQuantityChange(e) {
        const action = e.currentTarget.dataset.action;
        const cartItem = e.currentTarget.closest('.cart-item');
        const quantityInput = cartItem.querySelector('.quantity-input');
        let currentQuantity = parseInt(quantityInput.value);
        
        if (action === 'increase' && currentQuantity < 10) {
            quantityInput.value = currentQuantity + 1;
        } else if (action === 'decrease' && currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
        }
        
        this.updateCartTotals();
        this.updateCartCount();
    }
    
    handleQuantityInputChange(e) {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        e.target.value = value;
        
        this.updateCartTotals();
        this.updateCartCount();
    }
    
    handleRemoveItem(e) {
        const cartItem = e.currentTarget.closest('.cart-item');
        const productTitle = cartItem.querySelector('.cart-item-title').textContent;
        
        // Add fade out animation
        cartItem.style.opacity = '0.5';
        cartItem.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            cartItem.remove();
            this.updateCartTotals();
            this.updateCartCount();
            this.showNotification(`${productTitle} removed from cart`, 'info');
        }, 300);
    }
    
    handlePromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        // Simple promo code validation (in real app, this would be server-side)
        const validCodes = {
            'SAVE10': 10,
            'WELCOME20': 20,
            'STUDENT15': 15
        };
        
        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            promoMessage.innerHTML = `<span style="color: #00F04C;">Promo code applied! ${discount}% discount</span>`;
            promoInput.disabled = true;
            document.getElementById('applyPromo').disabled = true;
            this.applyDiscount(discount);
        } else if (promoCode) {
            promoMessage.innerHTML = `<span style="color: #F33;">Invalid promo code</span>`;
        }
        
        setTimeout(() => {
            promoMessage.innerHTML = '';
        }, 5000);
    }
    
    handleAddToCart(e) {
        const productCard = e.currentTarget.closest('.related-product-card');
        const productTitle = productCard.querySelector('h4').textContent;
        
        this.showNotification(`${productTitle} added to cart`, 'success');
        this.updateCartCount(1);
    }
    
    applyDiscount(percentage) {
        // Update discount display
        const discountElement = document.querySelector('.discount');
        if (discountElement) {
            const subtotal = this.calculateSubtotal();
            const discountAmount = (subtotal * percentage) / 100;
            discountElement.textContent = `-£${discountAmount.toFixed(2)}`;
        }
        this.updateCartTotals();
    }
    
    calculateSubtotal() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.current-price').textContent.replace('£', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });
        return subtotal;
    }
    
    updateCartTotals() {
        const subtotal = this.calculateSubtotal();
        const discountElement = document.querySelector('.discount');
        const discount = discountElement ? parseFloat(discountElement.textContent.replace('-£', '')) : 0;
        const tax = (subtotal - discount) * 0.2; // 20% VAT
        const total = subtotal - discount + tax;
        
        // Update display
        document.querySelector('.subtotal').textContent = `£${subtotal.toFixed(2)}`;
        document.querySelector('.tax').textContent = `£${tax.toFixed(2)}`;
        document.querySelector('.total').textContent = `£${total.toFixed(2)}`;
        
        // Update item count
        const itemCount = Array.from(document.querySelectorAll('.cart-item')).reduce((count, item) => {
            return count + parseInt(item.querySelector('.quantity-input').value);
        }, 0);
        
        const subtotalElements = document.querySelectorAll('.summary-row:first-child span:first-child');
        subtotalElements.forEach(el => {
            if (el.textContent.includes('Subtotal')) {
                el.textContent = `Subtotal (${itemCount} items)`;
            }
        });
    }
    
    updateCartCount(increment = 0) {
        document.querySelectorAll('.cart-count').forEach(count => {
            if (increment) {
                const currentCount = parseInt(count.textContent);
                count.textContent = currentCount + increment;
            } else {
                // Recalculate from cart items
                const totalItems = Array.from(document.querySelectorAll('.cart-item')).reduce((total, item) => {
                    return total + parseInt(item.querySelector('.quantity-input').value);
                }, 0);
                count.textContent = totalItems;
            }
            
            count.classList.add('pulse');
            setTimeout(() => {
                count.classList.remove('pulse');
            }, 500);
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

// Initialize cart manager
const cartManager = new CartManager();

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
    
    .cart-item {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);