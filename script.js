// ============================
// MENU BURGER
// ============================
const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const closeBtn = document.getElementById('close-btn');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('show');
    overlay.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('show');
    overlay.classList.remove('show');
});

overlay.addEventListener('click', () => {
    sideMenu.classList.remove('show');
    overlay.classList.remove('show');
});

// ============================
// POS FORM
// ============================
const openPOS = document.getElementById("open-pos");
const posOverlay = document.getElementById("pos-overlay");
const closePOS = document.getElementById("close-pos");

openPOS.addEventListener("click", () => {
    posOverlay.classList.add("show");
    sideMenu.classList.remove("show");
    overlay.classList.remove("show");
});

closePOS.addEventListener("click", () => posOverlay.classList.remove("show"));

// ============================
// SALES & CREDITS FORM
// ============================
const openSales = document.getElementById("open-sales");
const salesOverlay = document.getElementById("sales-overlay");
const closeSales = document.getElementById("close-sales");
const openCredits = document.getElementById("open-credits");
const creditsOverlay = document.getElementById("credits-overlay");
const closeCredits = document.getElementById("close-credits");

openSales.addEventListener("click", () => {
    salesOverlay.classList.add("show");
    sideMenu.classList.remove("show");
    overlay.classList.remove("show");
    renderSalesTable();
});

closeSales.addEventListener("click", () => salesOverlay.classList.remove("show"));

openCredits.addEventListener("click", () => {
    creditsOverlay.classList.add("show");
    renderCreditsTable();
});

closeCredits.addEventListener("click", () => creditsOverlay.classList.remove("show"));

// ============================
// ESC KEY TO CLOSE FORMS
// ============================
document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
        posOverlay.classList.remove("show");
        salesOverlay.classList.remove("show");
        creditsOverlay.classList.remove("show");
    }
});

// ============================
// POS LOGIC (Cart + Sales)
// ============================
const addProductBtn = document.getElementById("add-product");
const cartBody = document.getElementById("cart-body");
const cartTotalEl = document.getElementById("cart-total");
const saveSaleBtn = document.getElementById("save-sale");
const posClient = document.getElementById("pos-client");
const posProduct = document.getElementById("pos-product");
const posQty = document.getElementById("pos-qty");
const posDiscount = document.getElementById("pos-discount");
const paymentType = document.getElementById("payment-type");
const cashGiven = document.getElementById("cash-given");
const cashChange = document.getElementById("cash-change");

// Product info spans
const infoBrand = document.getElementById("info-brand");
const infoPrice = document.getElementById("info-price");
const infoStock = document.getElementById("info-stock");
const infoDesc = document.getElementById("info-desc");
const infoExp = document.getElementById("info-exp");

let cart = [];
let sales = [];
let credits = [];
let productsJSON = [];

// ============================
// IMPORT CLIENTS & PRODUCTS
// ============================
const importClientsBtn = document.getElementById("import-clients");
const importProductsBtn = document.getElementById("import-products");
const clientsList = document.getElementById("clients-list");
const productsList = document.getElementById("products-list");

const clientsJSON = [
  { "id": 1, "name": "Jamal", "phone": "25565222255", "address": "dfdf 55", "description": "d,sgsdfgsd" },
  { "id": 2, "name": "Ali", "phone": "25565222255", "address": "dfdf 55", "description": "xxxx" }
];

importClientsBtn.addEventListener("click", () => {
    clientsList.innerHTML = "";
    clientsJSON.forEach(c => {
        const option = document.createElement("option");
        option.value = c.name;
        clientsList.appendChild(option);
    });
});



const sampleProductsJSON = [
  {
    "id": 2,
    "name": "cafe creme",
    "boxUnit": 1,
    "boxPrice": 12,
    "priceUnit": 12,
    "priceSell": 15,
    "profit": 3,
    "brand": "intense",
    "unit": "12",
    "supplier": "dddd",
    "expiration": "1111-11-11",
    "currentStock": 12,
    "soldStock": 6,
    "description": "sdssd 55"
  }
];
// ============================
// SAMPLE SALES JSON (PRÉCHARGÉ)
// ============================
const sampleSalesJSON = [
    {
        id_vente: 1,
        client: "Jamal",
        product: "cafe creme",
        price: 15,
        qty: 2,
        discount: 0,
        total: 30,
        payment_mode: "cash",
        payment_status: "payé",
        createdAt: new Date().toISOString()
    },
    {
        id_vente: 2,
        client: "Ali",
        product: "cafe creme",
        price: 15,
        qty: 1,
        discount: 0,
        total: 15,
        payment_mode: "credit",
        payment_status: "crédit",
        createdAt: new Date().toISOString()
    }
];

importProductsBtn.addEventListener("click", () => {
    productsJSON = sampleProductsJSON;
    productsList.innerHTML = "";
    productsJSON.forEach(p => {
        const option = document.createElement("option");
        option.value = p.name;
        productsList.appendChild(option);
    });
});

// ============================
// SHOW PRODUCT INFO
// ============================
posProduct.addEventListener("input", () => {
    const productName = posProduct.value.trim();
    const product = productsJSON.find(p => p.name === productName);
    if(product){
        infoBrand.textContent = product.brand;
        infoPrice.textContent = product.priceSell;
        infoStock.textContent = product.currentStock;
        infoDesc.textContent = product.description;
        infoExp.textContent = product.expiration;
    } else {
        infoBrand.textContent = "";
        infoPrice.textContent = "";
        infoStock.textContent = "";
        infoDesc.textContent = "";
        infoExp.textContent = "";
    }
});

// ============================
// CART FUNCTIONS
// ============================
function renderCart() {
    cartBody.innerHTML = "";
    let total = 0;
    cart.forEach((item,index)=>{
        const row = document.createElement("tr");
        const lineTotal = (item.price*item.qty - item.discount).toFixed(2);
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.discount.toFixed(2)}</td>
            <td>${lineTotal}</td>
            <td>
                <button onclick="editCart(${index})">Modifier</button>
                <button onclick="deleteCart(${index})">Supprimer</button>
            </td>
        `;
        cartBody.appendChild(row);
        total += parseFloat(lineTotal);
    });
    cartTotalEl.textContent = total.toFixed(2);
}

function addToCart() {
    const productName = posProduct.value.trim();
    const qty = parseInt(posQty.value) || 1;
    const discount = parseFloat(posDiscount.value) || 0;

    const product = productsJSON.find(p => p.name === productName);
    if(!product){
        alert("Produit introuvable !");
        return;
    }

    cart.push({
        product: productName,
        qty,
        price: parseFloat(product.priceSell),
        discount
    });
    renderCart();

    // reset
    posProduct.value = "";
    posQty.value = 1;
    posDiscount.value = 0;
    infoBrand.textContent = "";
    infoPrice.textContent = "";
    infoStock.textContent = "";
    infoDesc.textContent = "";
    infoExp.textContent = "";
}

addProductBtn.addEventListener("click", addToCart);

function editCart(index){
    const item = cart[index];
    posProduct.value = item.product;
    posQty.value = item.qty;
    posDiscount.value = item.discount;
    posProduct.dispatchEvent(new Event('input'));
    cart.splice(index,1);
    renderCart();
}

function deleteCart(index){
    cart.splice(index,1);
    renderCart();
}

// ============================
// CASH CHANGE
// ============================
function updateCashChange(){
    const total = parseFloat(cartTotalEl.textContent) || 0;
    const given = parseFloat(cashGiven.value) || 0;
    cashChange.textContent = given>=total ? (given-total).toFixed(2) : "0";
}
cashGiven.addEventListener("input", updateCashChange);

// ============================
// SAVE SALE
// ============================
saveSaleBtn.addEventListener("click", () => {
    const client = posClient.value.trim();
    const type = paymentType.value;
    if(!client || cart.length===0){
        alert("Choisir client et produits");
        return;
    }

    const now = new Date().toISOString();
    const saleId = (type === "cash" ? sales.length + 1 : credits.length + 1);

    const saleLines = cart.map(item => ({
        id_vente: saleId,
        client,
        product: item.product,
        price: item.price,
        qty: item.qty,
        discount: item.discount,
        total: parseFloat((item.price*item.qty - item.discount).toFixed(2)),
        payment_mode: type,
        payment_status: type==="cash"?"payé":"crédit",
        createdAt: now
    }));

    if(type === "cash"){
        sales.push(...saleLines);
        downloadJSON("ventes.json", sales);
    } else {
        credits.push(...saleLines);
        downloadJSON("credits.json", credits);
    }

    cart = [];
    renderCart();
    posClient.value = "";
    posProduct.value = "";
    posQty.value = 1;
    posDiscount.value = 0;
    cashGiven.value = "";
    cashChange.textContent = "0";

    renderSalesTable();
    renderCreditsTable();
    alert("Vente enregistrée !");
});

// ============================
// RENDER SALES TABLE (FULL)
// ============================
const salesTable = document.getElementById("sales-table");
function renderSalesTableFull() {
    salesTable.innerHTML = "";
    sales.forEach((sale,index)=>{
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${sale.id_vente}</td>
            <td>${sale.client}</td>
            <td>${sale.product}</td>
            <td>${sale.price.toFixed(2)}</td>
            <td>${sale.qty}</td>
            <td>${sale.discount.toFixed(2)}</td>
            <td>${sale.total.toFixed(2)}</td>
            <td>${sale.payment_mode}</td>
            <td>${sale.payment_status}</td>
            <td>${sale.createdAt}</td>
            <td>
                <button onclick="editSale(${index})">Modifier</button>
                <button onclick="deleteSale(${index})">Supprimer</button>
            </td>
        `;
        salesTable.appendChild(row);
    });
}

// ============================
// EDIT / DELETE SALE
// ============================
function editSale(index){
    const sale = sales[index];
    posClient.value = sale.client;
    posProduct.value = sale.product;
    posQty.value = sale.qty;
    posDiscount.value = sale.discount;
    posProduct.dispatchEvent(new Event('input'));
    cart = [{product:sale.product,qty:sale.qty,price:sale.price,discount:sale.discount}];
    renderCart();
}

function deleteSale(index){
    if(confirm("Supprimer cette vente ?")){
        sales.splice(index,1);
        renderSalesTable();
        downloadJSON("ventes.json", sales);
    }
}

// ============================
// RENDER CREDITS TABLE
// ============================
const creditsTable = document.getElementById("credits-table");
function renderCreditsTable(){
    creditsTable.innerHTML="";
    credits.forEach(sale=>{
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${sale.id_vente}</td>
            <td>${sale.client}</td>
            <td>${sale.product}</td>
            <td>${sale.price.toFixed(2)}</td>
            <td>${sale.qty}</td>
            <td>${sale.discount.toFixed(2)}</td>
            <td>${sale.total.toFixed(2)}</td>
            <td>${sale.createdAt}</td>
        `;
        creditsTable.appendChild(row);
    });
}

// ============================
// DOWNLOAD JSON
// ============================
function downloadJSON(filename,data){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download=filename;
    link.click();
}

// ============================
// IMPORT VENTES (AJOUT SUR LA LISTE EXISTANTE)
// ============================
const importSalesBtnsales = document.getElementById("import-sales-sales"); // Assure-toi d'avoir ce bouton
importSalesBtnsales.addEventListener("click", () => {
    sampleSalesJSON.forEach(sale => {
        if (sale.payment_status === "payé") {
            sales.push(sale);
        } else if (sale.payment_status === "crédit") {
            credits.push(sale);
        }
    });
    renderSalesTableFull();
    renderCreditsTable();
    alert("Ventes importées directement dans POS !");
});
//
const importSalesBtn = document.getElementById("import-sales");
importSalesBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedSales = JSON.parse(event.target.result);
                if (Array.isArray(importedSales)) {
                    importedSales.forEach(sale => {
                        if(sale.payment_status === "payé"){
                            sales.push(sale);
                        } else if(sale.payment_status === "crédit"){
                            credits.push(sale);
                        }
                    });
                    renderSalesTableFull();
                    renderCreditsTable();
                    alert("Ventes importées avec succès !");
                } else alert("Fichier invalide !");
            } catch (err) {
                alert("Erreur lors de l'importation : " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
});

// ============================
// EXPORT VENTES / CREDITS
// ============================
const exportSalesBtn = document.getElementById("export-sales");
exportSalesBtn.addEventListener("click", () => {
    if (sales.length === 0 && credits.length === 0) {
        alert("Aucune vente à exporter !");
        return;
    }
    downloadJSON("ventes.json", [...sales, ...credits]);
});

const importCreditsBtn = document.getElementById("import-credits");
const exportCreditsBtn = document.getElementById("export-credits");

importCreditsBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedCredits = JSON.parse(event.target.result);
                if (Array.isArray(importedCredits)) {
                    credits = importedCredits;
                    renderCreditsTable();
                    alert("Crédits importés avec succès !");
                } else alert("Fichier invalide !");
            } catch (err) {
                alert("Erreur lors de l'importation : " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
});

exportCreditsBtn.addEventListener("click", () => {
    if(credits.length === 0) { alert("Aucun crédit à exporter !"); return; }
    downloadJSON("credits.json", credits);
});

// ============================
// SALES FILTERS
// ============================
const filterClient = document.createElement("input");
filterClient.id = "filter-client";
filterClient.placeholder = "Filtrer par client";
filterClient.style.marginRight = "0.5rem";

const filterProduct = document.createElement("input");
filterProduct.id = "filter-product";
filterProduct.placeholder = "Filtrer par produit";
filterProduct.style.marginRight = "0.5rem";

const filterDate = document.createElement("select");
filterDate.id = "filter-date";

const dateOptions = [
    {label: "Aujourd'hui", value: "0"},
    {label: "1 jour", value: "1"},
    {label: "3 jours", value: "3"},
    {label: "1 semaine", value: "7"},
    {label: "15 jours", value: "15"},
    {label: "1 mois", value: "30"},
    {label: "3 mois", value: "90"},
    {label: "6 mois", value: "180"},
    {label: "1 an", value: "365"}
];

dateOptions.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    filterDate.appendChild(option);
});

const salesOverlayDiv = salesOverlay.querySelector(".category-form");
salesOverlayDiv.insertBefore(filterDate, salesOverlayDiv.querySelector(".table-wrapper"));
salesOverlayDiv.insertBefore(filterProduct, filterDate);
salesOverlayDiv.insertBefore(filterClient, filterProduct);

function applySalesFilters(){
    const clientFilterValue = filterClient.value.trim().toLowerCase();
    const productFilterValue = filterProduct.value.trim().toLowerCase();
    const daysFilter = parseInt(filterDate.value);
    const now = new Date();

    // Afficher toutes les ventes si aucun filtre actif
    if(!clientFilterValue && !productFilterValue && isNaN(daysFilter)){
        renderSalesTableFull();
        return;
    }

    const filteredSales = sales.filter(sale => {
        const clientMatch = sale.client.toLowerCase().includes(clientFilterValue);
        const productMatch = sale.product.toLowerCase().includes(productFilterValue);
        let dateMatch = true;
        if(!isNaN(daysFilter) && daysFilter >= 0){
            const saleDate = new Date(sale.createdAt);
            const diffTime = Math.abs(now - saleDate);
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            dateMatch = diffDays <= daysFilter;
        }
        return clientMatch && productMatch && dateMatch;
    });

    salesTable.innerHTML = "";
    filteredSales.forEach((sale,index)=>{
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${sale.id_vente}</td>
            <td>${sale.client}</td>
            <td>${sale.product}</td>
            <td>${sale.price.toFixed(2)}</td>
            <td>${sale.qty}</td>
            <td>${sale.discount.toFixed(2)}</td>
            <td>${sale.total.toFixed(2)}</td>
            <td>${sale.payment_mode}</td>
            <td>${sale.payment_status}</td>
            <td>${sale.createdAt}</td>
            <td>
                <button onclick="editSale(${index})">Modifier</button>
                <button onclick="deleteSale(${index})">Supprimer</button>
            </td>
        `;
        salesTable.appendChild(row);
    });
}
function applySalesFilters(){
    const clientFilterValue = filterClient.value.trim().toLowerCase();
    const productFilterValue = filterProduct.value.trim().toLowerCase();
    const daysFilter = parseInt(filterDate.value);
    const now = new Date();
    now.setHours(0,0,0,0); // ignore l'heure pour la comparaison

    const filteredSales = sales.filter(sale => {
        const clientMatch = sale.client.toLowerCase().includes(clientFilterValue);
        const productMatch = sale.product.toLowerCase().includes(productFilterValue);
        let dateMatch = true;

        if(!isNaN(daysFilter) && daysFilter >= 0){
            const saleDate = new Date(sale.createdAt);
            saleDate.setHours(0,0,0,0); // ignore l'heure
            const diffTime = now - saleDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            dateMatch = diffDays <= daysFilter;
        }

        return clientMatch && productMatch && dateMatch;
    });

    salesTable.innerHTML = "";
    filteredSales.forEach((sale,index)=>{
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${sale.id_vente}</td>
            <td>${sale.client}</td>
            <td>${sale.product}</td>
            <td>${sale.price.toFixed(2)}</td>
            <td>${sale.qty}</td>
            <td>${sale.discount.toFixed(2)}</td>
            <td>${sale.total.toFixed(2)}</td>
            <td>${sale.payment_mode}</td>
            <td>${sale.payment_status}</td>
            <td>${sale.createdAt}</td>
            <td>
                <button onclick="editSale(${index})">Modifier</button>
                <button onclick="deleteSale(${index})">Supprimer</button>
            </td>
        `;
        salesTable.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // ============================
    // RECHERCHE CREDITS
    // ============================
    const creditsSearch = document.getElementById('credits-search');
    const creditsTable = document.getElementById('credits-table');

    creditsSearch.addEventListener('input', () => {
        const filter = creditsSearch.value.toLowerCase();
        const rows = creditsTable.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            // Vérifie que les cellules existent pour éviter les erreurs
            const clientCell = rows[i].cells[1] ? rows[i].cells[1].textContent.toLowerCase() : '';
            const productCell = rows[i].cells[2] ? rows[i].cells[2].textContent.toLowerCase() : '';

            // Affiche la ligne si le client ou le produit correspond
            if (clientCell.includes(filter) || productCell.includes(filter)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    });
});


filterClient.addEventListener("input", applySalesFilters);
filterProduct.addEventListener("input", applySalesFilters);
filterDate.addEventListener("change", applySalesFilters);

// Redéfinir renderSalesTable pour afficher toutes les ventes et appliquer filtres
renderSalesTable = function(){
    renderSalesTableFull();
    applySalesFilters(); 
    applySalesFilters();
};