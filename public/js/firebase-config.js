// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDgeqQr5N7X4JcFfazYUjqk9T2q2FgYns",
    authDomain: "loja-fisica-cc28f.firebaseapp.com",
    databaseURL: "https://loja-fisica-cc28f-default-rtdb.firebaseio.com",
    projectId: "loja-fisica-cc28f",
    storageBucket: "loja-fisica-cc28f.firebasestorage.app",
    messagingSenderId: "967928135176",
    appId: "1:967928135176:web:ea6779e3833235f4521bbd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Authentication
const auth = firebase.auth();