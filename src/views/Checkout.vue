<script>
import { onMounted } from 'vue';
let user = JSON.parse(localStorage.getItem("user"));
let total = 0;

async function loadCart(){
  const response = await fetch(`/api/cart/${user.email}`);
  const data = await response.json();
  let cart = data.cart || [];
  user.cart = cart;
  localStorage.setItem("user", JSON.stringify(user));

  let subtotal = 0;

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

onMounted(() => {
  loadCart();
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
});
</script>

<template>
  <head>
    <title>Checkout</title>

  </head>

  <body>
    <div class="checkout-wrapper">

      <div class="checkout-left">
        <h1 class="checkout-title">Checkout</h1>

        <div class="section-block">
          <h2>Contact</h2>
          <div class="field">
            <label>Email Address</label>
            <input type="text" id="email" placeholder="john@example.com">
            <span class="field-error" id="error-email"></span>
          </div>
        </div>

        <div class="section-block">
          <h2>Payment</h2>
          <div class="field">
            <label>Cardholder Name</label>
            <input type="text" id="card-name" placeholder="John Smith" maxlength="60">
            <span class="field-error" id="error-name"></span>
          </div>
          <div class="field">
            <label>Card Number</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
            <span class="field-error" id="error-number"></span>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Expiry Date</label>
              <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
              <span class="field-error" id="error-expiry"></span>
            </div>
            <div class="field">
              <label>CVV</label>
              <input type="text" id="card-cvv" placeholder="123" maxlength="3">
              <span class="field-error" id="error-cvv"></span>
            </div>
          </div>
        </div>

        <button class="pay-btn" id="pay-btn">Complete Transaction</button>
      </div>

      <div class="checkout-right">
        <h2>Order Summary</h2>
        <div id="order-items"></div>
        <div class="order-totals">
          <p>Subtotal: $<span id="subtotal">0.00</span></p>
          <p>Tax (13%): $<span id="tax">0.00</span></p>
          <p class="order-total">Total: $<span id="total">0.00</span></p>
        </div>
      </div>

    </div>

  </body>
</template>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body{
    display: flex;
    flex-direction: column;
    font-family: "Lora", serif;
    background: #f5f5f5;
    min-height: 100vh;
}

.navbar{
    display: flex;
    align-items: center;
    background: linear-gradient(150deg, rgb(34, 72, 104), rgb(163, 179, 233));
    padding: 0px;
    flex-wrap: wrap;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    height: 50px;
    overflow: visible;
}

nav{
    flex: 1;
    text-align: right;
}

nav ul li{
    display: inline-block;
    margin-right: 25px;
}

nav a{
    text-decoration: none;
}

.logo img{
    height: 45px;
    width: auto;
    margin-left: 10px;
    cursor: pointer;
}

.checkout-wrapper{
    display: flex;
    gap: 40px;
    padding: 40px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    align-items: flex-start;
}

.checkout-left{
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.checkout-title{
    font-size: 2rem;
    font-weight: 500;
}

.section-block{
    background: white;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-block h2{
    font-size: 1.1rem;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.field{
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    flex: 1;
}

.field label{
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 4px;
    letter-spacing: 0.03em;
}

.field input{
    padding: 10px 12px;
    border: 1px solid #ccc;
    font-family: "Lora", serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
}

.field input:focus{ border-color: rgb(34, 72, 104); }
.field input.invalid{ border-color: #c0392b; }

.field-error{
    font-size: 0.75rem;
    color: #c0392b;
    min-height: 16px;
    margin-top: 3px;
}

.field-row{
    display: flex;
    gap: 16px;
}

.pay-btn{
    width: 100%;
    padding: 14px;
    background: linear-gradient(120deg, rgb(34, 72, 104), rgb(163, 179, 233));
    color: white;
    border: none;
    font-family: "Lora", serif;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 0.03em;
}

.pay-btn:hover{
    background: linear-gradient(120deg, rgb(49, 109, 159), rgb(163, 179, 233));
}

.checkout-right{
    flex: 1;
    background: white;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    position: sticky;
    top: 20px;
}

.checkout-right h2{
    font-size: 1.1rem;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.order-item{
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.order-item img{
    width: 55px;
    height: 55px;
    object-fit: cover;
    border-radius: 4px;
}

.order-item-info{
    flex: 1;
    font-size: 0.9rem;
}

.order-item-info .name{ font-weight: 600; }
.order-item-info .size{ color: #777; font-size: 0.8rem; }

.order-item-price{
    font-weight: bold;
    font-size: 0.9rem;
}

.order-totals{
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.95rem;
}

.order-total{
    font-weight: bold;
    font-size: 1.05rem;
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px solid #eee;
}
</style>