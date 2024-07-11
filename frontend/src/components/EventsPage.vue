<template>
    <div class="events-page container-fluid text-light py-5" style="background-color: #010922;">
     
      <div class="row justify-content-center">
        <div class="col-md-10">
          <h1>YOU HAVE {{ events.length }} AVAILABLE MATCHES {{ userName }}</h1>
          <div v-for="event in events" :key="event._id" class="event-card">
            <img :src="event.image" alt="Event Image" class="event-image">
            <div class="event-details">
              <p>CLUB: {{ event.name }}</p>
              <p>MATCH: {{ event.match }}%</p>
               <p>STATUS: {{ event.status }}</p>
              <router-link :to="{ name: 'booking', params: { id: event._id } }" class="btn btn-outline-warning">Book</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventsPage',
    data() {
      return {
        events: [],
        userName: localStorage.getItem('userName'),
        isLoggedIn: !!localStorage.getItem('token')
      };
    }, 
    async created() {  
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        this.events = await response.json();
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
    methods: {
      async deleteEvent(eventId) {
        try {
          const response = await fetch(`http://localhost:3000/events/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to delete event');
          }
          this.events = this.events.filter(event => event._id !== eventId);
        } catch (error) {
          console.error('Error deleting event:', error.message);
        }
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .events-page h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .event-card {
    background-color: #33383A;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .event-image {
    width: 100px;
    height: 100px;
  }
  
  .event-details {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
  }
  
  .event-details p {
    margin: 5px 0;
  }
  </style>
  