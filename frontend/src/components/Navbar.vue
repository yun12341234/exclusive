<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">EXCLUSIVE</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events">Events</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button class="btn btn-danger" @click="logout">Logout</button>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/profile">
              <i class="fas fa-user"></i> {{ userName }}
            </router-link>
          </li>
          <li class="nav-item" v-else>
            <router-link class="nav-link" to="/signup">Sign-up</router-link>
          </li>
          <li class="nav-item" v-else>
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      token: localStorage.getItem('token'),
      userName: localStorage.getItem('userName') || 'User'
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.token;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.token = null;
      this.userName = 'User';
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.btn-danger {
  margin-left: 10px;
}

.nav-link {
  color: white;
  font-weight: bold;
}
</style>
