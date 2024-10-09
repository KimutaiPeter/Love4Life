import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { ref as sRef } from 'firebase/storage';
import db from "./firebase";

function textToHex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hexString = Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return hexString;
}

function hexToText(hexString) {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i
      * 2, 2), 16);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

function read_data(email) {
  return new Promise((resolve, reject)=>{
    const starCountRef = ref(db, 'live_life/' + textToHex(email));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      resolve(data)
    });
  })
}

function push_new_data() {
  const postListRef = ref(db, 'keeps/');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    id: "Peter",
    greet: "This does be hard"
  })
}

function update_new_user(email, data) {
  set(ref(db, 'live_life/' + textToHex(email)), { "google": data }).then(() => {
    // Success.
    console.log("registration done")
    return true
  }).catch((error) => {
    console.log(error);
  });
}

function update_user_documents(email, data) {
  // set(ref(db, 'live_life/' + textToHex(email)), {"google_drive":data[0],"google_sheet":data[1]}).then(() => {
  //   // Success.
  //   console.log("Updating drive done")
  //   return true
  // }).catch((error) => {
  //   console.log(error);
  // });

  const postListRef = ref(db, 'live_life/' + textToHex(email) + "/docs");
  set(postListRef, { "google_drive": data[0], "google_sheet": data[1] })
    .then(() => { console.log('Updating fdrive done') })
    .catch((err) => { console.log('Updating fdrive failed', err) })
}

const firebase_functions = { read_data, push_new_data, update_new_user, update_user_documents }
export default firebase_functions