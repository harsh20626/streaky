import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxUsWp88RctiDnbErc4WMrk4ZRnXQL9ZA",
  authDomain: "streaky-2a396.firebaseapp.com",
  projectId: "streaky-2a396",
  storageBucket: "streaky-2a396.firebasestorage.app",
  messagingSenderId: "206387684279",
  appId: "1:206387684279:web:4c42c1d8fbee7b18257e32",
  measurementId: "G-2NBCNFKVFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// In development, use the auth emulator to avoid domain restrictions
if (window.location.hostname === "localhost" || 
    window.location.hostname.includes("lovableproject.com")) {
  // This allows testing on localhost and Lovable's preview domains
  auth.useDeviceLanguage();
}

export default app;
