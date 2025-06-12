import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Cart functionality
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartDisplay();
        this.updateCartCount();
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
                this.handleQuantityInput(e);
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRemoveItem(e);
            });
        });

        // Add to cart buttons (for related products)
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAddToCart(e);
            });
        });

        // Promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                this.handlePromoCode();
            });
        }

        // Enter key for promo code
        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePromoCode();
                }
            });
        }
    }

    handleQuantityChange(e) {
        const action = e.target.dataset.action;
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        const quantityInput = cartItem.querySelector('.quantity-input');
        let currentQuantity = parseInt(quantityInput.value);

        if (action === 'increase') {
            currentQuantity = Math.min(currentQuantity + 1, 10);
        } else if (action === 'decrease') {
            currentQuantity = Math.max(currentQuantity - 1, 1);
        }

        quantityInput.value = currentQuantity;
        this.updateCartItem(productId, currentQuantity);
    }

    handleQuantityInput(e) {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        let quantity = parseInt(e.target.value);

        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > 10) {
            quantity = 10;
        }

        e.target.value = quantity;
        this.updateCartItem(productId, quantity);
    }

    handleRemoveItem(e) {
        const productId = e.target.dataset.productId;
        const cartItem = e.target.closest('.cart-item');
        
        // Add animation
        cartItem.style.opacity = '0.5';
        cartItem.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            this.removeFromCart(productId);
            cartItem.remove();
            this.updateCartDisplay();
            this.updateCartCount();
            this.showNotification('Item removed from cart', 'success');
        }, 300);
    }

    handleAddToCart(e) {
        const productId = e.target.dataset.productId;
        const productCard = e.target.closest('.related-product-card');
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // Add to cart logic here
        this.addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
        
        // Visual feedback
        e.target.textContent = 'Added!';
        e.target.style.background = '#00C73C';
        
        setTimeout(() => {
            e.target.textContent = 'Add to Cart';
            e.target.style.background = '';
        }, 2000);
        
        this.updateCartCount();
        this.showNotification(`${productName} added to cart`, 'success');
    }

    handlePromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        // Simulate promo code validation
        const validCodes = {
            'SAVE10': { discount: 10, type: 'percentage' },
            'WELCOME20': { discount: 20, type: 'percentage' },
            'FREESHIP': { discount: 0, type: 'shipping' }
        };
        
        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            promoMessage.textContent = `Promo code applied! You saved ${discount.discount}${discount.type === 'percentage' ? '%' : ''}`;
            promoMessage.className = 'promo-message success';
            this.applyDiscount(discount);
        } else {
            promoMessage.textContent = 'Invalid promo code. Please try again.';
            promoMessage.className = 'promo-message error';
        }
        
        setTimeout(() => {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }, 5000);
    }

    updateCartItem(productId, quantity) {
        // Update cart data
        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartCount();
        }
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.cart.push(product);
        }
        
        this.saveCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateCartDisplay() {
        // Update subtotal, tax, total, etc.
        const subtotalElements = document.querySelectorAll('.subtotal');
        const totalElements = document.querySelectorAll('.total');
        
        let subtotal = 0;
        this.cart.forEach(item => {
            const price = parseFloat(item.price.replace('£', ''));
            subtotal += price * item.quantity;
        });
        
        const tax = subtotal * 0.2; // 20% VAT
        const discount = 100; // Example discount
        const total = subtotal + tax - discount;
        
        subtotalElements.forEach(el => {
            el.textContent = `£${subtotal.toFixed(2)}`;
        });
        
        document.querySelectorAll('.tax').forEach(el => {
            el.textContent = `£${tax.toFixed(2)}`;
        });
        
        totalElements.forEach(el => {
            el.textContent = `£${total.toFixed(2)}`;
        });
        
        // Update place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 2L3 7V12C3 16.55 6.84 20.74 9.91 21.74C11.39 22.24 12.61 22.24 14.09 21.74C17.16 20.74 21 16.55 21 12V7L12 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Place Order - £${total.toFixed(2)}
            `;
        }
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 300);
        });
    }

    applyDiscount(discount) {
        // Apply discount logic
        this.updateCartDisplay();
    }

    loadCart() {
        const savedCart = localStorage.getItem('mobileBoosterCart');
        return savedCart ? JSON.parse(savedCart) : [
            { id: '1', name: 'Professional Signal Booster Pro', price: '£299.99', quantity: 1 },
            { id: '2', name: 'Home Signal Booster Essential', price: '£199.99', quantity: 2 },
            { id: '3', name: 'Signal Booster Accessories Kit', price: '£49.99', quantity: 1 }
        ];
    }

    saveCart() {
        localStorage.setItem('mobileBoosterCart', JSON.stringify(this.cart));
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
            this.closeNotification(notification);
        });
        
        // Auto close
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

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