/**
 * @module showTitleScreen 
 * @description This is the main module of the application.
 * <b>The main goal is to build something with a specific height and width.</b>
 *
 * Some list here:
 *  - 1 item example here
 *  - <b>Bold again here</b>
 *  - Some other line
 *
 * @author sushant
 */
// Importing the firebase functions needed from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, linkWithPopup, signOut, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

// Tomath app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCVxEskCjFVcwLq4QFptZKxuRTEsJEtlSU",
  authDomain: "tomath-404215.firebaseapp.com",
  projectId: "tomath-404215",
  storageBucket: "tomath-404215.appspot.com",
  messagingSenderId: "651645390180",
  appId: "1:651645390180:web:e616af808822e72a4b7e71",
  measurementId: "G-WMXP56QQ4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth();

const provider1 = new OAuthProvider('microsoft.com'); 
const auth1 = getAuth();


// Click event for google sign in
document.getElementById('googleSignInBtn').addEventListener('click', signInWithGoogle);

// Signs in google users
function signInWithGoogle(){ 
signInWithPopup(auth, provider)
    .then((result) => {
        // The signed-in user info.
        alert('You are signed in!');
        document.getElementById('menu').style.display = 'none';
        document.getElementById('menu1').style.display = 'block';
})
    .catch((error) => {
    // Handle Errors here.
    console.log(error.code);
        console.log(error.message);
        
    });
}

document.getElementById('microsoftSignInBtn').addEventListener('click', signInWithMicrosoft);

function signInWithMicrosoft(){
signInWithPopup(auth, provider1)
  .then((result) => {
  // Microsoft credential is linked to the current user.
  // IdP data available in result.additionalUserInfo.profile.
  alert('You are signed in!');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('menu1').style.display = 'block';

    // Get the OAuth access token and ID Token
  const credential = OAuthProvider.credentialFromResult(result);
  const accessToken = credential.accessToken;
  const idToken = credential.idToken;
  })
  .catch((error) => {
  // Handle error.
  console.log(error.message);
  
  });
}


document.getElementById('Signin').addEventListener('click', loginUser);

// Logs in registered users
function loginUser() {
const userid = document.getElementById("userid").value;
const userpass = document.getElementById("userpass").value;
signInWithEmailAndPassword(auth, userid, userpass)
    .then((result) => {
        // Signed in 
        alert('You are signed in!');
        document.getElementById('menu').style.display = 'none';
        document.getElementById('menu1').style.display = 'block';
        
        
        // ...
    })
    .catch((error) => {
        alert('Your Email or Password is not valid!');
        console.log(error.code);
        console.log(error.message);
    });
}

document.getElementById('Signout').addEventListener('click', loginOut);

// Logs in registered users
function loginOut() {
signOut(auth).then(() => {
  // Sign-out successful.
  alert('You are signed out!');
  
  document.getElementById('out').style.display = 'block';
}).catch((error) => {
  // An error happened.
  alert('An error occured!');
});
}