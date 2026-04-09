function changeQuantity(index, change){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += change;

    if(cart[index].quantity <= 0){
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function updateSummary(subtotal){
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

function loadCart(){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) =>{
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <img src="${item.image}">
            
            <div class="item-info">
                <div class="item-title">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${itemTotal.toFixed(2)}</div>
                </div>
                <div>${item.description}</div>
                <div>Size: ${item.size}</div>
                <div class="quantity">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
        `;
        cartItems.appendChild(div);
    });
    updateSummary(subtotal);
}

loadCart();