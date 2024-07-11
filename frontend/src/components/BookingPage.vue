<template>
  <div class="booking-page container-fluid text-light py-5" style="background-color: #010922;">
    <div class="container mt-5">
      <h2 class="text-center">CONFIRM BOOKING</h2>
      <div class="card bg-dark text-light p-4">
        <div class="row">
          <div class="col-md-4">
            <img :src="event.image" alt="Event Image" class="img-fluid">
          </div>
          <div class="col-md-8">
            <h3>CLUB: {{ event.name }}</h3>
            <p>MATCH: {{ event.match }}%</p>
            <p>DATE: {{ event.date }}</p>
            <p>STATUS: <span :class="event.status === 'AVAILABLE' ? 'text-success' : 'text-danger'">{{ event.status }}</span></p>
          </div>
        </div>
        <form @submit.prevent="confirmBooking" class="mt-4">
          <div class="mb-3">
            <label for="bookingName" class="form-label">BOOKING NAME:</label>
            <input type="text" class="form-control" id="bookingName" v-model="bookingName" required>
          </div>
          <div class="mb-3">
            <label for="amount" class="form-label">AMOUNT:</label>
            <input type="number" class="form-control" id="amount" v-model="amount" required>
          </div>
          <div class="mb-3">
            <label for="specialRequest" class="form-label">SPECIAL REQUEST:</label>
            <textarea class="form-control" id="specialRequest" v-model="specialRequest"></textarea>
          </div>
          <div class="mb-3">
            <label for="paymentMethod" class="form-label">PAYMENT METHOD:</label>
            <select class="form-select" id="paymentMethod" v-model="paymentMethod">
              <option value="QR PROMPTPAY">QR PROMPTPAY</option>
              <img src="https://i.postimg.cc/tTm4qLC3/IMG-1429.jpg"  alt="QR" />
            </select>
          </div>
          <button type="submit" class="btn btn-primary">CONFIRM</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { // these are data in booking schema
    return {
      event: null,
      bookingName: '',
      amount: 1,
      specialRequest: '',
      paymentMethod: 'QR PROMPTPAY'
    };          
  },
  async created() {
    await this.fetchEventDetails();
  },
  methods: {
    async fetchEventDetails() {    //display the event detail of each event using eventId
      const eventId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        this.event = await response.json();
      } catch (error) {
        console.error('Error fetching event details:', error);
        alert('Failed to load event details. Please try again.');
      }
    },
    async confirmBooking() {  //this function is to post book to the database
      try {
        const response = await fetch('http://localhost:3000/book', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            eventId: this.event._id,  
            amount: this.amount,
            specialRequest: this.specialRequest
          })
        });

        if (!response.ok) {
          throw new Error('Failed to confirm booking');
        }

        alert('Booking confirmed!');
        this.$router.push('/events');
      } catch (error) {
        console.error('Error during booking:', error);
        alert(error.message);
      }
    },
    logout() { // remove token from local storage so user can logout
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
.booking-page {
  background-color: #010922;
}
</style>
