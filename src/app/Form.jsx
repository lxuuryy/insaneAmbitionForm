'use client'
import React from "react"
import { TbUpload } from "react-icons/tb";

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Percent } from "lucide-react";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../app/utils/firebase";


export default function CardWithForm() {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
 

    const [form, setForm] = React.useState({
        title: '',
        guestName: '',
        episode:'',
        videoUrl: '',
        appleUrl: '',
        spotifyUrl: '',
        featured: true,
        image: '',
        duration: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const podcastRef = collection(db, "podcasts");

    const queryFeatured = query(podcastRef, where("featured", "==", true));
 
    const [percent, setPercent] = React.useState(0);

    const [file, setFile] = React.useState("");
 
    // progress
    
 
    // Handle file upload event and update state
   // Handle file upload event and update state
function handleChanges(event) {
    setFile(event.target.files[0]);
}

const handleUpload = (event) => { 
    event.preventDefault();
    const storageRef = ref(storage, `/files/${file.name}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setPercent(percent);
            if (percent === 100) {
                setIsSubmitting(true);
                
            }
        },
        async (err) => {
            console.log(err);
        },
        async () => {
            try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                console.log(url);
        
               
                const hasUndefined = /undefined/.test(url);

                const isFeaturedSnapshot = await getDocs(queryFeatured);

             await    addDoc(podcastRef, {
                    title: form.title,
                    guestName: form.guestName,
                    episode: form.episode,
                    videoUrl: form.videoUrl,
                    appleUrl: form.appleUrl,
                    spotifyUrl: form.spotifyUrl,
                    featured: form.featured,
                    image: hasUndefined ? "" : url,
                    duration: form.duration,
                    createdAt: serverTimestamp()
                });

        
                if (!isFeaturedSnapshot.empty) {
                    isFeaturedSnapshot.forEach(async (doc) => {
                        console.log(doc.id, " => ", doc.data());
                        const docRef = doc.ref;
                        const updating = await updateDoc(doc.ref, {
                            featured: false
                        });
        
                        if (updating) {
                            try {
                                
        
                               
        
                                window.location.reload();
                            } catch (error) {
                                console.error('Error adding document:', error);
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error getting download URL:', error);
            }
        }
    );
}; 



  return (
    <div>
        <form onSubmit={handleUpload}>
    <Card className="dark w-[380px] md:w-[550px] mt-[350px]">
      <CardHeader>
        <CardTitle>Podcast Form 🚀</CardTitle>
        <CardDescription>Please fill in all the fields to update the website</CardDescription>
      </CardHeader>
      <CardContent>
        
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Podcast Title</Label>
              <Input id="title" name='title' onChange={handleChange} value={form.title} placeholder="Skincare, Smart Patches, Medtech, Innovation" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Guest name</Label>
              <Input id="title" onChange={handleChange} name='guestName' value={form.guestName} placeholder="Hunter Watkin" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Episode Number</Label>
              <Input id="title" onChange={handleChange} name='episode' value={form.episode} placeholder="3" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Episode duration</Label>
              <Input id="title" onChange={handleChange} name='duration' value={form.duration} placeholder=" 1 hr 30 mins" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Youtube URL</Label>
              <Input id="title" onChange={handleChange} name='videoUrl' value={form.videoUrl} placeholder=" https://www.youtube.com/watch?v=zonXXSYoeCA" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Apple Podcast URL</Label>
              <Input id="title" onChange={handleChange} name='appleUrl' value={form.appleUrl} placeholder="https://podcasts.apple.com/au/podcast/james-fallon-medtech-new-cure-for-crohns-state-of/id1724091922?i=1000655111551" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Spotify URL</Label>
              <Input id="title" onChange={handleChange} name='spotifyUrl' value={form.spotifyUrl} placeholder="https://open.spotify.com/episode/2P9IcjTpnS7Py342eZQkFM?si=iPdZx38WTZirHBaWuMUNoQ&nd=1&dlsi=c35f09358d3e4861" />
            </div>
            <div className="flex flex-col space-y-1.5 min-w-[150px] max-w-[150px]">
              <Label htmlFor="name" onChange={handleChange} name='image' value={form.image}>Youtube thumbnail</Label>
            
              
            <input
                    type='file'
                    onChange={handleChanges}
                    accept="/image/*"
                    />
            </div>
            
          </div>
       
      </CardContent>
      <CardFooter className="flex justify-center">
        
      { percent !== 100 ? (
  <>
    <Button>Submit</Button>
    {percent > 1 && <p>{percent}%</p>}
  </>
) : (
  <div>
    <p>Submitted!</p>
  </div>
)}

      </CardFooter>
    </Card>
    </form>
    </div>
  )
}
