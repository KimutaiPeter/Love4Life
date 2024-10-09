import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDYZYKbcgL0t6_pF0Dv9KGAbP8vrH2uV1s",
    authDomain: "t0-python.firebaseapp.com",
    databaseURL: "https://t0-python-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "t0-python",
    storageBucket: "t0-python.appspot.com",
    messagingSenderId: "331595037617",
    appId: "1:331595037617:web:4542292039e1f6c0819b90",
    measurementId: "G-051CTLJ2CV"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db
