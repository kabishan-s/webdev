<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link href="https://fonts.googleapis.com/css2?family=Petit+Formal+Script&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Luxurious+Roman&family=Pinyon+Script&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Luxurious+Roman&family=Pinyon+Script&display=swap" rel="stylesheet">

    <title>Clothing Store</title>

    <link rel="stylesheet" href="../css/homepage.css" />

    <script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
    
  </head>

  <body>
    <div class="navbar">
        <div class="logo">
          <RouterLink to="/"><img src="../public/logo/logo.png"></RouterLink>
        </div>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/products">Products</RouterLink>
          <RouterLink to="/">Contact</RouterLink>
          <RouterLink to="/account">Account</RouterLink>
          <RouterLink to="/cart">Cart</RouterLink>
        </nav>
    </div>
    <RouterView />
  </body>
</template>

<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body{
    display: flex;
    flex-direction: column;
    background: rgb(209, 208, 238);
    color: rgb(0, 0, 0);
    min-height: 100vh;
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

nav a{
  display: inline-block;
  margin-right: 25px;
  text-decoration: none;
}

.logo img{
    height: 45px;
    width: auto;
    margin-left: 10px;
    cursor: pointer;
}
</style>