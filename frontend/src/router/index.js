import { createRouter, createWebHistory } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import Survey from '../components/Survey.vue';
import AboutPage from '../components/AboutPage.vue';
import EventsPage from '../components/EventsPage.vue';
import BookingPage from '../components/BookingPage.vue';
import HistoryPage from '../components/History.vue';
import ProfilePage from '../components/Profile.vue';

const routes = [
  { path: '/', component: MainContent },
  { path: '/about', component: AboutPage },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/survey', component: Survey },
  { path: '/events', component: EventsPage, meta: { requiresAuth: true } },  
  { path: '/booking/:id', name: 'booking', component: BookingPage , meta: { requiresAuth: true }},
  { path: '/history', component: HistoryPage, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
