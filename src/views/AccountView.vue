<script setup>
import { onMounted } from 'vue';

let signinPage = true;

onMounted(() => {
  document.getElementById("toggle-form").onclick = function (){
    signinPage = !signinPage;

    if(signinPage){
      document.getElementById("form-title").textContent = "Sign-In";
      document.getElementById("signin-button").textContent = "Sign-In";
      document.getElementById("toggle-form").textContent = "Don't have an account? Create Account";
    }else{
      document.getElementById("form-title").textContent = "Create Account";
      document.getElementById("signin-button").textContent = "Create Account";
      document.getElementById("toggle-form").textContent = "Have an account? Sign-In";
    }
  };

  document.getElementById("signin-button").onclick = async () =>{
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let validCredential = true;

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      document.getElementById("email-error").textContent = "Invalid email";
      validCredential = false;
    }else{
      document.getElementById("email-error").textContent = "";
    }

    if(password.length < 8){
      document.getElementById("password-error").textContent = "Password must be at least 8 characters";
      validCredential = false;
    }else{
      document.getElementById("password-error").textContent = "";
    }

    if(!validCredential){
      return;
    }

    const url = signinPage ? "/api/login" : "/api/register";
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });

    const data = await res.json();

    if(data.error){
      alert(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    loadAccount();
  };

  

  document.getElementById("signout-button").onclick = () =>{
    localStorage.removeItem("user");
    window.location.reload();
  };

  loadAccount();
})

function loadAccount(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      return;
    }
    document.getElementById("authentication").style.display = "none";
    document.getElementById("account-overview").style.display = "block";
    document.getElementById("user-email").textContent = user.email;
    getOrders(user.email);
  }

async function getOrders(email){
    const response = await fetch(`/api/orders/${email}`);
    const data = await response.json();
    const orders = document.getElementById("orders");
    orders.innerHTML = "";

    if(!data.orders || data.orders.length === 0){
      orders.innerHTML = "<p>No orders.</p>";
      return;
    }

    data.orders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("order");

      const items = order.items.map(item => `
        <div class="order-item">
          <img src="${item.image}">
          <div class="item-info">
            <div class="item-header">
              <div class="item-name">${item.name}</div>
              <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div>Size: ${item.size}</div>
            <div>Qty: ${item.quantity}</div>
          </div>
        </div>
      `).join("");

      div.innerHTML = `
        <div class="order-summary">
          <strong>Order #${order.id}</strong>
          <span>${new Date(order.date).toLocaleDateString()}</span>
          <span>Total: $${Number(order.total).toFixed(2)}</span>
        </div>
        <div class="order-info" style="display:none;">
          ${items}
        </div>
      `;

      
      div.addEventListener("click", () => {
        const info = div.querySelector(".order-info");
        info.style.display = info.style.display === "none" ? "block" : "none";
      });
      orders.appendChild(div);
    });
  }
</script>

<template>
  <head>
    <title>Account</title>
  </head>

  <body>
    <div class="account-container">
      <div class="account">

        <h1 class="account-title">Account</h1>

        <div class="section" id="authentication">
          <h2 id="form-title">Sign-In</h2>

          <div class="field">
            <label>Email</label>
            <input type="text" id="email">
            <span class="field-error" id="email-error"></span>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" id="password">
            <span class="field-error" id="password-error"></span>
          </div>

          <button class="signin-button" id="signin-button">Sign-In</button>

          <p style="margin-top:10px;">
            <a href="#" id="toggle-form">Don't have an account? Create Account</a>
          </p>
        </div>

        <div id="account-overview" style="display:none;">
          <div class="overview">
            <div class="orders">
              <h2>Orders</h2>
              <div id="orders">
              </div>
            </div>

            <div class="account-info">
              <h3>Account Info</h3>
              <p id="user-email"></p>
              <button id="signout-button">Sign Out</button>
            </div>
          </div>
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
    background: rgb(209, 208, 238);
    color: rgb(0, 0, 0);
    min-height: 100vh;
    font-family: "Lora", serif;
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

.home{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 40px 20px;
}

.logo img{
    height: 45px;
    width: auto;
    margin-left: 10px;
    cursor: pointer;
}


.account-container{
    display: flex;
    align-items: flex-start;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    gap: 40px;
    padding: 40px;
}

.account{
    display: flex;
    flex: 2;
    flex-direction: column;
    gap: 24px;
}

.account-title{
    font-size: 2rem;
    font-weight: 500;
}

.section{
    background: white;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section h2{
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

.field input:focus{
    border-color: rgb(34, 72, 104);
}
.field input.invalid{
    border-color:rgb(211, 60, 43);
}

.field-error{
    font-size: 0.75rem;
    color: rgb(211, 60, 43);
    min-height: 16px;
    margin-top: 3px;
}

.field-row{
    display: flex;
    gap: 16px;
}

.signin-button{
    background: linear-gradient(120deg, rgb(34, 72, 104), rgb(163, 179, 233));
    color: white;
    width: 100%;
    font-family: "Lora", serif;
    font-size: 1rem;
    padding: 14px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 0.03em;
}

.signin-button:hover{
    background: linear-gradient(120deg, rgb(49, 109, 159), rgb(163, 179, 233));
}

.overview{
    display: flex;
    margin-top: 20px;
    gap: 40px;
}

.orders{
    flex: 2;
}

.account-info{
    flex: 1;
    padding-left: 20px;
    border-left: 1px solid rgb(212, 212, 212);

}

#signout-button{
    margin-top: 20px;
    padding: 10px;
    cursor: pointer;
}

.order{
    padding: 15px 0;
    border-bottom: 1px solid rgb(212, 212, 212);
    cursor: pointer;
}

.order-summary{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: bold;
}

.order-info{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    gap: 10px;
}

.order-item{
    background: #f0f0f0;
    display: flex;
    gap: 15px;
    padding: 10px;
}

.order-item img{
    width: 80px;
    height: 80px;
    object-fit: cover;
}

.item-info{
    flex: 1;
}

.item-header{
    display: flex;
    justify-content: space-between;
}

.orders{
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 5px rgba(0,0,0,0.1);
}

.account-info{
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 5px rgba(0,0,0,0.1);
}

.overview{
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    gap: 20px;
}
</style>