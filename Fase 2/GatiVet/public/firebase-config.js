// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQ9fDRM4j4kXcY63hOvIgZ8HSdaic8bcA",
    authDomain: "gativet-c2b07.firebaseapp.com",
    databaseURL: "https://gativet-c2b07-default-rtdb.firebaseio.com",
    projectId: "gativet-c2b07",
    storageBucket: "gativet-c2b07.appspot.com",
    messagingSenderId: "743290238138",
    appId: "1:743290238138:web:575ea8cfb2c8a95d7e7e83",
    measurementId: "G-TP2Z4Q465K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
