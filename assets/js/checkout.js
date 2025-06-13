import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Checkout functionality
class CheckoutManager {
    constructor() {
        this.cart = this.loadCart();
        this.shippingCost = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateOrderSummary();
        this.setupFormValidation();
    }

    bindEvents() {
        // Shipping address toggle
        const sameAsBindingCheckbox = document.getElementById('sameAsBinding');
        const shippingAddressSection = document.getElementById('shippingAddress');
        
        if (sameAsBindingCheckbox && shippingAddressSection) {
            sameAsBindingCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    shippingAddressSection.style.display = 'none';
                    this.clearShippingFields();
                } else {
                    shippingAddressSection.style.display = 'block';
                    this.copyBillingToShipping();
                }
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
                this.togglePaymentFields(e.target.value);
            });
        });

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

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                this.formatCVV(e);
            });
        }

        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }
    }

    updateShippingCost(shippingMethod) {
        const shippingCosts = {
            'standard': 0,
            'express': 9.99,
            'nextday': 19.99
        };

        this.shippingCost = shippingCosts[shippingMethod] || 0;
        this.updateOrderSummary();
    }

    togglePaymentFields(paymentMethod) {
        const cardDetails = document.getElementById('cardDetails');
        
        if (cardDetails) {
            if (paymentMethod === 'card') {
                cardDetails.style.display = 'block';
                this.setCardFieldsRequired(true);
            } else {
                cardDetails.style.display = 'none';
                this.setCardFieldsRequired(false);
            }
        }
    }

    setCardFieldsRequired(required) {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        cardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = required;
            }
        });
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        
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
        
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        
        e.target.value = value;
    }

    copyBillingToShipping() {
        const billingFields = {
            'address1': 'shippingAddress1',
            'address2': 'shippingAddress2',
            'city': 'shippingCity',
            'postcode': 'shippingPostcode',
            'country': 'shippingCountry'
        };

        Object.entries(billingFields).forEach(([billing, shipping]) => {
            const billingField = document.getElementById(billing);
            const shippingField = document.getElementById(shipping);
            
            if (billingField && shippingField) {
                shippingField.value = billingField.value;
            }
        });
    }

    clearShippingFields() {
        const shippingFields = ['shippingAddress1', 'shippingAddress2', 'shippingCity', 'shippingPostcode', 'shippingCountry'];
        
        shippingFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
    }

    updateOrderSummary() {
        let subtotal = 0;
        this.cart.forEach(item => {
            const price = parseFloat(item.price.replace('£', ''));
            subtotal += price * item.quantity;
        });

        const discount = 100; // Example discount
        const tax = (subtotal - discount + this.shippingCost) * 0.2; // 20% VAT
        const total = subtotal + tax - discount + this.shippingCost;

        // Update shipping cost display
        const shippingElements = document.querySelectorAll('.shipping-cost');
        shippingElements.forEach(el => {
            el.textContent = this.shippingCost === 0 ? 'Free' : `£${this.shippingCost.toFixed(2)}`;
        });

        // Update totals
        document.querySelectorAll('.subtotal').forEach(el => {
            el.textContent = `£${subtotal.toFixed(2)}`;
        });

        document.querySelectorAll('.tax').forEach(el => {
            el.textContent = `£${tax.toFixed(2)}`;
        });

        document.querySelectorAll('.total').forEach(el => {
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

    setupFormValidation() {
        // Custom validation for card number
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('blur', (e) => {
                const cardNumber = e.target.value.replace(/\s/g, '');
                if (cardNumber.length < 13 || cardNumber.length > 19) {
                    e.target.setCustomValidity('Please enter a valid card number');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }

        // Custom validation for expiry date
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('blur', (e) => {
                const expiry = e.target.value;
                const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                
                if (!regex.test(expiry)) {
                    e.target.setCustomValidity('Please enter a valid expiry date (MM/YY)');
                } else {
                    const [month, year] = expiry.split('/');
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear() % 100;
                    const currentMonth = currentDate.getMonth() + 1;
                    
                    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                        e.target.setCustomValidity('Card has expired');
                    } else {
                        e.target.setCustomValidity('');
                    }
                }
            });
        }

        // Custom validation for CVV
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('blur', (e) => {
                const cvv = e.target.value;
                if (cvv.length < 3 || cvv.length > 4) {
                    e.target.setCustomValidity('Please enter a valid CVV');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        
        if (form.checkValidity()) {
            // Show loading state
            const submitBtn = form.querySelector('.place-order-btn');
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
                this.processOrder(form);
            }, 2000);
        } else {
            // Show validation errors
            form.classList.add('was-validated');
            
            // Scroll to first error
            const firstError = form.querySelector('.form-control:invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    }

    processOrder(form) {
        // Collect form data
        const formData = new FormData(form);
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            billing: {
                address1: formData.get('address1'),
                address2: formData.get('address2'),
                city: formData.get('city'),
                postcode: formData.get('postcode'),
                country: formData.get('country')
            },
            shipping: formData.get('sameAsBinding') ? null : {
                address1: formData.get('shippingAddress1'),
                address2: formData.get('shippingAddress2'),
                city: formData.get('shippingCity'),
                postcode: formData.get('shippingPostcode'),
                country: formData.get('shippingCountry')
            },
            shippingMethod: formData.get('shipping'),
            paymentMethod: formData.get('payment'),
            orderNotes: formData.get('orderNotes'),
            cart: this.cart,
            total: this.calculateTotal()
        };

        // In a real application, you would send this to your server
        console.log('Order data:', orderData);
        
        // Clear cart
        localStorage.removeItem('mobileBoosterCart');
        
        // Redirect to success page or show success message
        this.showSuccessMessage();
    }

    calculateTotal() {
        let subtotal = 0;
        this.cart.forEach(item => {
            const price = parseFloat(item.price.replace('£', ''));
            subtotal += price * item.quantity;
        });

        const discount = 100;
        const tax = (subtotal - discount + this.shippingCost) * 0.2;
        return subtotal + tax - discount + this.shippingCost;
    }

    showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const successCard = document.createElement('div');
        successCard.style.cssText = `
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 500px;
            margin: 2rem;
        `;

        successCard.innerHTML = `
            <div style="color: #00C73C; font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <h2 style="color: var(--color-dark-navy); margin-bottom: 1rem;">Order Placed Successfully!</h2>
            <p style="color: var(--Blue-Gray-600); margin-bottom: 2rem;">
                Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <button onclick="window.location.href='/'" style="
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
            ">Continue Shopping</button>
        `;

        overlay.appendChild(successCard);
        document.body.appendChild(overlay);
    }

    loadCart() {
        const savedCart = localStorage.getItem('mobileBoosterCart');
        return savedCart ? JSON.parse(savedCart) : [
            { id: '1', name: 'Professional Signal Booster Pro', price: '£299.99', quantity: 1 },
            { id: '2', name: 'Home Signal Booster Essential', price: '£199.99', quantity: 2 },
            { id: '3', name: 'Signal Booster Accessories Kit', price: '£49.99', quantity: 1 }
        ];
    }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

// Form validation
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
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (e.currentTarget.checkValidity()) {
            e.currentTarget.classList.add('subscribed');
        }
    })
}