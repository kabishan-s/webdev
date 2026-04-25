const socket = io();
let signinPage = true;


$(document).ready(function () {
  // Sign-in and Create account form
  $("#toggle-form").click(function () {
    signinPage = !signinPage;

    if(signinPage){
      $("#form-title").html("<strong>Sign-In</strong>");
      $("#signin-button").text("Sign-In");
      $("#toggle-form").text("Don't have an account? Create Account");
    } else {
      $("#form-title").html("<strong>Create Account</strong>");
      $("#signin-button").text("Create Account");
      $("#toggle-form").text("Have an account? Sign-In");
    }
  });

  $("#signin-button").click(async function () {
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    let validCredential = true;

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      $("#email-error").text("Invalid email");
      validCredential = false;
    }else{
      $("#email-error").text("");
    }

    if(password.length < 8){
      $("#password-error").text("Password must be at least 8 characters");
      validCredential = false;
    }else{
      $("#password-error").text("");
    }

    if(!validCredential){
      return;
    }

    const url = signinPage ? "/api/login" : "/api/register";
    
    // Saving accounts
    const data = await $.ajax({
        url: url,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({email, password})
      });


    if(data.error){
      alert(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    loadAccount();
  });
});

// Loading Accounts
function loadAccount(){
  // Checks if users are custoemrs or admin
  const user = JSON.parse(localStorage.getItem("user"));
  const adminUser = user && user.type === "admin";
  if(!user){
    return;
  }
  document.getElementById("authentication").style.display = "none";
  document.getElementById("account-overview").style.display = "block";
  document.getElementById("user-email").textContent = user.email;

  // Admin users see extra tabs for statistics
  if(adminUser){
    document.getElementById("order-tabs").style.display = "flex";
    adminTabs(user.email);

    const ordersTab = document.getElementById("orders-tab");
    const allOrdersTab = document.getElementById("all-orders-tab");

    ordersTab.classList.add("active");
    allOrdersTab.classList.remove("active");
    
    getOrders(user.email);

    socket.on("newOrder", () =>{
      const tab = document.querySelector(".active")?.id;
      if(tab === "orders-tab"){
        getAllOrders();
      }else if(tab === "all-orders-tab"){
        getAllOrders();
      }
      else if (tab === "sales-trend-tab"){
        salesTrendChart();
      }
      else if(tab === "product-sales-tab"){
        productSalesChart();
      }
      else if(tab === "gender-sales-tab"){
        genderSalesChart();
      }
    });
  }else{
    getOrders(user.email);
  }
}

document.getElementById("signout-button").onclick = () =>{
  localStorage.removeItem("user");
  window.location.reload();
};

// For viewing orders
async function getOrders(email){
  const response = await fetch(`/api/orders/${email}`);
  const data = await response.json();
  loadOrders(data.orders);
}

// For admin to view all orders
async function getAllOrders(){
  const response = await fetch(`/api/orders`);
  const data = await response.json();
  loadOrders(data.orders, true);
}


// Sales Statistics tabs for admin
function adminTabs(email){
  const ordersTab = document.getElementById("orders-tab");
  const allOrdersTab = document.getElementById("all-orders-tab");
  const salesTrendTab = document.getElementById("sales-trend-tab");
  const productSalesTab = document.getElementById("product-sales-tab"); 
  const genderSalesTab = document.getElementById("gender-sales-tab");

  const ordersDiv = document.getElementById("orders");
  const trendChart = document.getElementById("trend-chart");
  const productChart = document.getElementById("product-chart");
  const genderChart = document.getElementById("gender-chart");

  const title = document.getElementById("section-title");


  function resetTabs(){
    $("#orders-tab, #all-orders-tab, #sales-trend-tab, #product-sales-tab, #gender-sales-tab").removeClass("active");
    $("#orders, #trend-chart, #product-chart, #gender-chart").hide();

  }

  ordersTab.addEventListener("click", () => {
    resetTabs();
    ordersTab.classList.add("active");
    $("#orders").show();
    title.textContent = "Orders";
    getOrders(email);
  });

  allOrdersTab.addEventListener("click", () => {
    resetTabs();
    allOrdersTab.classList.add("active");
    $("#orders").show();
    title.textContent = "All Orders";
    getAllOrders();
  });

  salesTrendTab.addEventListener("click", () => {
    resetTabs();
    salesTrendTab.classList.add("active");
    $("#trend-chart").show();
    title.textContent = "Sales Trend";
    salesTrendChart();
  });

  productSalesTab.addEventListener("click", () => {
    resetTabs();
    productSalesTab.classList.add("active");
    $("#product-chart").show();
    title.textContent = "Product Sales";
    productSalesChart();
  });

  genderSalesTab.addEventListener("click", () => {
    resetTabs();
    genderSalesTab.classList.add("active");
    $("#gender-chart").show();
    title.textContent = "Gender Sales";
    genderSalesChart();
  });

}


// Displaying orders
function loadOrders(orderList, admin = false){
  const orders = document.getElementById("orders");
  orders.innerHTML = "";

  if(!orderList || orderList.length === 0){
    orders.innerHTML = "<p>No orders.</p>";
    return;
  }

  orderList.forEach(order => {
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
          <div>Quantity: ${item.quantity}</div>
        </div>
      </div>
    `).join("");

    div.innerHTML = `
      <div class="order-summary">
        <div>
          <strong>Order #${order.id}</strong>
          ${admin ? `<div class="order-email">${order.email}</div>` : ""}
        </div>
        <span>${new Date(order.date).toLocaleDateString()}</span>
        <span>Total: $${Number(order.total).toFixed(2)}</span>
      </div>
      <div class="order-info" style="display:none;">
        ${items}
      </div>
    `;

    $(div).click(function () {
      $(this).find(".order-info").slideToggle(200);
    });

    orders.appendChild(div);
  });
}

// Sales trend line chart
async function salesTrendChart(){
  const stats = await fetch("/api/sales/trend").then(r => r.json());
  stats.sort((a, b) => new Date(a.date) - new Date(b.date));
  const svg = d3.select("#trend-chart");
  svg.selectAll("*").remove();

  const width = 600;
  const height = 400;
  svg.attr("width", width).attr("height", height + 20);

  const x = d3.scaleTime().domain(d3.extent(stats, stat => new Date(stat.date))).range([50, width]);
  const y = d3.scaleLinear().domain([0, d3.max(stats, stat => stat.total)]).range([height - 30, 20]);
  const line = d3.line().x(stat => x(new Date(stat.date))).y(stat => y(stat.total));

  svg.append("path")
    .datum(stats)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("d", line);

  svg.append("g")
    .attr("transform", `translate(0,${height - 30})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(50,0)`)
    .call(d3.axisLeft(y));
  
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 10)
    .text("Time");
  
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .attr("x", -height / 2)
    .attr("y", 10)
    .text("Revenue ($)")
    .style("font-size", "13px");
}

// Product type bar graph
async function productSalesChart(){
  const stats = await fetch("/api/sales/products").then(r => r.json());

  const svg = d3.select("#product-chart");
  svg.selectAll("*").remove();

  const width = 600;
  const height = 400;

  svg.attr("width", width).attr("height", height + 20);

  const x = d3.scaleBand()
    .domain(stats.map(d => d.category))
    .range([50, width])
    .padding(0.4);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stats, d => d.total)])
    .range([height - 30, 20]);

  const colours = ["black", "blue", "gold", "brown"];
  
  svg.selectAll("rect")
    .data(stats)
    .enter()
    .append("rect")
    .attr("x", d => x(d.category))
    .attr("y", d => y(d.total))
    .attr("width", x.bandwidth())
    .attr("height", d => height - 30 - y(d.total))
    .attr("fill", (d, i) => colours[i]);

  svg.append("g")
    .attr("transform", `translate(0,${height - 30})`)
    .call(d3.axisBottom(x));
  svg.append("g")
    .attr("transform", `translate(50,0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + 10)
  .text("Category")
  .style("font-size", "15px");


  svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", `rotate(-90)`)
  .attr("x", -height / 2)
  .attr("y", 10)
  .text("Revenue ($)")
  .style("font-size", "13px");

}

// Gendr sales pi chart
async function genderSalesChart(){
  const stats = await fetch("/api/sales/gender").then(r => r.json());

  const svg = d3.select("#gender-chart");
  svg.selectAll("*").remove();

  const width = 400;
  const height = 400;
  const radius = 200;

  svg.attr("width", width).attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value(d => d.count);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 10);

  const colours = ["blue", "red"];
  g.selectAll("path")
    .data(pie(stats))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (data, i) => colours[i]);

  g.selectAll("text")
    .data(pie(stats))
    .enter()
    .append("text")
    .attr("transform", data => `translate(${arc.centroid(data)})`)
    .attr("text-anchor", "middle")
    .text(data => data.data.gender);
}

loadAccount();
