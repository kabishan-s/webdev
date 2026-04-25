let rating = 0;
let currentProduct = null;

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-price").textContent = "$" + product.price;
  document.getElementById("product-desc").textContent = product.description;

  // Product Images
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

  // Sizes
  let selectedSize = null;
  const sizes = document.getElementById("sizes");
  sizes.innerHTML = "";

  if(product.sizes){
    product.sizes.forEach(size => {
      const div = document.createElement("div");
      div.textContent = size;
      div.classList.add("size-option");
      div.onclick = () => {
        document.querySelectorAll(".size-option").forEach(s => s.classList.remove("selected"));
        div.classList.add("selected");
        selectedSize = size;

        let user = JSON.parse(localStorage.getItem("user"));
        if(user) {
          let favourites = user.favourites || [];
          const inFavourites = favourites.find(i => i.id == product.id && i.size === selectedSize);

          if(inFavourites != undefined) {
            favButton = $(".fav");

            favButton.toggleClass("fav");
            favButton.toggleClass("favourited");
          }
          else {
            favButton = $(".favourited");

            favButton.toggleClass("favourited");
            favButton.toggleClass("fav");
          }
        }
      };
      sizes.appendChild(div);
    });
  }

  // Ratings
  const ratings = product.ratings;
  const avgRating = ratings.count ? (ratings.totalRating / ratings.count).toFixed(1) : 0;

  document.getElementById("stars-display").textContent = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));

  document.getElementById("rating-count").textContent = ` (${ratings.count})`;

  document.getElementById("rating-section").onclick = () => {
    rating = 0;
    document.getElementById("rating-modal").classList.add("is-active");
    loadStars();
  };

  document.querySelector(".modal-close").onclick = closeModal;
  document.querySelector(".modal-background").onclick = closeModal;
  document.getElementById("cancel-rating").onclick = closeModal;

  function closeModal() {
    document.getElementById("rating-modal").classList.remove("is-active");
  }

  function loadStars(){
    const container = document.getElementById("star-input");
    container.innerHTML = "";

    for(let i = 1; i <= 5; i++){
      const star = document.createElement("span");
      star.textContent = i <= rating ? "★" : "☆";
      star.onclick = () =>{
        rating = i;
        loadStars();
      };
      container.appendChild(star);
    }
  }
  
  // Saving ratings
  document.getElementById("save-rating").onclick = async () =>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
      alert("Sign-in to leave a rating.");
      return;
    }

    if(!rating){
      alert("Choose a rating.");
      return;
    }

    await fetch(`/api/products/${product.id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        rating: rating
      })
    });

    closeModal();
    loadProduct();
  };

  // Removing ratings
  document.getElementById("remove-rating").onclick = async () =>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
      alert("Sign-in to leave a review.");
      return;
    }

    await fetch(`/api/products/${product.id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        rating: 0
      })
    });

    closeModal();
    loadProduct();
  };

  async function upadteWithServer(email, cart){
    const response = await fetch('/api/cart/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, cart})
    });
    return response.json();
  }

  
  async function updateFavourites(email, favourites){
    const response = await fetch('/api/favourites/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, favourites})
    });
    return response.json();
  }

  $(document).on("click", ".fav", async function() {
    let user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      alert("Sign-in before favouriting items");
      window.location.href = "account.html";
      return;
    }
    if(!selectedSize){
      return alert("Select a size first.");
    }

    let favourites = user.favourites || [];
    const inFavourites = favourites.find(i => i.id == product.id && i.size === selectedSize);

    if(inFavourites === undefined) {
      favourites.push({
      id: product.id,
      name: product.name,
      gender: product.gender,
      category: product.category,
      price: product.price,
      colour: product.colour,
      image: product.image,
      description: product.description,
      size: selectedSize,
      quantity: 1,
      });
    }
    user.favourites = favourites;
    localStorage.setItem("user", JSON.stringify(user));
    await updateFavourites(user.email, favourites);

    $(this).toggleClass("fav");
    $(this).toggleClass("favourited");
  })

  $(document).on("click", ".favourited", async function() {
    let user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      alert("Sign-in before favouriting items");
      window.location.href = "account.html";
      return;
    }
    if(!selectedSize){
      return alert("Select a size first.");
    }

    let favourites = user.favourites || [];
    const indexInFavourites = favourites.findIndex(i => i.id == product.id && i.size === selectedSize);

    favourites.splice(indexInFavourites, 1);

    user.favourites = favourites;
    localStorage.setItem("user", JSON.stringify(user));
    await updateFavourites(user.email, favourites);

    $(this).toggleClass("favourited");
    $(this).toggleClass("fav");
  })

  // Adding to cart
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
        gender: product.gender,
        category: product.category,
        price: product.price,
        colour: product.colour,
        image: product.image,
        description: product.description,
        size: selectedSize,
        quantity: 1,
      });
    }
    user.cart = cart;
    localStorage.setItem("user", JSON.stringify(user));
    await upadteWithServer(user.email, cart);
    alert("Added to cart");
  };
}

loadProduct();