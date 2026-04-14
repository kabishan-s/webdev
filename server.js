import express from "express";
import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

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
  const product = products.find(p => p.id == req.params.id);
  if(!product){
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.get("/api/products/filter", (req, res) =>{
  let products = getProducts();

  const{gender, category, price} = req.query;

  if(gender){
    products = products.filter(p => p.gender === gender);
  }

  if(category){
    products = products.filter(p => p.category === category);
  }

  if(price){
    if(price === "0-150"){
      products = products.filter(p => p.price <= 150);
    }
    if(price === "150-200"){
      products = products.filter(p => p.price >= 150 && p.price <= 200);
    }
    if(price === "200-300"){
      products = products.filter(p => p.price >= 200 && p.price <= 300);
    }
    if(price === "300+"){
      products = products.filter(p => p.price >= 300);
    }
  }
  res.json(products);
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "homepage.html"));
});

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
  open(`http://localhost:${app.get('port')}/pages/homepage.html`);
})