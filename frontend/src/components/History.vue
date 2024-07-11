<template>
  <div class="container-fluid bg-dark text-light py-4">
    <h2 class="text-center mb-4">Booking History</h2>
    <div v-if="history.length === 0" class="alert alert-info">No booking history found.</div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="booking in history" :key="booking._id" class="col">
        <div class="card bg-secondary text-light h-100">
          <img :src="booking.event?.image || 'path/to/default/image.jpg'" class="card-img-top" alt="Event Image">
          <div class="card-body">
            <h5 class="card-title">{{ booking.event?.name || 'Unknown Event' }}</h5>
            <p class="card-text">Booking Date: {{ new Date(booking.date).toLocaleString() }}</p>
            <p class="card-text">Amount: {{ booking.amount }}</p>
            <p class="card-text">Status: 
              <span :class="{'badge bg-success': booking.event?.status === 'AVAILABLE',
                             'badge bg-danger': booking.event?.status !== 'AVAILABLE'}">
                {{ booking.event?.status || 'Unknown' }}
              </span>
            </p>
          </div>
          <div class="card-footer">
            <button @click="rebook(booking.event?._id)" class="btn btn-primary w-100">Rebook</button>
            <button @click="deleteBooking(booking.eventId)" class="btn btn-danger w-100">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      history: []
    };
  },
  created() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() { //since we don't have booking id we need to passparameter in and search for event detail using user Id which is very incovenient and will return in 3d arrays
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching history with token:', token);
        
        const response = await fetch('http://localhost:3000/calleventhistory', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch history: ${response.status} ${errorText}`);
        }
        
        this.history = await response.json();
        console.log('Received history data:', this.history);
      } catch (error) {
        console.error('Error fetching history:', error);
        alert(error.message);
      }
      
      
    },
    async deleteBooking(eventId) { // cannot implement this function because there are no booking ID and cannot delete eventID due to multiple booking will be deleted not just one 
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/deletebooking/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete booking: ${response.status} ${errorText}`);
        }

        this.history = this.history.filter(booking => booking.eventId !== eventId);
        console.log('Deleted booking:', eventId);
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert(error.message);
      }
    },
    rebook(eventId) {
      this.$router.push(`/booking/${eventId}`);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  },

  computed: {
    userName() {
      return localStorage.getItem('user');
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.03);
}
</style>