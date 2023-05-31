import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage,db } from './Firebase.js'
import firebase from 'firebase';
import './ImageUpload.css'


const ImageUpload = ({username}) => {

   const [caption,setCaption] = useState();
   const [image,setImage] = useState(null);
   const [progress,setProgress] = useState(0);

   const handleChange = (e) => {
    if(e.target.files[0]){
        setImage(e.target.files[0]);
    }
   };
   
   const handleUpload =(e) => {
    const uploadtask = storage.ref(`images/${image.name}`).put(image);
    uploadtask.on(
        'state_changed',
        (snapshot) => {
            //Progress function....
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 95                
                );
                setProgress(progress);
        },
        (error) => {
            console.log(error.message);
            alert(error.message);
        },
        () => {
            // complete function...
            
            storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                //post image inside db...
                db.collection('post').add({
                    timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                    username : username,
                    caption : caption,
                    imageUrl : url
                })
            })

            setImage(null);
            setProgress(0);
            setCaption('');
        }
    )
   }
 
    return (
        <div className='imageUpload'>
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input required={true} placeholder='Enter a caption....' onChange={(e) => {setCaption(e.target.value)}} value={caption} type='text'/>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <Button disabled={!(image) || !(caption)} onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
