const { createApp } = Vue

createApp({
  data() {
    return{
      products: [],
      filters: {
        gender: '',
        category: '',
        price: ''
      },
      genderFilterOpen: false,
      categoryFilterOpen: false,
      priceFilterOpen: false
    }
  },

  computed:{
    filteredProducts(){
      return this.products.filter(p =>{
        if(this.filters.gender && p.gender !== this.filters.gender){
            return false;
        }
        if(this.filters.category && p.category !== this.filters.category){
            return false;
        }
        if(this.filters.price){
          if(this.filters.price === '0-150'   && p.price > 150){
            return false;
          }
          if(this.filters.price === '150-200' && (p.price < 150 || p.price > 200)){
            return false;
          }
          if(this.filters.price === '200-300' && (p.price < 200 || p.price > 300)){
            return false;
          }
          if(this.filters.price === '300+'    && p.price < 300){
            return false;
          }
        }
        return true;
      })
    },
    filterText(){
      let text = 'All'
      if (this.filters.gender)   text = this.filters.gender
      if (this.filters.category) text += ' ' + this.filters.category
      if (this.filters.price)    text += ' · $' + this.filters.price
      return text
    }
  },

  methods:{
    toggle(section){
      this[section] = !this[section]
    },
    setFilter(type, value){
      this.filters[type] = value
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