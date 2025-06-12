import"./bootstrap.js";import"./bootstrap.min.js";import"./_commonjsHelpers.js";(function(){var s=document.querySelectorAll(".needs-validation");Array.prototype.slice.call(s).forEach(function(e){e.addEventListener("submit",function(t){e.checkValidity()||(t.preventDefault(),t.stopPropagation()),e.classList.add("was-validated")},!1)})})();document.querySelector(".subscribe-form").addEventListener("submit",s=>{s.preventDefault(),s.currentTarget.checkValidity()&&s.currentTarget.classList.add("subscribed")});const d=document.querySelector(".newsletter-form");d&&d.addEventListener("submit",s=>{if(s.preventDefault(),s.currentTarget.checkValidity()){const e=s.currentTarget.closest(".card-body");e.innerHTML=`
                <div class="text-center py-4">
                    <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                    <h4 class="mt-3" style="color: var(--primary-color);">Thank You!</h4>
                    <p class="mb-0">You've been successfully subscribed to our newsletter.</p>
                </div>
            `}else s.currentTarget.classList.add("was-validated")});document.addEventListener("DOMContentLoaded",()=>{const s=document.querySelector('[data-bs-toggle="collapse"]'),e=document.querySelector(".fullscreen-nav");s.addEventListener("click",()=>{s.classList.toggle("active"),e.classList.toggle("active")})});function p(s){s.currentTarget.classList.toggle("active")}document.querySelectorAll(".navbar-list > li").forEach(s=>{s.addEventListener("click",p)});document.querySelectorAll(".country-item").forEach(s=>{s.addEventListener("click",e=>{e.currentTarget.querySelector("input[type=radio]").checked?document.querySelector("#openPopup img").src=e.currentTarget.querySelector("img").src:document.querySelector("#openPopup img").src="https://flagcdn.com/gb.svg"})});const a=document.getElementById("back-to-top");a&&(window.addEventListener("scroll",()=>{window.pageYOffset>300?a.classList.add("show"):a.classList.remove("show")}),a.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}));const u=document.getElementById("productSearch");u&&u.addEventListener("input",s=>{const e=s.target.value.toLowerCase();document.querySelectorAll(".archive-product-card").forEach(r=>{const o=r.querySelector("h4").textContent.toLowerCase(),c=r.querySelector(".product-description").textContent.toLowerCase(),n=Array.from(r.querySelectorAll(".feature-tag")).map(l=>l.textContent.toLowerCase()),i=o.includes(e)||c.includes(e)||n.some(l=>l.includes(e));r.closest(".col-12").style.display=i?"block":"none"}),updateResultsCount()});class m{constructor(){this.filters={coverage:[],signal:[],carrier:[],price:[]},this.sortBy="newest",this.currentPage=1,this.itemsPerPage=6,this.totalItems=24,this.init()}init(){this.bindEvents(),this.initPagination(),this.updateResultsCount(),this.setupLoadMore()}bindEvents(){var e,t,r;document.querySelectorAll('input[type="checkbox"]').forEach(o=>{o.addEventListener("change",c=>{this.handleFilterChange(c)})}),(e=document.getElementById("apply-filters"))==null||e.addEventListener("click",()=>{this.applyFilters()}),(t=document.getElementById("clear-filters"))==null||t.addEventListener("click",()=>{this.clearFilters()}),(r=document.getElementById("sort-select"))==null||r.addEventListener("change",o=>{this.sortBy=o.target.value,this.applySort()})}handleFilterChange(e){const t=e.target.name,r=e.target.value;e.target.checked?this.filters[t].includes(r)||this.filters[t].push(r):this.filters[t]=this.filters[t].filter(o=>o!==r)}applyFilters(){this.showLoadingState(),setTimeout(()=>{this.filterProducts(),this.hideLoadingState(),this.updateResultsCount()},500)}clearFilters(){this.filters={coverage:[],signal:[],carrier:[],price:[]},document.querySelectorAll('input[type="checkbox"]').forEach(t=>{t.checked=!1}),document.getElementById("sort-select").value="newest",this.sortBy="newest";const e=document.getElementById("productSearch");e&&(e.value=""),this.applyFilters()}filterProducts(){const e=document.querySelectorAll(".archive-product-card");let t=0;e.forEach(r=>{this.shouldShowProduct(r)?(r.parentElement.style.display="block",t++):r.parentElement.style.display="none"}),this.totalItems=t,t===0?this.showEmptyState():this.hideEmptyState()}shouldShowProduct(e){return Object.values(this.filters).some(r=>r.length>0)?Math.random()>.3:!0}applySort(){const e=document.querySelector(".archive-products-grid .row"),t=Array.from(e.children);t.sort((r,o)=>{switch(this.sortBy){case"price-low":return this.getPrice(r)-this.getPrice(o);case"price-high":return this.getPrice(o)-this.getPrice(r);case"newest":return 1;case"oldest":return-1;case"popular":return Math.random()-.5;default:return 0}}),t.forEach(r=>e.appendChild(r))}getPrice(e){const t=e.querySelector(".current-price");return t?parseFloat(t.textContent.replace("£","")):0}showLoadingState(){document.querySelectorAll(".archive-product-card").forEach(t=>{t.style.opacity="0.5",t.style.pointerEvents="none"})}hideLoadingState(){document.querySelectorAll(".archive-product-card").forEach(t=>{t.style.opacity="1",t.style.pointerEvents="auto"})}showEmptyState(){const e=document.querySelector(".archive-products-grid");if(!document.querySelector(".empty-state")){const t=document.createElement("div");t.className="empty-state",t.innerHTML=`
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria to find what you're looking for.</p>
                <button class="btn-primary" onclick="archiveManager.clearFilters()">Clear All Filters</button>
            `,e.appendChild(t)}}hideEmptyState(){const e=document.querySelector(".empty-state");e&&e.remove()}updateResultsCount(){const e=document.getElementById("results-count");e&&(e.textContent=this.totalItems)}initPagination(){const e=document.querySelector(".pagination");if(!e)return;const t=e.querySelector(".prev"),r=e.querySelector(".next"),o=e.querySelectorAll(".page-btn:not(.prev):not(.next)");o.forEach(c=>{c.addEventListener("click",()=>{o.forEach(n=>n.classList.remove("active")),c.classList.add("active"),this.currentPage=parseInt(c.textContent),t.disabled=this.currentPage===1,r.disabled=this.currentPage===o.length,document.querySelector(".archive-results-header").scrollIntoView({behavior:"smooth"})})}),t.addEventListener("click",()=>{this.currentPage>1&&(this.currentPage--,o.forEach(c=>{parseInt(c.textContent)===this.currentPage&&c.click()}))}),r.addEventListener("click",()=>{this.currentPage<o.length&&(this.currentPage++,o.forEach(c=>{parseInt(c.textContent)===this.currentPage&&c.click()}))})}setupLoadMore(){const e=document.getElementById("load-more");e&&e.addEventListener("click",()=>{e.innerHTML='<i class="fas fa-spinner fa-spin me-2"></i>Loading...',e.disabled=!0,setTimeout(()=>{this.loadMoreProducts(),e.innerHTML='<i class="fas fa-sync-alt me-2"></i>Load More Products',e.disabled=!1},1e3)})}loadMoreProducts(){const e=document.querySelector(".archive-products-grid .row"),t=e.querySelector(".col-12").cloneNode(!0);for(let r=0;r<3;r++){const o=t.cloneNode(!0);o.querySelector(".archive-product-card");const c=o.querySelector("h4"),n=o.querySelector(".current-price");c.textContent=`Signal Booster ${Math.floor(Math.random()*1e3)}`,n.textContent=`£${(Math.random()*500+100).toFixed(2)}`;const i=o.querySelector(".product-badge");i&&i.remove(),e.appendChild(o)}this.totalItems+=3,this.updateResultsCount()}}const y=new m;window.archiveManager=y;const h=document.createElement("style");h.textContent=`
    .back-to-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-hover-color));
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 99;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top-btn.show {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
`;document.head.appendChild(h);
