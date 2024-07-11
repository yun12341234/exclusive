<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';  //using Navbar 
import Footer from './components/Footer.vue';  //using footer
import auth from './store/auth';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  setup() {
    return {
      auth,
    };
  },
  provide() {
    return {
      auth: this.auth,
    };
  },
};
</script>

<style>
body {
  background-color: #000;
  color: #fff;
}
</style>
