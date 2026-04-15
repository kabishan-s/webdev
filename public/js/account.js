let signinPage = true;


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

document.getElementById("signout-button").onclick = () =>{
  localStorage.removeItem("user");
  window.location.reload();
};

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


loadAccount();