import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8",
  authDomain: "lasu-navigator.firebaseapp.com",
  projectId: "lasu-navigator",
  storageBucket: "lasu-navigator.firebasestorage.app",
  messagingSenderId: "128402428847",
  appId: "1:128402428847:web:eeee2966c791121829155a",
  measurementId: "G-J0R6H1LBK4"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = typeof window !== "undefined" && "serviceWorker" in navigator ? getMessaging(app) : null;

let firebaseReady = false;
let firebaseUID = null;

function populateProfileFields(data = {}) {
  const fullNameInput = document.querySelector('[name="fullName"], #fullName, input[placeholder*="Full Name"]');
  const matricInput = document.querySelector('[name="matric"], #matric, input[placeholder*="Matric"]');
  if (fullNameInput) fullNameInput.value = data.fullName || "";
  if (matricInput) matricInput.value = data.matric || "";
}

async function ensureAnonymousUser() {
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Firebase anonymous sign-in failed", error);
    return null;
  }
}

async function loadProfileFromFirestore(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "students", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  populateProfileFields(data);
  localStorage.setItem("lasu_profile", JSON.stringify(data));
  console.log("✅ Profile loaded from Firestore");
  return data;
}

async function enableNotifications() {
  if (!("Notification" in window) || !messaging) return false;

  if (Notification.permission === "denied") return false;
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;
  }

  try {
    await navigator.serviceWorker.ready;
    const vapidKey = window.__FIREBASE_VAPID_KEY || "";
    const token = await getToken(messaging, vapidKey ? { vapidKey } : undefined);
    if (token && firebaseUID) {
      await setDoc(doc(db, "students", firebaseUID), {
        notificationToken: token,
        notificationsEnabled: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      localStorage.setItem("lasu_fcm_token", token);
    }
    window.__firebaseNotificationsEnabled = true;
    return true;
  } catch (error) {
    console.warn("Firebase messaging setup failed", error);
    return false;
  }
}

if (messaging) {
  onMessage(messaging, (payload) => {
    const title = payload?.notification?.title || "LASU Navigator";
    const body = payload?.notification?.body || "You have a new campus update.";
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icons/icon-192.png" });
    }
  });
}

onAuthStateChanged(auth, async (user) => {
  firebaseUID = user?.uid || null;
  window.__firebaseUID = firebaseUID;
  if (!user) {
    firebaseReady = false;
    return;
  }
  firebaseReady = true;
  await loadProfileFromFirestore(user.uid);
  await enableNotifications();
});

window.saveProfileToFirebase = async (profileData) => {
  const user = auth.currentUser || await ensureAnonymousUser();
  if (!user) return false;
  const uid = user.uid;
  window.__firebaseUID = uid;
  firebaseUID = uid;
  await setDoc(doc(db, "students", uid), {
    ...profileData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log("✅ Profile saved to Firestore");
  return true;
};

window.requestFirebaseNotifications = enableNotifications;
window.__firebaseDB = db;
window.__firebaseModule = { doc, setDoc, getDoc };
window.__firebaseNotificationsEnabled = false;

ensureAnonymousUser().catch(console.error);
