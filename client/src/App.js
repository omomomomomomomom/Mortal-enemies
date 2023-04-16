import { useEffect, useState } from 'react';
import './App.css';
import read from './utils/read';
import Auth from './auth';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function App() {
  const [Data, setData] = useState([]);
  const [Value, setValue] = useState('');
  const [ValueR, setValueR] = useState('');
  const [Edit, setEdit] = useState('');
  const [EditId, setEditId] = useState('');
  const [EditReason, setEditReason] = useState('');
  const [AuthLog, setAuthLog] = useState(localStorage.getItem("auth"));

  useEffect(() => {
    const data = async() => {
      const d = await read;
      setData(d)
    }
    data()

  }, [])


  const firebaseConfig = {
    apiKey: "*",
    authDomain: "*",
    projectId: "*",
    storageBucket: "*",
    messagingSenderId: "*",
    appId: "*"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const provider = new GoogleAuthProvider();
///id/correct/userid
  const signInWithGoogle = async() => {
    signInWithPopup(auth, provider)
      .then((result) => {
          localStorage.setItem("auth",true);
          setAuthLog(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  
  const Delete_enemy = async(id) => {
    const req = await fetch(`http://127.0.0.1:3000/delete/${id}`);
    console.log(req);
    const data = async() => {
      const req = await fetch("http://127.0.0.1:3000/read");
      const data = await req.json();
      setData(data)
    }
    data()
  };

  const AddEnemy = async() => {
    setValue('');
    const req = await fetch(`http://127.0.0.1:3000/create/${Value}/${ValueR}`);
    console.log(req);
    const data = async() => {
      const req = await fetch("http://127.0.0.1:3000/read");
      const data = await req.json();
      setData(data);
    }
    data()
  };

  const SaveEdit = async() => {
    const req = await fetch(`http://127.0.0.1:3000/edit/${EditId}/${Edit}/${EditReason}`);
    console.log(req);
    const data = async() => {
      const req = await fetch("http://127.0.0.1:3000/read");
      const data = await req.json();
      setData(data)
    }
    data()
  };

  const onClickEdit = (name,id,reason) => {
    setEdit(name);
    setEditId(id);
    setEditReason(reason);
  };

  return (
    <div className="App">
      {AuthLog ? <><div style={{ display: 'flex' }}>
  <input type="text" class="form-control" aria-describedby="inputGroup-sizing-lg" value={Value} onChange={(e) => setValue(e.target.value)} placeholder='Enemy name'/>
  <input type="text" class="form-control" aria-describedby="inputGroup-sizing-lg" value={ValueR} onChange={(e) => setValueR(e.target.value)} placeholder='Enemy reason'/>

  <button type="button" class="btn btn-primary" onClick={() => AddEnemy()}>Add</button>
</div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Reason</th>
                <th scope="col">Delete</th>
                <th scope="col">Edit</th>


              </tr>
            </thead>
            <tbody class="table-group-divider">
            {Data && Data.map(enemy => {
              return(
                <tr key={enemy.id}>
                <td>{enemy.id}</td>
                <td>{enemy.name}</td>
                <td>{enemy.reason}</td>
                <td><button onClick={() => Delete_enemy(enemy.id)} type="button" class="btn btn-danger">Delete</button></td>
                <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit" onClick={() => onClickEdit(enemy.name,enemy.id,enemy.reason)}>Edit</button></td>
                <div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <input placeholder='Enemy name' type="text" class="form-control"  aria-describedby="inputGroup-sizing-lg" value={Edit} onChange={(e) => setEdit(e.target.value)} />
                <input placeholder='Enemy reason' type="text" class="form-control"  aria-describedby="inputGroup-sizing-lg" value={EditReason} onChange={(e) => setEditReason(e.target.value)} />

                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => SaveEdit(enemy.id)}>Save</button>
                </div>
              </div>
            </div>
          </div>
              </tr>
              
              )
            })}


            </tbody>
          </table></>

          : <Auth signInWithGoogle={signInWithGoogle} />}

    </div>
  );
}

export default App;
