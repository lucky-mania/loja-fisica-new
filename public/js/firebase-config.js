// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    // Substitua os valores abaixo com as credenciais do seu projeto Firebase:
    // Você pode encontrar essas credenciais no console do Firebase:
    // 1. Vá para https://console.firebase.google.com/
    // 2. Selecione seu projeto
    // 3. Clique no ícone de configurações (⚙️)
    // 4. Na seção "Seus aplicativos", clique no ícone da web (</>)
    // 5. Copie as credenciais mostradas abaixo
    apiKey: "AIzaSyBDgeqQr5N7X4JcFfazYUjqk9T2q2FgYns",
    authDomain: "loja-fisica-cc28f.firebaseapp.com",
    databaseURL: "https://loja-fisica-cc28f-default-rtdb.firebaseio.com",
    projectId: "loja-fisica-cc28f",
    storageBucket: "loja-fisica-cc28f.firebasestorage.app",
    messagingSenderId: "967928135176",
    appId: "1:967928135176:web:ea6779e3833235f4521bbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

export { db, auth }; 