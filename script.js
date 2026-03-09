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
const makeSaleBtn = document.getElementById("make-sale-btn");
const posForm = document.getElementById("pos-form");

makeSaleBtn.addEventListener("click", () => {
    const isVisible = posForm.style.display === "block";

    // Fermer tous les autres overlays
    salesOverlay.classList.remove("show");
    creditsOverlay.classList.remove("show");

    // Toggle du formulaire POS
    posForm.style.display = isVisible ? "none" : "block";
});
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
const cashSection = document.getElementById("cash-section");



let cart = [];
let sales = [];
let credits = [];
let productsJSON = [];

// ============================
// IMPORT CLIENTS & PRODUCTS
// ============================
const importClientsBtn = document.getElementById("import-clients");
const importProductsBtn = document.getElementById("import-products");

importProductsBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = event => {
            try {
                productsJSON = JSON.parse(event.target.result);

                const productsList = document.getElementById("products-list");
                productsList.innerHTML = "";

                productsJSON.forEach(p => {
                    const option = document.createElement("option");
                    option.value = p.name;
                    productsList.appendChild(option);
                });

                // ✅ bouton reste vert après import
                importProductsBtn.style.backgroundColor = "green";
                importProductsBtn.style.color = "white";

                alert("Produits importés !");
            } catch (err) {
                alert("Erreur lors de l'import : " + err.message);
            }
        };

        reader.readAsText(file);
    };

    input.click();
});const clientsList = document.getElementById("clients-list");
const productsList = document.getElementById("products-list");

const clientsJSON = [
  { "id": 1, "name": "Jamal", "phone": "25565222255", "address": "dfdf 55", "description": "d,sgsdfgsd" },
  { "id": 2, "name": "Ali", "phone": "25565222255", "address": "dfdf 55", "description": "xxxx" }
];

// IMPORT CLIENTS
importClientsBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; 
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedClients = JSON.parse(event.target.result);
                if (Array.isArray(importedClients)) {
                    clientsJSON.splice(0, clientsJSON.length, ...importedClients);
                    clientsList.innerHTML = "";
                    clientsJSON.forEach(c => {
                        const option = document.createElement("option");
                        option.value = c.name;
                        clientsList.appendChild(option);
                    });
                    // Changer le bouton en vert après import
                    importClientsBtn.style.backgroundColor = "green";
                    importClientsBtn.style.color = "white"; // pour que le texte reste lisible
                    alert("Clients importés avec succès !");
                } else alert("Fichier clients invalide !");
            } catch (err) {
                alert("Erreur lors de l'importation des clients : " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
});

function toggleCashSection(){

    if(paymentType.value === "cash"){
        cashSection.style.display = "block";
    }else{
        cashSection.style.display = "none";
    }

}
paymentType.addEventListener("change", toggleCashSection);
toggleCashSection();
// ============================
// SAMPLE SALES JSON (PRÉCHARGÉ)
// ============================

// ============================
// SHOW PRODUCT INFO
// ============================
posProduct.addEventListener("input", () => {
    const value = posProduct.value.trim().toLowerCase();
    const product = productsJSON.find(p => p.name.toLowerCase() === value);

    const infoEl = document.getElementById("product-info");

    if(product){
        // Affichage dynamique de **tous les champs du JSON**
infoEl.classList.add("product-info");

infoEl.innerHTML = `
    <p><strong>Name:</strong> ${product.name}</p>
    <p><strong>Unit:</strong> ${product.unit}</p>
    <p><strong>Price Unit:</strong> ${product.priceUnit.toFixed(2)} DH</p>
    <p class="price-sell"><strong>Price Sell:</strong> ${product.priceSell.toFixed(2)} DH</p>
    <p><strong>Profit:</strong> ${product.profit.toFixed(2)} DH</p>
    <p><strong>Current Stock:</strong> ${product.currentStock}</p>
    <p><strong>Sold Stock:</strong> ${product.soldStock || 0}</p>
    <p><strong>Supplier:</strong> ${product.supplier}</p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Expiration:</strong> ${product.expiration}</p>
`;
    } else {
        infoEl.innerHTML = ""; // vide si le produit n'existe pas
    }
});

// Masquer l'autocomplete si on clique à l'extérieur
document.addEventListener("click", e => {
    if (e.target !== posProduct && e.target.parentNode !== productAutocomplete) {
        productAutocomplete.style.display = "none";
    }
});

// ============================
// CART FUNCTIONS
// ============================
function renderCart() {
    cartBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const lineTotal = (item.price * item.qty) - item.discount;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Produit">${item.product}</td>
            <td data-label="Catégorie">${item.category}</td>
            <td data-label="Marque">${item.brand}</td>
            <td data-label="Quantité">${item.qty}</td>
            <td data-label="Prix">${item.price.toFixed(2)} MAD</td>
            <td data-label="Remise">${item.discount.toFixed(2)} MAD</td>
            <td data-label="Total">${lineTotal.toFixed(2)} MAD</td>
            <td data-label="Description">${item.description}</td>
            <td data-label="Expiration">${item.expiration}</td>
            <td data-label="Actions">
                <button onclick="deleteCart(${index})">Supprimer</button>
            </td>
        `;

        cartBody.appendChild(row);
        total += lineTotal;
    });

    cartTotalEl.textContent = total.toFixed(2) + " MAD";
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

    if(qty > product.currentStock){
        alert("Stock insuffisant !");
        return;
    }

    // Ajouter tous les champs
    cart.push({
        id: product.id,
        product: product.name,
        category: product.category,
        boxUnit: product.boxUnit,
        boxPrice: product.boxPrice,
        priceUnit: product.priceUnit,
        price: parseFloat(product.priceSell),
        profit: product.profit,
        brand: product.brand,
        unit: product.unit,
        supplier: product.supplier,
        expiration: product.expiration,
        description: product.description,
        qty,
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

    const change = given - total;

    cashChange.textContent = change > 0 ? change.toFixed(2) + " MAD" : "0 MAD";
}
cashGiven.addEventListener("input", updateCashChange);

// ============================
// SAVE SALE
// ============================
saveSaleBtn.addEventListener("click", () => {
    let client = posClient.value.trim();
    const type = paymentType.value;

    // Si le client est vide, on met "Client passager"
    if(!client){
        client = "Client passager";
    }

    if(cart.length === 0){
        alert("Choisir au moins un produit");
        return;
    }

    const now = new Date().toISOString();
    const saleId = (type === "cash" ? sales.length + 1 : credits.length + 1);

const saleLines = cart.map(item => {

    const product = productsJSON.find(p => p.name === item.product);

    if(product){

        // diminuer le stock
        product.currentStock = product.currentStock - item.qty;

        // sécurité stock négatif
        if(product.currentStock < 0){
            product.currentStock = 0;
        }
     if(!product.soldStock) product.soldStock = 0;
    product.soldStock += item.qty;

    }

    return {

        id_vente: saleId,
        client,
        product: item.product,
        price: item.price,
        qty: item.qty,
        discount: item.discount,
        total: parseFloat((item.price*item.qty - item.discount).toFixed(2)),
        payment_mode: type,
        payment_status: type==="cash" ? "payé" : "non payé",
        createdAt: now

    };

});

    if(type === "cash"){
        sales.push(...saleLines);
        downloadJSON("ventes.json", sales);
        
    } else {
        credits.push(...saleLines);
        downloadJSON("credits.json", credits);
    }
    // mise à jour du fichier produits
downloadJSON("products.json", productsJSON);

    // reset form
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
    // Retour à l'étape 1
document.getElementById("step1").style.display = "block";
document.getElementById("step2").style.display = "none";
document.getElementById("step3").style.display = "none";
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
  <td data-label="ID Vente">${sale.id_vente}</td>
  <td data-label="Client">${sale.client}</td>
  <td data-label="Produit">${sale.product}</td>
  <td data-label="Prix">${sale.price.toFixed(2)}</td>
  <td data-label="Quantité">${sale.qty}</td>
  <td data-label="Remise">${sale.discount.toFixed(2)}</td>
  <td data-label="Total">${sale.total.toFixed(2)}</td>
  <td data-label="Paiement">${sale.payment_mode}</td>
  <td data-label="Statut">${sale.payment_status}</td>
  <td data-label="Date">${sale.createdAt}</td>
  <td data-label="Actions">
    <button onclick="deleteSale(${index})">Supprimer</button>
  </td>
`;
row.cells[6].style.color = "green";
row.cells[6].style.fontSize = "25px";
row.cells[6].style.fontWeight = "bold";
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
// AUTOCOMPLÉTION CLIENT
// ============================
// ============================
// AUTOCOMPLÉTION CLIENT
// ============================
const clientAutocomplete = document.createElement("div");
clientAutocomplete.style.position = "absolute";
clientAutocomplete.style.border = "1px solid #ccc";
clientAutocomplete.style.background = "#fff";
clientAutocomplete.style.maxHeight = "150px";
clientAutocomplete.style.overflowY = "auto";
clientAutocomplete.style.zIndex = "1000";
clientAutocomplete.style.display = "none";
clientAutocomplete.style.width = posClient.offsetWidth + "px";
posClient.parentNode.appendChild(clientAutocomplete);

posClient.addEventListener("input", () => {
    const value = posClient.value.trim().toLowerCase();
    clientAutocomplete.innerHTML = "";

    if (!value) {
        posClient.value = "Client Passager"; // valeur par défaut
        clientAutocomplete.style.display = "none";
        return;
    }

    const matches = clientsJSON.filter(c => c.name.toLowerCase().includes(value));

    if(matches.length === 1){
        posClient.value = matches[0].name; // complet automatiquement
        clientAutocomplete.style.display = "none";
        posProduct.focus(); // passe au champ produit automatiquement
    } else {
        matches.forEach(c => {
            const item = document.createElement("div");
            item.textContent = c.name;
            item.style.padding = "5px";
            item.style.cursor = "pointer";
            item.addEventListener("click", () => {
                posClient.value = c.name;
                clientAutocomplete.style.display = "none";
                posProduct.focus();
            });
            clientAutocomplete.appendChild(item);
        });
        clientAutocomplete.style.display = matches.length ? "block" : "none";
    }
});

document.addEventListener("click", e => {
    if (e.target !== posClient && e.target.parentNode !== clientAutocomplete) {
        clientAutocomplete.style.display = "none";
    }
});

// ============================
// AUTOCOMPLÉTION PRODUIT
// ============================
const productAutocomplete = document.createElement("div");
productAutocomplete.style.position = "absolute";
productAutocomplete.style.border = "1px solid #ccc";
productAutocomplete.style.background = "#fff";
productAutocomplete.style.maxHeight = "150px";
productAutocomplete.style.overflowY = "auto";
productAutocomplete.style.zIndex = "1000";
productAutocomplete.style.display = "none";
productAutocomplete.style.width = posProduct.offsetWidth + "px";
posProduct.parentNode.appendChild(productAutocomplete);

posProduct.addEventListener("input", () => {
    const value = posProduct.value.trim().toLowerCase();
    const matches = productsJSON.filter(p => p.name.toLowerCase().includes(value));


    if(value && matches.length === 1){
        const product = matches[0];

        posProduct.value = product.name; // complète automatiquement

        // Affichage des détails du produit après le champ


        posQty.focus(); // passe automatiquement au champ quantité
    } else {
        productDetailsEl.innerHTML = ""; // vide si pas de correspondance
    }
});

document.addEventListener("click", e => {
    if (e.target !== posProduct && e.target.parentNode !== productAutocomplete) {
        productAutocomplete.style.display = "none";
    }
});
// ============================
// RENDER CREDITS TABLE
// ============================
const creditsTable = document.getElementById("credits-table");
function renderCreditsTable() {
    creditsTable.innerHTML = "";

    credits.forEach((sale, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td data-label="ID Vente">${sale.id_vente}</td>
            <td data-label="Client">${sale.client}</td>
            <td data-label="Produit">${sale.product}</td>
            <td data-label="Prix">${sale.price.toFixed(2)}</td>
            <td data-label="Quantité">${sale.qty}</td>
            <td data-label="Remise">${sale.discount.toFixed(2)}</td>
            <td data-label="Total">${sale.total.toFixed(2)}</td>
            <td data-label="Statut">
                <select onchange="updateCreditStatus(${index}, this.value)">
                    <option value="non payé" ${sale.payment_status === "non payé" ? "selected" : ""}>
                        Non payé
                    </option>
                    <option value="payé" ${sale.payment_status === "payé" ? "selected" : ""}>
                        Payé
                    </option>
                </select>
            </td>
            <td data-label="Date">${sale.createdAt}</td>
            <td data-label="Actions">
                <button onclick="deleteCredit(${index})">Supprimer</button>
            </td>
        `;
        row.cells[6].style.color = "green";
row.cells[6].style.fontSize = "25px";
row.cells[6].style.fontWeight = "bold";

        creditsTable.appendChild(row);
    });
}
function updateCreditStatus(index, value){

    const credit = credits[index];

    // changer le statut du crédit
    credit.payment_status = value;

    // si le crédit devient payé
    if(value === "payé"){

        const saleEntry = {
            id_vente: credit.id_vente,
            client: credit.client,
            product: credit.product,
            price: credit.price,
            qty: credit.qty,
            discount: credit.discount,
            total: credit.total,
            payment_mode: "credit",
            payment_status: "payé",

            // IMPORTANT : utiliser la même date du crédit
            createdAt: credit.createdAt
        };

        sales.push(saleEntry);

        renderSalesTable();
    }

    renderCreditsTable();

    // sauvegarder les fichiers
    downloadJSON("credits.json", credits);
    downloadJSON("ventes.json", sales);
}
let sortCreditsDirection = {};
function sortCredits(column){

    if(!sortCreditsDirection[column]){
        sortCreditsDirection[column] = "asc";
    }else{
        sortCreditsDirection[column] =
        sortCreditsDirection[column] === "asc" ? "desc" : "asc";
    }

    credits.sort((a,b)=>{

        let valA = a[column];
        let valB = b[column];

        if(!isNaN(valA) && !isNaN(valB)){
            valA = Number(valA);
            valB = Number(valB);
        }else{
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
        }

        if(sortCreditsDirection[column] === "asc"){
            return valA > valB ? 1 : -1;
        }else{
            return valA < valB ? 1 : -1;
        }

    });

    renderCreditsTable();
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
const importSalesBtnSales = document.getElementById("import-sales-sales");

importSalesBtnSales.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; // n'accepte que les fichiers JSON
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
                } else {
                    alert("Fichier de ventes invalide !");
                }
            } catch (err) {
                alert("Erreur lors de l'importation des ventes : " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
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
                    // Changer le bouton en vert après import
                    importSalesBtn.style.backgroundColor = "green";
                    importSalesBtn.style.color = "white";
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
// Import Credits sur POS
const importCreditsBtnpos = document.getElementById("import-credits-pos");
const creditsFileInput = document.getElementById("credits-file");

importCreditsBtnpos.addEventListener("click", () => {
    creditsFileInput.click();
});

creditsFileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            credits = data; // charger les crédits
            renderCreditsTable(); // rafraîchir la liste

            // Changer le bouton en vert après import réussi
            importCreditsBtnpos.style.backgroundColor = "green";
            importCreditsBtnpos.style.color = "white";

           
        } catch (error) {
            alert("Erreur dans le fichier credits.json");
        }
    };

    reader.readAsText(file);
});


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
                    credits = importedCredits.map(sale => ({
                        ...sale,
                        payment_status: sale.payment_status || "non payé"
                    }));
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
// SORT SALES (ASC / DESC)
// ============================
let sortDirection = {};

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
<td data-label="ID Vente">${sale.id_vente}</td>
<td data-label="Client">${sale.client}</td>
<td data-label="Produit">${sale.product}</td>
<td data-label="Prix">${sale.price.toFixed(2)}</td>
<td data-label="Quantité">${sale.qty}</td>
<td data-label="Remise">${sale.discount.toFixed(2)}</td>
<td data-label="Total">${sale.total.toFixed(2)}</td>
<td data-label="Paiement">${sale.payment_mode}</td>
<td data-label="Statut">${sale.payment_status}</td>
<td data-label="Date">${sale.createdAt}</td>
<td data-label="Actions">
<button onclick="deleteSale(${index})">Supprimer</button>
</td>
`;
row.cells[6].style.color = "green";
row.cells[6].style.fontSize = "25px";
row.cells[6].style.fontWeight = "bold";
        salesTable.appendChild(row);
    });
}

//

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
    
};
function sortSales(column){

    if(!sortDirection[column]){
        sortDirection[column] = "asc";
    }else{
        sortDirection[column] = sortDirection[column] === "asc" ? "desc" : "asc";
    }

    sales.sort((a,b)=>{

        let valA = a[column];
        let valB = b[column];

        if(!isNaN(valA) && !isNaN(valB)){
            valA = Number(valA);
            valB = Number(valB);
        }else{
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
        }

        if(sortDirection[column] === "asc"){
            return valA > valB ? 1 : -1;
        }else{
            return valA < valB ? 1 : -1;
        }

    });

    renderSalesTable();
}
// ============================
// POS STEPS (1 -> 2 -> 3)
// ============================
// Navigation étapes POS
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

document.getElementById("next-step2").addEventListener("click", () => {
    step1.style.display = "none";
    step2.style.display = "block";
});

document.getElementById("back-step1").addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "block";
});

document.getElementById("next-step3").addEventListener("click", () => {
    step2.style.display = "none";
    step3.style.display = "block";
});

document.getElementById("back-step2").addEventListener("click", () => {
    step3.style.display = "none";
    step2.style.display = "block";
});
