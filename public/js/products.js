const { createApp } = Vue

createApp({
  data() {
    return{
      products: [],
      filters: {
        gender: '',
        category: '',
        price: '',
        colour: '',
        rating: '',
        search: '',
        favourite: false
      },
      genderFilterOpen: false,
      categoryFilterOpen: false,
      priceFilterOpen: false,
      colourFilterOpen: false,
      ratingFilterOpen: false,
      favouriteFilterOpen: false
    }
  },

  computed:{
    // Product filter
    filteredProducts(){
      return this.products.filter(product =>{
        if(this.filters.gender && product.gender !== this.filters.gender){
          return false;
        }
        if(this.filters.category && product.category !== this.filters.category){
          return false;
        }
        if(this.filters.colour && product.colour !== this.filters.colour){
            return false;
        }
        if(this.filters.price){
          if(this.filters.price === "0-150" && product.price > 150){
            return false;
          }
          if(this.filters.price === "150-200" && (product.price < 150 || product.price > 200)){
            return false;
          }
          if(this.filters.price === "200-300" && (product.price < 200 || product.price > 300)){
            return false;
          }
          if(this.filters.price === "300+" && product.price < 300){
            return false;
          }
        }
        if(this.filters.rating){
          const avg = product.ratings?.count ? product.ratings.totalRating / product.ratings.count : 0;
          const floor = Math.floor(avg);
          const ceil = Math.ceil(avg);
          const closest = (avg - floor <= ceil - avg) ? floor : ceil;
          if (closest !== this.filters.rating) {
            return false;
          }
        }
        if(!(product.name.toLowerCase().includes(this.filters.search.toLowerCase()))){
          return false;
        }
        if(this.filters.favourite === true && !product.isFavourite){
          return false;
        }
        return true;
      })
    },
      // Product filter display text
    filterText(){
      let text = [];

      if(this.filters.gender){
        if(this.filters.gender === 'mens'){
          text.push('Mens');
        }else{
          text.push('Womens');
        }
      }
      if(this.filters.colour){
        text.push(this.filters.colour.charAt(0).toUpperCase() + this.filters.colour.slice(1));
      }
      if(this.filters.category){
        text.push(this.filters.category.charAt(0).toUpperCase() + this.filters.category.slice(1));
      }
      if(this.filters.price){
        text.push("$" + this.filters.price);
      }
      if(this.filters.rating){
        text.push(`${this.filters.rating}★`);
      }

      if(this.filters.favourite){
        text.push("Favourited");
      }
      if(this.filters.search !== ""){
        text.push(`"${this.filters.search}"`);
      }

      if(text.length){
        return text.join(" - ");
      }else{
        return "All";
      }
    }
  },

  methods:{
    toggle(section){
      this[section] = !this[section];
    },
    setFilter(type, value){
      this.filters[type] = value;
    },
    // For getting and displaying star ratings
    getProductRating(product){
      if(!product.ratings || !product.ratings.count){
        return 0;
      }
      return product.ratings.totalRating / product.ratings.count;
    },
    loadStars(avgStars){
      const fullStars = Math.floor(avgStars);
      const emptyStars = 5 - fullStars;
      return "★".repeat(fullStars) + "☆".repeat(emptyStars);
    }
  },

  // Product filter by URL
  async mounted(){
    const params = new URLSearchParams(window.location.search)
    if(params.get('gender')){
      this.filters.gender = params.get('gender');
      this.genderFilterOpen = true;
    }
    if(params.get('category')){
      this.filters.category = params.get('category');
      this.categoryFilterOpen = true;
    }
    if(params.get('colour')){
      this.filters.colour = params.get('colour');
      this.colourFilterOpen = true;
    }
    if(params.get('price')){
      this.filters.price = params.get('price');
      this.priceFilterOpen = true;
    }
    if(params.get('rating')){
      this.filters.rating = params.get('rating');
      this.ratingFilterOpen = true;
    }
    const load = await fetch('/api/products')
    this.products = await load.json()

    let user = JSON.parse(localStorage.getItem("user"));
    let favourites = user.favourites || [];
    for (let i = 0; i < this.products.length; ++i) {
      const isFavourite = favourites.some(j => j.id == this.products[i].id);
      this.products[i].isFavourite = isFavourite;
    }

  }
}).mount('#app')