async function loadProduct() {
    const load = await fetch("../json/products.json");
    const products = await load.json();

    const parameters = new URLSearchParams(window.location.search);
    const id = parameters.get("id");

    const product = products.find(p => p.id == id);

    if(!product){
        return;
    }

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-price").textContent = "$" + product.price;
    document.getElementById("product-desc").textContent = product.description;

    const mainImg = document.getElementById("product-image");
    const images = product.images || [product.image];
    mainImg.src = images[0];

    const imagesColumn = document.getElementById("images-column");
    images.forEach(img =>{
        const image = document.createElement("img");
        image.src = img;
        
        image.addEventListener("click", () =>{
            mainImg.src = img;

            document.querySelectorAll(".images-column img").forEach(img =>{
                img.classList.remove("active");
            });
            image.classList.add("active");
        });
        imagesColumn.appendChild(image);
    });

    const sizes = document.getElementById("sizes");
    let selectedSize = null;

    if(product.sizes){
        product.sizes.forEach(size =>{
            const div = document.createElement("div");
            div.textContent = size;
            div.classList.add("size-option");
            
            div.addEventListener("click", () =>{
                document.querySelectorAll(".size-option").forEach(selected =>{
                    selected.classList.remove("selected");
                });
                div.classList.add("selected");
                selectedSize = size;
            });
            sizes.appendChild(div);
        });
    }

    document.querySelector(".add-to-cart").addEventListener("click", () =>{

        if(!selectedSize){
            alert("Please select a size");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const inCart = cart.find(item => item.id == product.id && item.size === selectedSize);

        if(inCart){
            inCart.quantity += 1;
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
        alert("Added to cart!");

    });


}

loadProduct();