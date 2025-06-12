import"./bootstrap.js";import"./bootstrap.min.js";/* empty css     */import"./_commonjsHelpers.js";class d{constructor(){this.init()}init(){this.bindEvents(),this.updateOrderDetails(),this.animateElements()}bindEvents(){document.querySelectorAll(".add-to-cart-btn").forEach(t=>{t.addEventListener("click",r=>{this.handleAddToCart(r)})});const e=document.querySelector(".print-order");e&&e.addEventListener("click",()=>{window.print()});const o=document.querySelector(".review-btn");o&&o.addEventListener("click",t=>{t.preventDefault(),this.showReviewForm()})}updateOrderDetails(){const e=document.querySelector(".order-info-item:nth-child(2) .info-value");if(e){const t=new Date,r={year:"numeric",month:"long",day:"numeric"};e.textContent=t.toLocaleDateString("en-US",r)}if(document.querySelector(".delivery-info p:first-child strong")){const t=new Date,r=new Date(t),n=new Date(t);r.setDate(t.getDate()+5),n.setDate(t.getDate()+7);const i={month:"long",day:"numeric"},s=r.toLocaleDateString("en-US",i),c=n.toLocaleDateString("en-US",i);document.querySelector(".delivery-info p:first-child").innerHTML=`<strong>Estimated Delivery:</strong> ${s} - ${c}, ${n.getFullYear()}`}}animateElements(){const e=()=>{document.querySelectorAll(".step-item, .confirmation-item, .support-option").forEach(r=>{r.getBoundingClientRect().top<window.innerHeight-150&&r.classList.add("animate")})},o=document.createElement("style");o.textContent=`
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
        `,document.head.appendChild(o),window.addEventListener("load",e),window.addEventListener("scroll",e)}handleAddToCart(e){e.target.dataset.productId;const o=e.target.closest(".related-product-card"),t=o.querySelector("h4").textContent,r=o.querySelector(".current-price").textContent;console.log(`Added to cart: ${t} (${r})`),e.target.textContent="Added!",e.target.style.background="#00C73C",setTimeout(()=>{e.target.textContent="Add to Cart",e.target.style.background=""},2e3),this.showNotification(`${t} added to cart`,"success")}showReviewForm(){const e=document.createElement("div");e.className="review-modal",e.innerHTML=`
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
        `;const o=document.createElement("style");o.textContent=`
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
        `,document.head.appendChild(o),document.body.appendChild(e),e.querySelector(".close-modal").addEventListener("click",()=>{e.remove()}),e.querySelector("#cancel-review").addEventListener("click",()=>{e.remove()});const t=e.querySelectorAll(".stars i");t.forEach(r=>{r.addEventListener("click",()=>{const n=parseInt(r.dataset.rating);t.forEach(i=>{i.className="far fa-star"});for(let i=0;i<n;i++)t[i].className="fas fa-star active"})}),e.querySelector("#submit-review").addEventListener("click",()=>{const r=e.querySelectorAll(".stars i.active").length,n=e.querySelector("#review-title").value,i=e.querySelector("#review-content").value;if(r===0){this.showNotification("Please select a rating","error");return}if(!n||!i){this.showNotification("Please fill in all fields","error");return}console.log("Review submitted:",{rating:r,title:n,content:i}),this.showNotification("Thank you for your review!","success"),e.remove()})}showNotification(e,o="info"){const t=document.createElement("div");t.className=`notification notification-${o}`,t.innerHTML=`
            <div class="notification-content">
                <span>${e}</span>
                <button class="notification-close">&times;</button>
            </div>
        `,t.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${o==="success"?"#00C73C":o==="error"?"#FF4444":"#1434CB"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `,document.body.appendChild(t),setTimeout(()=>{t.style.transform="translateX(0)"},100),t.querySelector(".notification-close").addEventListener("click",()=>{t.style.transform="translateX(100%)",setTimeout(()=>{t.remove()},300)}),setTimeout(()=>{document.body.contains(t)&&(t.style.transform="translateX(100%)",setTimeout(()=>{t.remove()},300))},5e3)}}document.addEventListener("DOMContentLoaded",()=>{new d,function(){var a=document.querySelectorAll(".needs-validation");Array.prototype.slice.call(a).forEach(function(e){e.addEventListener("submit",function(o){e.checkValidity()||(o.preventDefault(),o.stopPropagation()),e.classList.add("was-validated")},!1)})}(),document.querySelector(".subscribe-form").addEventListener("submit",a=>{a.preventDefault(),a.currentTarget.checkValidity()&&a.currentTarget.classList.add("subscribed")})});
