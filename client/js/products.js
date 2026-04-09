async function loadProducts(){
    const load = await fetch("../json/products.json");
    const products = await load.json();

    const parameters = new URLSearchParams(window.location.search);
    const gender = parameters.get("gender");
    const category = parameters.get("category");
    const price = parameters.get("price");

    let filteredProducts = [];
    for(let product of products){
        if(gender && product.gender !== gender){
            continue;
        }
        if(category && product.category != category){
            continue;
        }
        
        if(price){
            if(price === "0-150" && product.price > 150){
                continue;
            }
            if(price === "150-200" && (product.price < 150 || product.price > 200)){
                continue;
            }
            if(price === "200-300" && (product.price < 200 || product.price > 300)){
                continue;
            }
            if(price === "300+" && product.price < 300){
                continue;
            }
        }


        filteredProducts.push(product);
    }
    
    const filterText = document.getElementById("filter");
    let text = "Showing: "
    if(gender){
        text += gender;
    }else{
        text += "All";
    }
    if(category){
        text += " " + category;
    }
    if(price){
        text += ", $" + price;
    }

    filterText.textContent = text;

    const productContainer = document.getElementById("products-list");
    filteredProducts.forEach(product =>{
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <a href="item.html?id=${product.id}" class="product-link">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </a>
        `;
        productContainer.append(div);        
    });
}

loadProducts();


let selectedFilters = {};

document.querySelectorAll(".filter-title").forEach(title =>{
    title.addEventListener("click", () => {
        const options = title.nextElementSibling;
        options.style.display = options.style.display === "block" ? "none" : "block";
    });
});

document.querySelectorAll(".filter-options div").forEach(option =>{
    option.addEventListener("click", () => {
        const filter = option.dataset.filter;
        const choice = option.dataset.choice;
        selectedFilters[filter] = choice;

        option.parentElement.querySelectorAll("div").forEach(c =>{
            c.style.fontWeight = "normal";
        });
        option.style.fontWeight = "bold";
    });
});


document.getElementById("apply").addEventListener("click", () =>{
    const parameters = new URLSearchParams();
    for(let key in selectedFilters){
        if(selectedFilters[key]){
            parameters.set(key, selectedFilters[key]);
        }
    }
    window.location.search = parameters.toString();
});

function displaySelectedFilters(){
    const parameters = new URLSearchParams(window.location.search);
    document.querySelectorAll(".filter-group").forEach(group =>{
        const options = group.querySelector(".filter-options");
        let hasActive = false;
        
        group.querySelectorAll(".filter-options div").forEach(option =>{
            const filter = option.dataset.filter;
            const choice = option.dataset.choice;

            if(parameters.get(filter) === choice){
                option.style.fontWeight = "bold";
                selectedFilters[filter] = choice;
                hasActive = true;
            }else{
                option.style.fontWeight = "normal";
            }
        });
        if(hasActive){
            options.style.display = "block";
        }
    });
}

displaySelectedFilters()