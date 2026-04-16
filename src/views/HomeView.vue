<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <body>
    <div class="home">
      <div class="title">
        <h1>LUXURY APPAREL</h1>
        <p>clothing made for luxury</p>
        <a href="products.html" class="button">Start Shopping</a>
      </div>
      <div class="hero">
        <img src="../../public/logo/logo.png">
      </div>
    </div>

    <!-- Catalog -->
    <div class="category-banner">
      <img src="../../public/photos/menbanner.png">
      <div class="banner-caption">
        <h2>MEN'S COLLECTION</h2>
      </div>
    </div>
    <div class="apparel">
      <h2 class="section">Shop For Men</h2>
      <div class="mens">
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/menshirt.png">
          <p class="category-name">Shirts</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/menjacket.png">
          <p class="category-name">Jackets</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/menpants.png">
          <p class="category-name">Pants</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/menshoes.png">
          <p class="category-name">Shoes</p>
        </RouterLink>
      </div>
    </div>

    <div class="category-banner">
      <img src="../../public/photos/womenbanner.png">
      <div class="banner-caption">
        <h2>WOMEN'S COLLECTION</h2>
      </div>
    </div>
    <div class="apparel">
      <h2 class="section">Shop For Women</h2>
      <div class="mens">
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/womenshirt.png">
          <p class="category-name">Shirts</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/womenjacket.png">
          <p class="category-name">Jackets</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/womenpants.png">
          <p class="category-name">Pants</p>
        </RouterLink>
        <RouterLink to="/products" class="category">
          <img src="../../public/photos/womenshoes.png">
          <p class="category-name">Shoes</p>
        </RouterLink>
      </div>
    </div>

  </body>
</template>

<style scoped>

.home{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 40px 20px;
}

.title{
    flex: 1 1 45%;
    text-align: left;
    max-width: 600px;
}


.title h1{
    font-size: 3.5rem;
    font-weight: 500;
}


.title p{
    font-size: 1.2rem;
    color: rgb(55, 55, 55);
}

.button{
    display: inline-block;
    background: linear-gradient(120deg, rgb(34, 72, 104), rgb(163, 179, 233));
    font-weight: 500;
    color: white;
    border-radius: 40px;
    padding: 8px 14px;
    margin-top: 10px;
    box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.5);
    text-decoration: none;

}

.button:hover{
    background: linear-gradient(120deg, rgb(49, 109, 159), rgb(163, 179, 233));

}


.hero{
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 350px;
    width: 100%;
}

.hero img{
    max-width: 100%;
    width: 100%;
    height: auto;
    box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.5);

    /* padding: 50px 0; */
}

.section{
    text-align: center;
    margin: 20px 0 0px 0;
}


.category-banner{
    width: 100%;
    min-height: 400px;
    height: auto;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    overflow: hidden;
}


.category-banner img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: absolute;
}

.banner-caption{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
}
/* 
.banner-text h2{
    font-size: ;
} */

.mens{
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 20px;
    padding: 20px;
}

.category{
    width: 500px;
    text-align: center;
}

.category img{
    width: 100%;
    height: auto;
    border-radius: 10px;
}

.category-name{
    font-weight: 500;
}
</style>