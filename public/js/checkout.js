let user = JSON.parse(localStorage.getItem("user"));
let total = 0;

async function loadCart(){
  const response = await fetch(`/api/cart/${user.email}`);
  const data = await response.json();
  let cart = data.cart || [];
  user.cart = cart;
  localStorage.setItem("user", JSON.stringify(user));

  let subtotal = 0;

  // Displays items being purchased and their details
  cart.forEach(function (item){
    let itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    let div = document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML = `
          <img src="${item.image}">
          <div class="order-item-info">
              <div class="name">${item.name} x${item.quantity}</div>
              <div class="size">Size: ${item.size}</div>
          </div>
          <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
      `;
    document.getElementById("order-items").appendChild(div);
  });

  let tax = subtotal * 0.13;
  total = subtotal + tax;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Input fields for purchasing details
document.getElementById("card-number").addEventListener("input", function (e) {
  let val = e.target.value.replace(/\D/g, "").slice(0, 16);
  e.target.value = val.match(/.{1,4}/g)?.join(" ") || val;
});

document.getElementById("card-expiry").addEventListener("input", function (e) {
  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (val.length >= 3) {
    val = val.slice(0, 2) + "/" + val.slice(2);
  }
  e.target.value = val;
});

document.getElementById("card-cvv").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});


document.getElementById("pay-btn").addEventListener("click", async function () {
  let email = document.getElementById("email").value;
  let name = document.getElementById("card-name").value;
  let number = document.getElementById("card-number").value;
  let expiry = document.getElementById("card-expiry").value;
  let cvv = document.getElementById("card-cvv").value;

  let valid = true;

  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){
    document.getElementById("email").classList.remove("invalid");
    document.getElementById("error-email").textContent = "";
  }else{
    document.getElementById("email").classList.add("invalid");
    document.getElementById("error-email").textContent = "Enter a valid email address";
    valid = false;
  }

  if(/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)+$/.test(name.trim())){
    document.getElementById("card-name").classList.remove("invalid");
    document.getElementById("error-name").textContent = "";
  }else{
    document.getElementById("card-name").classList.add("invalid");
    document.getElementById("error-name").textContent = "Enter first and last name";
    valid = false;
  }

  if(/^\d{4} \d{4} \d{4} \d{4}$/.test(number.trim())){
    document.getElementById("card-number").classList.remove("invalid");
    document.getElementById("error-number").textContent = "";
  }else{
    document.getElementById("card-number").classList.add("invalid");
    document.getElementById("error-number").textContent = "Must be 16 digits";
    valid = false;
  }

  let expiryValid = false;
  if(/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)){
    let parts = expiry.split("/");
    let month = parseInt(parts[0]);
    let year = parseInt(parts[1]);
    let now = new Date();
    let expiryDate = new Date(2000 + year, month - 1);
    if(expiryDate >= new Date(now.getFullYear(), now.getMonth())){
      expiryValid = true;
    }
  }
  if(expiryValid){
    document.getElementById("card-expiry").classList.remove("invalid");
    document.getElementById("error-expiry").textContent = "";
  }else{
    document.getElementById("card-expiry").classList.add("invalid");
    document.getElementById("error-expiry").textContent = "Enter a valid expiry (MM/YY)";
    valid = false;
  }

  if(/^\d{3}$/.test(cvv.trim())){
    document.getElementById("card-cvv").classList.remove("invalid");
    document.getElementById("error-cvv").textContent = "";
  }else{
    document.getElementById("card-cvv").classList.add("invalid");
    document.getElementById("error-cvv").textContent = "Must be 3 digits";
    valid = false;
  }

  // Saves orders
  if(valid){
    await fetch('/api/orders/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: user.email,
        cart: user.cart,
        total: total
      })
    });
  
    user.cart = [];
    localStorage.setItem("user", JSON.stringify(user));
    await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: user.email, cart: []})
    });

    alert("Payment Successful!");
    window.location.href = "homepage.html";
  }
});

loadCart();