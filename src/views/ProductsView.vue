<script>
export default {
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
      return this.products.filter(product =>{
        if(this.filters.gender && product.gender !== this.filters.gender){
            return false;
        }
        if(this.filters.category && product.category !== this.filters.category){
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
      let text = "All";
      if(this.filters.gender){
        text = this.filters.gender;
      }
      if(this.filters.category){
        text += " " + this.filters.category;
      }
      if(this.filters.price){
        text += " - $" + this.filters.price;
      }
      return text;
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
}
</script>

<template>
  <head>
    <title>Products</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>

  <body>
    <div id="app" class="container mt-5">
      <h1 class="has-text-centered mt-2 products-title">Products</h1>
      <p class="has-text-centered">Showing: {{ filterText }}</p>

      <div class="columns mt-4">
        <div class="column is-2">
          <div class="filters">
            <div class="filter-group">
              <div class="filter-title" @click="toggle('genderFilterOpen')">Gender</div>
              <div class="filter-options" v-show="genderFilterOpen">
                <div @click="setFilter('gender','')" :class="{active: filters.gender === ''}">All</div>
                <div @click="setFilter('gender','mens')" :class="{active: filters.gender === 'mens'}">Men</div>
                <div @click="setFilter('gender','womens')" :class="{active: filters.gender === 'womens'}">Women</div>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-title" @click="toggle('categoryFilterOpen')">Category</div>
              <div class="filter-options" v-show="categoryFilterOpen">
                <div @click="setFilter('category','')" :class="{active: filters.category === ''}">All</div>
                <div @click="setFilter('category','shirts')" :class="{active: filters.category === 'shirts'}">Shirts</div>
                <div @click="setFilter('category','jackets')" :class="{active: filters.category === 'jackets'}">Jackets
                </div>
                <div @click="setFilter('category','pants')" :class="{active: filters.category === 'pants'}">Pants</div>
                <div @click="setFilter('category','shoes')" :class="{active: filters.category === 'shoes'}">Shoes</div>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-title" @click="toggle('priceFilterOpen')">Price</div>
              <div class="filter-options" v-show="priceFilterOpen">
                <div @click="setFilter('price','')" :class="{active: filters.price === ''}">All</div>
                <div @click="setFilter('price','0-150')" :class="{active: filters.price === '0-150'}">$0 - $150</div>
                <div @click="setFilter('price','150-200')" :class="{active: filters.price === '150-200'}">$150 - $200
                </div>
                <div @click="setFilter('price','200-300')" :class="{active: filters.price === '200-300'}">$200 - $300
                </div>
                <div @click="setFilter('price','300+')" :class="{active: filters.price === '300+'}">$300+</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-align-self-flex-start">
          <div class="columns is-multiline is-align-items-flex-start">
            <div v-for="p in filteredProducts" :key="p.id" class="column is-one-third">
              <div class="product">
                <RouterLink :to="`/item/${p.id}`">
                  <img :src="p.image">
                  <h5>{{p.name}}</h5>
                  <p>${{p.price}}</p>
                </RouterLink>
                <!-- <a :href="'item.html?id=' + p.id">
                  <img :src="p.image">
                  <h5>{{p.name}}</h5>
                  <p>${{p.price}}</p>
                </a> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </body>
</template>

<style scoped>
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
    padding-top: 12px;
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


.products-title{
    font-weight: bold;
    font-size: 30px;
    text-align: center;
    margin: 20px;
}



.filter{
    text-align: center;
    margin-bottom: 20px;
}

.columns{
    align-items: flex-start !important;
}

.products-list{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    padding: 10px;
}


.product{
    background: white;
    border: 10px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

.product img{
    width: 100%;
    border-radius: 10px;
}


.product h3{
    margin: 10px 0;
}



.price{
    font-weight: bold;
}


.filter-container{
    display: flex;
    align-items: start;
    gap: 10px;
    padding: 10px;
}

.filters{
    position: sticky;
    top: 10px;
    width: 200px;
    min-width: 200px;
    background: #fff7f7;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    margin-top: 10px;
}


.filter-group{
    margin-bottom: 15px;
}


.filter-title{
    font-weight: bold;
    cursor: pointer;
    padding: 5px 0;
    border-bottom: 1px solid #d0cece;
    
}



.filter-options{
    padding-left: 10px;
}



.filter-options div{
    cursor: pointer;
    padding: 4px 0;
    font-weight: normal;
    /* font-size: 15px; */
    /* color: rgb(22, 22, 22); */

}


.filter-options div.active{
    font-weight: bold;
}

</style>