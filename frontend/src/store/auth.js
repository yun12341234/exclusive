import { ref } from 'vue';

const token = ref(localStorage.getItem('token'));
const userName = ref(localStorage.getItem('userName') || 'User');

const isLoggedIn = ref(!!token.value);

const setAuth = (newToken, newUserName) => {
  token.value = newToken;
  userName.value = newUserName;
  isLoggedIn.value = !!newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newUserName);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
};

export default {
  token,
  userName,
  isLoggedIn,
  setAuth,
};
