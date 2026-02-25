import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsKyJ92t0qMtS_RSfFt7UatRWkBdqCR8A",
  authDomain: "skillswap-universe.firebaseapp.com",
  projectId: "skillswap-universe",
  storageBucket: "skillswap-universe.firebasestorage.app",
  messagingSenderId: "544688904804",
  appId: "1:544688904804:web:405959b48db1b866fc5d71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
