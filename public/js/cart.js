const { createApp } = Vue

createApp({
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
}).mount("#app")