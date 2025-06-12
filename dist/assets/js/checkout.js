import"./bootstrap.js";import"./bootstrap.min.js";/* empty css     */import"./_commonjsHelpers.js";class g{constructor(){this.cart=this.loadCart(),this.shippingCost=0,this.init()}init(){this.bindEvents(),this.updateOrderSummary(),this.setupFormValidation()}bindEvents(){const t=document.getElementById("sameAsBinding"),e=document.getElementById("shippingAddress");t&&e&&t.addEventListener("change",r=>{r.target.checked?(e.style.display="none",this.clearShippingFields()):(e.style.display="block",this.copyBillingToShipping())}),document.querySelectorAll('input[name="shipping"]').forEach(r=>{r.addEventListener("change",o=>{this.updateShippingCost(o.target.value)})}),document.querySelectorAll('input[name="payment"]').forEach(r=>{r.addEventListener("change",o=>{this.togglePaymentFields(o.target.value)})});const i=document.getElementById("cardNumber");i&&i.addEventListener("input",r=>{this.formatCardNumber(r)});const s=document.getElementById("expiryDate");s&&s.addEventListener("input",r=>{this.formatExpiryDate(r)});const n=document.getElementById("cvv");n&&n.addEventListener("input",r=>{this.formatCVV(r)});const d=document.getElementById("checkoutForm");d&&d.addEventListener("submit",r=>{this.handleFormSubmission(r)})}updateShippingCost(t){const e={standard:0,express:9.99,nextday:19.99};this.shippingCost=e[t]||0,this.updateOrderSummary()}togglePaymentFields(t){const e=document.getElementById("cardDetails");e&&(t==="card"?(e.style.display="block",this.setCardFieldsRequired(!0)):(e.style.display="none",this.setCardFieldsRequired(!1)))}setCardFieldsRequired(t){["cardNumber","expiryDate","cvv","cardName"].forEach(i=>{const s=document.getElementById(i);s&&(s.required=t)})}formatCardNumber(t){var s;let e=t.target.value.replace(/\s/g,"").replace(/[^0-9]/gi,""),i=((s=e.match(/.{1,4}/g))==null?void 0:s.join(" "))||e;i.length>19&&(i=i.substring(0,19)),t.target.value=i}formatExpiryDate(t){let e=t.target.value.replace(/\D/g,"");e.length>=2&&(e=e.substring(0,2)+"/"+e.substring(2,4)),t.target.value=e}formatCVV(t){let e=t.target.value.replace(/\D/g,"");e.length>4&&(e=e.substring(0,4)),t.target.value=e}copyBillingToShipping(){Object.entries({address1:"shippingAddress1",address2:"shippingAddress2",city:"shippingCity",postcode:"shippingPostcode",country:"shippingCountry"}).forEach(([e,i])=>{const s=document.getElementById(e),n=document.getElementById(i);s&&n&&(n.value=s.value)})}clearShippingFields(){["shippingAddress1","shippingAddress2","shippingCity","shippingPostcode","shippingCountry"].forEach(e=>{const i=document.getElementById(e);i&&(i.value="")})}updateOrderSummary(){let t=0;this.cart.forEach(r=>{const o=parseFloat(r.price.replace("£",""));t+=o*r.quantity});const e=100,i=(t-e+this.shippingCost)*.2,s=t+i-e+this.shippingCost;document.querySelectorAll(".shipping-cost").forEach(r=>{r.textContent=this.shippingCost===0?"Free":`£${this.shippingCost.toFixed(2)}`}),document.querySelectorAll(".subtotal").forEach(r=>{r.textContent=`£${t.toFixed(2)}`}),document.querySelectorAll(".tax").forEach(r=>{r.textContent=`£${i.toFixed(2)}`}),document.querySelectorAll(".total").forEach(r=>{r.textContent=`£${s.toFixed(2)}`});const d=document.querySelector(".place-order-btn");d&&(d.innerHTML=`
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 2L3 7V12C3 16.55 6.84 20.74 9.91 21.74C11.39 22.24 12.61 22.24 14.09 21.74C17.16 20.74 21 16.55 21 12V7L12 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Place Order - £${s.toFixed(2)}
            `)}setupFormValidation(){const t=document.getElementById("cardNumber");t&&t.addEventListener("blur",s=>{const n=s.target.value.replace(/\s/g,"");n.length<13||n.length>19?s.target.setCustomValidity("Please enter a valid card number"):s.target.setCustomValidity("")});const e=document.getElementById("expiryDate");e&&e.addEventListener("blur",s=>{const n=s.target.value;if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(n))s.target.setCustomValidity("Please enter a valid expiry date (MM/YY)");else{const[r,o]=n.split("/"),l=new Date,c=l.getFullYear()%100,u=l.getMonth()+1;parseInt(o)<c||parseInt(o)===c&&parseInt(r)<u?s.target.setCustomValidity("Card has expired"):s.target.setCustomValidity("")}});const i=document.getElementById("cvv");i&&i.addEventListener("blur",s=>{const n=s.target.value;n.length<3||n.length>4?s.target.setCustomValidity("Please enter a valid CVV"):s.target.setCustomValidity("")})}handleFormSubmission(t){t.preventDefault();const e=t.target;if(e.checkValidity()){const i=e.querySelector(".place-order-btn");i.innerHTML,i.innerHTML=`
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                Processing...
            `,i.disabled=!0,setTimeout(()=>{this.processOrder(e)},2e3)}else{e.classList.add("was-validated");const i=e.querySelector(".form-control:invalid");i&&(i.scrollIntoView({behavior:"smooth",block:"center"}),i.focus())}}processOrder(t){const e=new FormData(t),i={customer:{firstName:e.get("firstName"),lastName:e.get("lastName"),email:e.get("email"),phone:e.get("phone")},billing:{address1:e.get("address1"),address2:e.get("address2"),city:e.get("city"),postcode:e.get("postcode"),country:e.get("country")},shipping:e.get("sameAsBinding")?null:{address1:e.get("shippingAddress1"),address2:e.get("shippingAddress2"),city:e.get("shippingCity"),postcode:e.get("shippingPostcode"),country:e.get("shippingCountry")},shippingMethod:e.get("shipping"),paymentMethod:e.get("payment"),orderNotes:e.get("orderNotes"),cart:this.cart,total:this.calculateTotal()};console.log("Order data:",i),localStorage.removeItem("mobileBoosterCart"),this.showSuccessMessage()}calculateTotal(){let t=0;this.cart.forEach(s=>{const n=parseFloat(s.price.replace("£",""));t+=n*s.quantity});const e=100,i=(t-e+this.shippingCost)*.2;return t+i-e+this.shippingCost}showSuccessMessage(){const t=document.createElement("div");t.style.cssText=`
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
        `;const e=document.createElement("div");e.style.cssText=`
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 500px;
            margin: 2rem;
        `,e.innerHTML=`
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
        `,t.appendChild(e),document.body.appendChild(t)}loadCart(){const t=localStorage.getItem("mobileBoosterCart");return t?JSON.parse(t):[{id:"1",name:"Professional Signal Booster Pro",price:"£299.99",quantity:1},{id:"2",name:"Home Signal Booster Essential",price:"£199.99",quantity:2},{id:"3",name:"Signal Booster Accessories Kit",price:"£49.99",quantity:1}]}}new g;(function(){var a=document.querySelectorAll(".needs-validation");Array.prototype.slice.call(a).forEach(function(t){t.addEventListener("submit",function(e){t.checkValidity()||(e.preventDefault(),e.stopPropagation()),t.classList.add("was-validated")},!1)})})();const p=document.querySelector(".subscribe-form");p&&p.addEventListener("submit",a=>{a.preventDefault(),a.currentTarget.checkValidity()&&a.currentTarget.classList.add("subscribed")});
