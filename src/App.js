import React, { useEffect, useState } from 'react';
import './App.css';
import {auth, db} from './Firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


const App = () => {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [post,setPost] = useState([]);
  const [open,setOpen] = useState(false);
  const [openlogin,setOpenlogin] = useState(false);

  const [username,setUsername] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [user,setUser] = useState();


  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser){
          // User is loged in
          // console.log(authUser);
          setUser(authUser);
        }
        else{
          //auser loged out
          setUser(null)
        }
     
        return () => {
          // perform some cleanup actions
          unsubscribe()
        }

      })
  },[user,username]);

  useEffect(()=>{
    return (
    db.collection("post").orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPost(snapshot.docs.map((doc) => ({id:doc.id,data:doc.data()})))
    }))
  },[])

  const register = (e) => {
    e.preventDefault();
    
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return (authUser.user.updateProfile({
        displayName : username
      }))
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const login = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenlogin(false);
  }



  return (
    <>
    <div className="App">
    
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
    <div style={modalStyle} className={classes.paper}>
     <center>
    <img className="app__image" alt="Logo"/>
    </center>
    
    <form className="app__register">
    <Input
      type='text'
      value={username}
      placeholder="Username"
      onChange={(e) => setUsername(e.target.value)}
    />

    <Input
      type='text'
      value={email}
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <Input
      type='text'
      value={password}
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />
    
    <Button type='submit' onClick={register}>Register</Button>
    </form>
    </div>    
    </Modal>

    <Modal
      open={openlogin}
      onClose={() => setOpenlogin(false)}
    >
    <div style={modalStyle} className={classes.paper}>
     <center>
    <img className="app__image" alt="Logo"/>
    </center>
    
    <form className="app__register">

    <Input
      type='text'
      value={email}
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <Input
      type='text'
      value={password}
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />
    
    <Button type='submit' onClick={login}>Login</Button>
    </form>
    </div>    
    </Modal>

    <div className="app__header">
      <img className="app__headerimage" src='https://www.pngkey.com/png/detail/213-2133456_follow-us-on-twitter-instagram-name-black-and.png' width='400' height='40' alt="Logo"/>
      {user ? <Button onClick={() => auth.signOut()}>Logout</Button> : 
    (
      <div className="app__logincontainer">
      <Button onClick={() => setOpen(true)}>Register</Button>
      <Button onClick={() => setOpenlogin(true)}>Login</Button>
      </div>
      )}
    </div>
    
    <div className='app__post'>
    <div className='app__postleft'>
    {post.map((post)=>(
        <Post key={post.id} user={user?.displayName?user.displayName:false} postid={post.id} username={post.data.username} imageurl={post.data.imageUrl} caption={post.data.caption} />
        ))}
    
        {/* {user?.displayName ? <ImageUpload username = {user.displayName}/> : <h5>Login Required to upload image</h5>} */}
    </div>
   
    <div className='app__postright'>
     
    {user?.displayName ? <ImageUpload username = {user.displayName}/> : <h5>Login Required to upload image</h5>}

    {/* <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
    /> */}
    </div>
    </div>
    </div>
    </>
  );
}

export default App;
