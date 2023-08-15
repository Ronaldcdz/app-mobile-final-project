import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM63TKFJdy0ofLhspUiw8FcjtLwhq96yk",
  authDomain: "nuxt3-firebase-practice.firebaseapp.com",
  databaseURL: "https://nuxt3-firebase-practice-default-rtdb.firebaseio.com",
  projectId: "nuxt3-firebase-practice",
  storageBucket: "nuxt3-firebase-practice.appspot.com",
  messagingSenderId: "349589638372",
  appId: "1:349589638372:web:fb58e910159fe576f8f0f1",
  
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBYvSljTtIu2xba87kJQum4aLx52Je3gxk",
//   authDomain: "proyecto-final-39c59.firebaseapp.com",
//   projectId: "proyecto-final-39c59",
//   storageBucket: "proyecto-final-39c59.appspot.com",
//   messagingSenderId: "580213740776",
//   appId: "1:580213740776:web:e7c2a5435a98bf255de55d"
// };
// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     databaseURL: process.env.DATABASE_URL,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const databaseInit = () => {
  return db;
}

export const createAccount = async (email, password, name, lastName, phone) => {
  console.log("RESPONSE DE CREATE ACCOUNT");
  console.log(auth);
  console.log(email);
  console.log(password);

  const response = await createUserWithEmailAndPassword(auth, email, password);
  console.log("RESPONSE DE CREATE ACCOUNT");
  console.log(response);

  if (response) {
    const setUserResponse = await setUserProfile(name, lastName, phone);
    const userData = await getUserProfile();
    return {
      user: response.user,
      userData,
    };
  } else {
    return {
      user: null,
      userData: null,
    };
  }
};

export const signIn = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  console.log(response);
  return response;
};

export const fbSignOut = async () => {
  await signOut(auth);
  return true;
};

export const authStateListener = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  });
};

// guardar el usuario en una coleccion para obtener los datos de el
export const setUserProfile = async (name, lastName, phone) => {
  try {
    const user = auth.currentUser;
    console.log("AUTH.CURRENT USER");
    console.log(user);

    const usuariosRef = doc(db, "Usuarios", user?.uid);
    await setDoc(usuariosRef, {
      name,
      lastName,
      phone,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUserProfile = async () => {
  const user = auth.currentUser;
  console.log(user);

  const usuarioRef = doc(db, "Usuarios", user?.uid);
  const usuarioDoc = await getDoc(usuarioRef);

  if (usuarioDoc.exists()) {
    console.log(
      "Datos del usuario traido desde el collection: ",
      usuarioDoc.data()
    );

    return {
      ...usuarioDoc.data(),
      id: user?.uid,
    };
  } else {
    return null;
  }
};
