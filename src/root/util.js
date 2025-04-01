
import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const fbConfig ={
  apiKey: "AIzaSyDBu9AN-kYx90i51PGp1gp4rziNXyLrt1Q",
  authDomain: "menulive-4ac00.firebaseapp.com",
  databaseURL: "https://menulive-4ac00-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "menulive-4ac00",
  storageBucket: "menulive-4ac00.firebasestorage.app",
  messagingSenderId: "448344052309",
  appId: "1:448344052309:web:ae0145b857f5a7af5e7adc"
};

const appfb = initializeApp(fbConfig);
 
export const db = getDatabase(appfb)
