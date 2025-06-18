// Firebase config (replace with your own config from Firebase Console)
 const firebaseConfig = {
    apiKey: "AIzaSyD67r7V8lcucf9f-5Cn3nbYxhj9SiRL5TU",
    authDomain: "studentadmissions-1402c.firebaseapp.com",
    projectId: "studentadmissions-1402c",
    storageBucket: "studentadmissions-1402c.appspot.com",
    messagingSenderId: "820335252704",
    appId: "1:820335252704:web:1e3a6380810c631a1f2c85"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle Form Submit
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const course = document.getElementById("course").value;
      const docRef = await db.collection("applications").add({
        name, email, course, status: "Pending",
        created: new Date().toISOString()
      });
      document.getElementById("result").innerText =
        "Application submitted. Your ID: " + docRef.id;
      form.reset();
    });
  }
});

// Track Application
async function trackApplication() {
  const appId = document.getElementById("trackId").value;
  const doc = await db.collection("applications").doc(appId).get();
  if (doc.exists) {
    const data = doc.data();
    document.getElementById("trackResult").innerText = 
      `Name: ${data.name}, Status: ${data.status}`;
  } else {
    document.getElementById("trackResult").innerText = "Not found!";
  }
}

// Admin View
document.addEventListener("DOMContentLoaded", async function () {
  const adminList = document.getElementById("adminList");
  if (adminList) {
    const snapshot = await db.collection("applications").get();
    snapshot.forEach((doc) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${doc.data().name}</strong> - ${doc.id} - Status: ${doc.data().status}</p>
        <button onclick="updateStatus('${doc.id}', 'Approved')">Approve</button>
        <button onclick="updateStatus('${doc.id}', 'Rejected')">Reject</button>
        <hr>`;
      adminList.appendChild(div);
    });
  }
});

async function updateStatus(id, status) {
  await db.collection("applications").doc(id).update({ status });
  alert("Updated to: " + status);
  location.reload();
}
