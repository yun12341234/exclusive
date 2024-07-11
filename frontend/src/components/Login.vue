<template>
  <div class="login-page container-fluid text-light py-5" style="background-color: #010922;">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-lg" style="background-color: #7AE0E6;">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() { //login function 
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', this.email.split('@')[0]); // Store username
        localStorage.setItem('surveyCompleted', data.surveyCompleted); // Store survey status
        if (data.surveyCompleted) {
          this.$router.push('/events'); // Redirect to the events page if the survey is completed
        } else {
          this.$router.push('/survey'); // Redirect to the survey page if the survey is not completed
        }
      } catch (error) {
        console.error('Error during login:', error.message);
      }
    }
  }
};
</script>

<style scoped>
.login-page h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
}
</style>
