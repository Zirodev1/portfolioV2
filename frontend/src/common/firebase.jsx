import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuGmQUbTRu_PsJe9bXX2YL_rjUcpo7rYY",
  authDomain: "writter-9b16d.firebaseapp.com",
  projectId: "writter-9b16d",
  storageBucket: "writter-9b16d.appspot.com",
  messagingSenderId: "1020800232924",
  appId: "1:1020800232924:web:9b1777821c96fc9c1e7319"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });

    return user;
};