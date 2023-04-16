const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs,addDoc, doc, deleteDoc, updateDoc } = require("firebase/firestore/lite");

const express = require('express')
const expressapp = express()
const port = 3000

const firebaseConfig = {
  apiKey: "*",
  authDomain: "*",
  projectId: "*",
  storageBucket: "*",
  messagingSenderId: "*",
  appId: "*"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


expressapp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});


expressapp.get('/read', async (req, res) => {
  const col = collection(db, 'enemies');
  const snapshot = (await getDocs(col));
  const list = snapshot.docs;
  
  
  res.send(list.map(doc => {
    const id = doc._key.path.segments[6];
    const name = doc._document.data.value.mapValue.fields.name.stringValue;
    const reason = doc._document.data.value.mapValue.fields.reason.stringValue;
    return {
      id,
      name,
      reason
    };
  }));
});




expressapp.get('/create/:name/:reason', async (req, res) => {
  const name = req.params.name;
  const docRef = await addDoc(collection(db, 'enemies'),{
    name,
    "reason":`${req.params.reason}`,
  });

  res.send('ok')

});

expressapp.get('/delete/:id', async (req, res) => {
  const del = await deleteDoc(doc(db,'enemies',req.params.id))

  res.send('ok')

});

expressapp.get('/edit/:id/:name/:reason', async (req, res) => {
  const ref = doc(db,'enemies', req.params.id);
  await updateDoc(ref, {
    "name":req.params.name,
    "reason":req.params.reason
  });
  res.send('ok')

});

expressapp.listen(port, () => {
  console.log(`${port}`)
});