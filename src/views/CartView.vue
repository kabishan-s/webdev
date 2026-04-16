<script>
export default {
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      user: user,
      cart: user.cart || []
    }
  },

  computed:{
    subtotal(){
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    tax(){
      return this.subtotal * 0.13;
    },
    total(){
      return this.subtotal + this.tax;
    }
  },

  methods:{
    async changeQuantity(index, amount){
      const newQuantity = this.cart[index].quantity + amount;
      if(newQuantity <= 0){
        this.cart.splice(index, 1);
      }else{
        this.cart[index].quantity = newQuantity;
      }
      
      this.user.cart = this.cart;
      localStorage.setItem("user", JSON.stringify(this.user));
      
      await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.user.email, cart: this.cart })
      });
    }
  }
}
</script>

<template>
  <head>
    <title>Products</title>
  </head>

  <body>
    <div id="app">
        <h1 class="cart-title">Cart</h1>
        <div class="cart">

          <div class="cart-items">
            <div v-for="(item, index) in cart" :key="index" class="cart-item">
              <img :src="item.image">
              <div class="item-info">
                <div class="item-header">
                  <div class="item-name">{{item.name}}</div>
                  <div class="item-price">${{(item.price * item.quantity).toFixed(2)}}</div>
                </div>
                <div>{{item.description }}</div>
                <div>Size: {{item.size}}</div>
                <div class="quantity">
                  <button @click="changeQuantity(index, -1)">-</button>
                  <span>{{item.quantity}}</span>
                  <button @click="changeQuantity(index, 1)">+</button>
                </div>
              </div>
            </div>
          </div>

          <div class="summary">
            <h2>Summary</h2>
            <p>Subtotal: ${{subtotal.toFixed(2)}}</p>
            <p>Estimated Tax (13%): ${{tax.toFixed(2)}}</p>
            <p class="total">Total: ${{total.toFixed(2)}}</p>
            <RouterLink to="/checkout" class="checkout">Checkout</RouterLink>
            <!-- <button class="checkout" onclick="window.location.href='checkout.html'">Checkout</button> -->
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

.cart-title{
    margin-bottom: 20px;
    padding-top: 20px;
    padding-left: 20px;
}

.cart{
    display: flex;
    gap: 40px;
    padding-left: 20px;
}

.cart-items{
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item{
    display: flex;
    gap: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
}

.cart-item img{
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.item-info{
    flex: 1;
}

.item-header{
    display: flex;
    justify-content: space-between;
}

.item-name{
    font-weight: bold;
}

.item-price{
    font-weight: bold;
}

.quantity{
    display: flex;
    align-items: center;
    margin-top: 5px;
    gap: 10px;
}

.quantity RouterLink{
    height: 25px;
    width: 25px;
    cursor: pointer;
}

.summary{
    flex: 1;
    height: fit-content;
    padding: 20px;
    margin-right: 20px;
    border: 1px solid #c5c5c5;
}

.total{
    font-weight: bold;
    margin-top: 10px;
}

.checkout{
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background: black;
    color: white;
    border: none;
    cursor: pointer;
}
</style>