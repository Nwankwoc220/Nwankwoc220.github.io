importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8',
  authDomain: 'lasu-navigator.firebaseapp.com',
  projectId: 'lasu-navigator',
  storageBucket: 'lasu-navigator.firebasestorage.app',
  messagingSenderId: '128402428847',
  appId: '1:128402428847:web:eeee2966c791121829155a',
  measurementId: 'G-J0R6H1LBK4'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'LASU Navigator';
  const body = payload?.notification?.body || 'You have a new campus update.';
  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload?.data || {}
  };

  return self.registration.showNotification(title, options);
});
