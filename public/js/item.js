async function loadProduct(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

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

  images.forEach(img =>{
    const image = document.createElement("img");
    image.src = img;

    image.addEventListener("click", () =>{
      mainImg.src = img;
    });
    imagesColumn.appendChild(image);
  });

  let selectedSize = null;
  const sizes = document.getElementById("sizes");
  sizes.innerHTML = "";

  if(product.sizes){
    product.sizes.forEach(size =>{
      const div = document.createElement("div");
      div.textContent = size;
      div.classList.add("size-option");
      div.onclick = () =>{
        document.querySelectorAll(".size-option").forEach(s => s.classList.remove("selected"));
        div.classList.add("selected");
        selectedSize = size;
      };
      sizes.appendChild(div);
    });
  }

  document.querySelector(".add-to-cart").onclick = () =>{
    if(!selectedSize){
      return alert("Select size first");
    }
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };
}

loadProduct();