<!-- Firebase SDK -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

  // 🔴 REPLACE with your Firebase project config
  const firebaseConfig = {
   apiKey: "AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8",
  authDomain: "lasu-navigator.firebaseapp.com",
  projectId: "lasu-navigator",
  storageBucket: "lasu-navigator.firebasestorage.app",
  messagingSenderId: "128402428847",
  appId: "1:128402428847:web:eeee2966c791121829155a",
  measurementId: "G-J0R6H1LBK4"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Auto sign-in anonymously (no login screen needed)
  signInAnonymously(auth).catch(console.error);

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const uid = user.uid;
    window.__firebaseUID = uid;

    // Load profile from Firestore on login
    const snap = await getDoc(doc(db, "students", uid));
    if (snap.exists()) {
      const data = snap.data();
      // Populate form fields
      document.querySelector('[name="fullName"], #fullName, input[placeholder*="Full Name"]')
        && (document.querySelector('[name="fullName"], #fullName, input[placeholder*="Full Name"]').value = data.fullName || '');
      document.querySelector('[name="matric"], #matric, input[placeholder*="Matric"]')
        && (document.querySelector('[name="matric"], #matric, input[placeholder*="Matric"]').value = data.matric || '');
      // Also update localStorage as fallback
      localStorage.setItem('lasuProfile', JSON.stringify(data));
      if (window.saveProfileToFirebase) window.saveProfileToFirebase(data);
      console.log('✅ Profile loaded from Firestore');
    }
  });

  // Save profile to Firestore
  window.saveProfileToFirebase = async (profileData) => {
    const uid = window.__firebaseUID;
    if (!uid) return;
    await setDoc(doc(db, "students", uid), {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Profile saved to Firestore');
  };

  window.__firebaseDB = db;
  window.__firebaseModule = { doc, setDoc, getDoc };
</script>
