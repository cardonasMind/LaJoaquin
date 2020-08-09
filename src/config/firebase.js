import firebase from "firebase/app";
import firebaseConfig from "./firebaseConfig";

import "firebase/firestore";
import "firebase/auth";
import "firebase/storage"

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;