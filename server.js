import express from "express";
import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import open from "open";


import http from "http";
import { Server } from "socket.io";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Gets products
function getProducts() {
  const file = path.join(__dirname, "json", "products.json");
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data);
}

app.get("/api/products", (req, res) =>{
  res.json(getProducts());
});

app.get("/api/products/:id", (req, res) =>{
  const products = getProducts();
  const product = products.find(product => product.id == req.params.id);
  if(!product){
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Gets users
function getUsers(){
  const file = path.join(__dirname, "json", "users.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Saves users to json
function addUsers(users){
  const file = path.join(__dirname, "json", "users.json");
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}

// Handles registering accounts
app.post("/api/register", (req, res) =>{
  const {email, password} = req.body;
  let users = getUsers();

  if(users.find(u => u.email === email)){
    return res.json({error: "An account with these credentials already exists"});
  }

  const newUser = {
    email,
    password,
    type: "user",
    cart: [],
    orders: []
  };

  users.push(newUser);
  addUsers(users);
  res.json({user: newUser});
});

// Handles loggining into accounts
app.post("/api/login", (req, res) =>{
  const {email, password} = req.body;
  let users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if(!user){
    return res.json({error: "Account not found"});
  }

  res.json({user});
});

// Handles adding user cart items
app.post("/api/cart/update", (req, res) =>{
  const {email, cart} = req.body;
  let users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if(userIndex === -1){
    return res.status(404).json({error: "User not found"});
  }
  
  users[userIndex].cart = cart;
  addUsers(users);
  res.json({success: true, cart});
});

// Handles retrieving user cart items
app.get("/api/cart/:email", (req, res) =>{
  const users = getUsers();
  const user = users.find(u => u.email === req.params.email);
  
  if(!user){
    return res.status(404).json({error: "User not found"});
  }
  
  res.json({cart: user.cart || []});
});

// Handles creating orders for users
app.post("/api/orders/create", (req, res) =>{
  const {email, cart, total} = req.body;
  let users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1){
    return res.status(404).json({error: "User not found"});
  }

  const newOrder = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart,
    total: Number(total)
  };

  users[userIndex].orders = users[userIndex].orders || [];
  users[userIndex].orders.unshift(newOrder);
  addUsers(users);
  io.emit("newOrder", newOrder);
  res.json({ success: true, order: newOrder });
});

// Handles getting orders for accounts
app.get("/api/orders/:email", (req, res) =>{
  const users = getUsers();
  const user = users.find(u => u.email === req.params.email);
  if(!user){
    return res.status(404).json({error: "User not found"});
  }
  res.json({orders: user.orders || []});
});

app.get("/api/orders", (req, res) =>{
  const users = getUsers();
  let allOrders = [];

  users.forEach(user => {
    (user.orders || []).forEach(order => {
      allOrders.push({
        ...order,
        email: user.email
      });
    });
  });
  allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({orders: allOrders});
});

// Handles getting sales data from orders
app.get("/api/sales/trend", (req, res) =>{
  const users = getUsers();

  const orders = users.flatMap(user => 
    (user.orders || []).map(order => ({date: order.date, total: order.total}))
  );

  const dailySales = {};

  orders.forEach(order => {
    const day = order.date.split("T")[0];
    dailySales[day] = (dailySales[day] || 0) + order.total;
  });
  const result = Object.entries(dailySales).map(([date, total]) => ({date, total}));

  res.json(result);
});

// Handles getting sales data from ordered product types 
app.get("/api/sales/products", (req, res) =>{
  const users = getUsers();
  const productSales = {};

  users.forEach(user => {
    (user.orders || []).forEach(order => {
      order.items.forEach(item => {
        const category = item.category;

        if(!productSales[category]){
          productSales[category] = 0;
        }
        productSales[category] += item.price * item.quantity;
      });
    });
  });
  const result = Object.entries(productSales).map(([category, total]) => ({category, total}));

  res.json(result);
});

// Handles getting sales data from ordered product gender
app.get("/api/sales/gender", (req, res) =>{
  const users = getUsers();
  const genderSales = {};

  users.forEach(user => {
    (user.orders || []).forEach(order => {
      order.items.forEach(item => {
        const gender = item.gender;
        if(!genderSales[gender]){
          genderSales[gender] = 0;
        }
        genderSales[gender] += item.quantity;
      });
    });
  });
  const result = Object.entries(genderSales).map(([gender, count]) =>({gender, count}));

  res.json(result);
});

// Handles adding, saving, and removing ratings
app.post("/api/products/:id/rate", (req, res) => {
  const {email, rating} = req.body;
  const products = getProducts();
  const product = products.find(p => p.id == req.params.id);

  if(!product){
    return res.status(404).json({error: "Product not found"});
  }

  if(!product.ratings){
    product.ratings = {totalRating: 0, count: 0, users: {}};
  }

  const newRating = Number(rating);
  const pastRating = product.ratings.users[email];

  if(newRating === 0){
    if(pastRating !== undefined){
      product.ratings.totalRating -= pastRating;
      product.ratings.count -= 1;
      delete product.ratings.users[email];
    }
  }
  else{
    if(pastRating !== undefined){
      product.ratings.totalRating -= pastRating;
    }else{
      product.ratings.count += 1;
    }

    product.ratings.totalRating += newRating;
    product.ratings.users[email] = newRating;
  }

  fs.writeFileSync(
    path.join(__dirname, "json", "products.json"),
    JSON.stringify(products, null, 2)
  );

  res.json({ success: true, ratings: product.ratings });
});

// For faavourites
app.post("/api/favourites/update", (req, res) =>{
  const {email, favourites} = req.body;
  let users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if(userIndex === -1){
    return res.status(404).json({error: "User not found"});
  }
  
  users[userIndex].favourites = favourites;
  addUsers(users);
  res.json({success: true, favourites});
});

app.use((req, res) =>{
  res.sendFile(path.join(__dirname, "public", "pages", "homepage.html"));
});

app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
  open(`http://localhost:${app.get('port')}/pages/homepage.html`);
});