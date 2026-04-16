const { createApp } = Vue

createApp({
  data() {
    return{
      products: [],
      filters: {
        gender: '',
        category: '',
        price: '',
        colour: ''
      },
      genderFilterOpen: false,
      categoryFilterOpen: false,
      priceFilterOpen: false,
      colourFilterOpen: false
    }
  },

  computed:{
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
        return true;
      })
    },
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
    }
  },

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
    if(params.get('price')){
      this.filters.price = params.get('price');
      this.priceFilterOpen = true;
    }
    const load = await fetch('/api/products')
    this.products = await load.json()
  }
}).mount('#app')