<template>
  <div class="profile-page container-fluid text-light py-5" style="background-color: #010922;">


    <div class="row justify-content-center">
      <div class="col-md-10">
        <h1>PROFILE {{ userName }}</h1>
        <div class="profile-card">
          <div class="form-group">
            <label>Email:</label>
            <p>{{ profile.email }}</p>
          </div>
          <div class="form-group">
            <label>Gender:</label>
            <p>{{ profile.gender }}</p>
          </div>
          <div class="form-group">
            <label>Relationship Status:</label>
            <p>{{ profile.relationshipStatus }}</p>
          </div>
          <div class="form-group">
            <label>Music Preferences:</label>
            <p>{{ profile.musicTypes.join(', ') }}</p>
          </div>
          <router-link to="/survey" class="btn btn-warning">Edit</router-link>
        </div>
        <div>
          <router-link class="nav-link" to="/history">Your History</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        email: '',
        gender: '',
        relationshipStatus: '',
        musicTypes: []
      },
      userName: localStorage.getItem('userName'),
      isLoggedIn: !!localStorage.getItem('token')
    };
  },
  async created() {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      console.error('No token found');
      return;
    } //call the current user profile by using token and it will display their status
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log('Profile Data:', data);
    this.profile = data.profile;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
,
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-page h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
}

.profile-card {
  background-color: #33383A;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-warning {
  background-color: #FCE663;
  border: none;
  color: #000;
}
</style>
