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

// Checkout functionality
class CheckoutManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateOrderSummary();
    }
    
    bindEvents() {
        // Same as billing address checkbox
        const sameAsBillingCheckbox = document.getElementById('sameAsbilling');
        if (sameAsBillingCheckbox) {
            sameAsBillingCheckbox.addEventListener('change', (e) => {
                this.toggleShippingAddress(e.target.checked);
            });
        }
        
        // Shipping method changes
        document.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateShippingCost(e.target.value);
            });
        });
        
        // Payment method changes
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentDetails(e.target.value);
            });
        });
        
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }
        
        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                this.formatCardNumber(e);
            });
        }
        
        // Expiry date formatting
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                this.formatExpiryDate(e);
            });
        }
        
        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                this.formatCVV(e);
            });
        }
    }
    
    toggleShippingAddress(sameAsBilling) {
        const shippingAddressSection = document.getElementById('shippingAddress');
        if (shippingAddressSection) {
            if (sameAsBilling) {
                shippingAddressSection.style.display = 'none';
                // Remove required attributes from shipping fields
                shippingAddressSection.querySelectorAll('input, select').forEach(field => {
                    field.removeAttribute('required');
                });
            } else {
                shippingAddressSection.style.display = 'block';
                // Add required attributes to shipping fields
                shippingAddressSection.querySelectorAll('input[id*="shipping"], select[id*="shipping"]').forEach(field => {
                    if (!field.id.includes('Address2')) { // Address line 2 is optional
                        field.setAttribute('required', '');
                    }
                });
            }
        }
    }
    
    updateShippingCost(shippingMethod) {
        const shippingCostElement = document.querySelector('.shipping-cost');
        let shippingCost = 0;
        
        switch (shippingMethod) {
            case 'standard':
                shippingCost = 0;
                shippingCostElement.textContent = 'Free';
                break;
            case 'express':
                shippingCost = 9.99;
                shippingCostElement.textContent = '£9.99';
                break;
            case 'nextday':
                shippingCost = 19.99;
                shippingCostElement.textContent = '£19.99';
                break;
        }
        
        this.updateOrderSummary(shippingCost);
    }
    
    togglePaymentDetails(paymentMethod) {
        const cardDetails = document.getElementById('cardDetails');
        if (cardDetails) {
            if (paymentMethod === 'card') {
                cardDetails.style.display = 'block';
                // Add required attributes to card fields
                cardDetails.querySelectorAll('input').forEach(field => {
                    field.setAttribute('required', '');
                });
            } else {
                cardDetails.style.display = 'none';
                // Remove required attributes from card fields
                cardDetails.querySelectorAll('input').forEach(field => {
                    field.removeAttribute('required');
                });
            }
        }
    }
    
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
        e.target.value = formattedValue;
    }
    
    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }
    
    formatCVV(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.substring(0, 3);
        e.target.value = value;
    }
    
    updateOrderSummary(shippingCost = 0) {
        // Calculate totals (these would normally come from the cart)
        const subtotal = 749.97;
        const discount = 100.00;
        const taxableAmount = subtotal - discount + shippingCost;
        const tax = taxableAmount * 0.2; // 20% VAT
        const total = taxableAmount + tax;
        
        // Update shipping cost display
        if (shippingCost === 0) {
            document.querySelector('.shipping-cost').textContent = 'Free';
        } else {
            document.querySelector('.shipping-cost').textContent = `£${shippingCost.toFixed(2)}`;
        }
        
        // Update tax and total
        document.querySelector('.tax').textContent = `£${tax.toFixed(2)}`;
        document.querySelector('.total').textContent = `£${total.toFixed(2)}`;
        
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
    
    handleFormSubmission(e) {
        e.preventDefault();
        
        if (e.target.checkValidity()) {
            // Show loading state
            const submitBtn = document.querySelector('.place-order-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = `
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                Processing...
            `;
            submitBtn.disabled = true;
            
            // Simulate order processing
            setTimeout(() => {
                this.showSuccessMessage();
                
                // Reset button after success
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        } else {
            // Show validation errors
            e.target.classList.add('was-validated');
            this.scrollToFirstError();
        }
    }
    
    scrollToFirstError() {
        const firstInvalidField = document.querySelector('.form-control:invalid');
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
    }
    
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'notification notification-success';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Order Placed Successfully!</strong>
                    <p>You will receive a confirmation email shortly.</p>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00C73C;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: flex-start;
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
        }, 8000);
    }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .spinner-border-sm {
        width: 1rem;
        height: 1rem;
        border-width: 0.1em;
    }
    
    .spinner-border {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        vertical-align: text-bottom;
        border: 0.25em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border 0.75s linear infinite;
    }
    
    @keyframes spinner-border {
        to { transform: rotate(360deg); }
    }
    
    .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
document.head.appendChild(style);