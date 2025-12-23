import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCp0PdBk9mEa_0kVQXQi_dVx5Aq5QqIVwY",
    authDomain: "eyeq-web.firebaseapp.com",
    projectId: "eyeq-web",
    storageBucket: "eyeq-web.firebasestorage.app",
    messagingSenderId: "462274604850",
    appId: "1:462274604850:web:6bcbfbaf2bb7976ba9712b",
    measurementId: "G-KKPSG916YR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
