import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './Firebase';
import { Button } from '@material-ui/core';
import firebase from 'firebase';

const Post = ({user,postid,username,caption,imageurl}) => {
   
    const [comment,setComment] = useState([]);
    const [inputcomment,setInputcomment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if(postid){
            unsubscribe = db
            .collection("post")
            .doc(postid)
            .collection('comment')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComment(snapshot.docs.map((doc) => doc.data()));
            })
        }
      
        return () => {
            unsubscribe();
        }

    },[postid])

    const postcomment = (e) => {
        e.preventDefault();
        db.collection('post').doc(postid).collection('comment').add({
            username : user,
            text : inputcomment,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setInputcomment('');
    }


    return (
        <>
        <div className="post">
        <div className="post__header">
        <Avatar 
            className="post__avatar"
            alt="pradip"
            src=""
        />
        <h3>{username}</h3>
        </div>

            <img className="Post__image" src={imageurl} alt="no"/>

            <h3 className="post__text"><strong>{username} : </strong> {caption}</h3>
   
            <div className="post__commentView">
                {comment.map((i) => (<p><strong>{i.username} : </strong> {i.text}</p>))}
            </div>
          

        {user &&            
          <form>
           <div className='post__comment'>
               <input className="post__commentbox" value={inputcomment} type='text' placeholder="Add a comment.." onChange={(e) => setInputcomment(e.target.value)} />
               <Button disabled={!inputcomment} className="postcomment__button" type='submit' onClick={postcomment}>Post</Button>
            </div>
           </form>
        }


        </div>    
        </>
    )
}

export default Post
