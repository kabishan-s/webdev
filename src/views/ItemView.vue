<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const id = route.params.id
console.log(id)

async function loadProduct() {
  // const params = new URLSearchParams(window.location.search);
  // const id = params.get("id");
  

  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-price").textContent = "$" + product.price;
  document.getElementById("product-desc").textContent = product.description;

  const mainImg = document.getElementById("product-image");
  const images = product.images || [product.image];
  mainImg.src = images[0];
  const imagesColumn = document.getElementById("images-column");
  imagesColumn.innerHTML = "";

  images.forEach(img => {
    const image = document.createElement("img");
    image.src = img;

    image.addEventListener("click", () => {
      mainImg.src = img;
    });
    imagesColumn.appendChild(image);
  });

  let selectedSize = null;
  const sizes = document.getElementById("sizes");
  sizes.innerHTML = "";

  if (product.sizes) {
    product.sizes.forEach(size => {
      const div = document.createElement("div");
      div.textContent = size;
      div.classList.add("size-option");
      div.onclick = () => {
        document.querySelectorAll(".size-option").forEach(s => s.classList.remove("selected"));
        div.classList.add("selected");
        selectedSize = size;
      };
      sizes.appendChild(div);
    });
  }

  async function upadteWithServer(email, cart){
    const response = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, cart})
    });
    return response.json();
  }

  document.querySelector(".add-to-cart").onclick = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      alert("Sign-in before adding items to cart.");
      window.location.href = "account.html";
      return;
    }

    if(!selectedSize){
      return alert("Select a size first.");
    }

    let cart = user.cart || [];
    const inCart = cart.find(i => i.id == product.id && i.size === selectedSize);

    if(inCart){
      inCart.quantity++;
    }else{
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        size: selectedSize,
        quantity: 1
      });
    }
    user.cart = cart;
    localStorage.setItem("user", JSON.stringify(user));
    await upadteWithServer(user.email, cart);
    alert("Added to cart");
  };
}

onMounted(() => {
console.log(id)
  loadProduct();
})
</script>

<template>
  <head>
    <title>Products</title>
  </head>

  <body>
    <div class="product-page">
      <div class="images-column" id="images-column"></div>

      <div class="product-image">
        <img id="product-image">
      </div>

      <div class="product-info">
        <h1 id="product-name"></h1>
        <p id="product-price" class="price"></p>
        <div class="sizes" id="sizes"></div>
        <button class="add-to-cart">Add To Cart</button>
        <p id="product-desc" class="desc"></p>
      </div>

    </div>
  </body>
</template>

<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body{
    display: flex;
    flex-direction: column;
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


.logo img{
    height: 45px;
    width: auto;
    margin-left: 10px;
    cursor: pointer;
}

.product-page{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 50px;
    padding: 50px;
}


.product-image img{
    width: 500px;
    max-width: 100%;
}

.images-column{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.images-column img{
    object-fit: cover;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 2px solid transparent;
    cursor: pointer;
}

.images-column img:hover {
    border: 2px solid black;
}

.images-column img.active{
    border: 2px solid black;
}

.product-info{
    max-width: 400px;
}

.sizes{
    display: flex;
    gap: 10px;
    margin: 15px 0;
}

.size-option{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    border: 2px solid black;
    cursor: pointer;
}

.size-option:hover{
    background: #eaeaea;
}

.size-option.selected{
    background: black;
    color: white;
}


.add-to-cart{
    display: inline-block;
    background: linear-gradient(120deg, rgb(34, 72, 104), rgb(163, 179, 233));
    font-weight: 500;
    color: white;
    border-radius: 40px;
    padding: 8px 14px;
    margin-top: 10px;
    box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    margin-bottom: 10px;
}


.add-to-cart:hover{
    background: linear-gradient(120deg, rgb(49, 109, 159), rgb(163, 179, 233));

}
</style>