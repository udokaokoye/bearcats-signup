

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1K_Y6kk7LfczdILNq44T-Ahj0ylZvwhk",
  authDomain: "bearcats-connect.firebaseapp.com",
  projectId: "bearcats-connect",
  storageBucket: "bearcats-connect.appspot.com",
  messagingSenderId: "234344144052",
  appId: "1:234344144052:web:bf67849adfb0b1f0c90be1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)


const db = firebase.firestore();
const auth = firebase.auth()

export {db, auth}