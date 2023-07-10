import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,RouteMatch } from 'react-router-dom';
import './post.css'
import Baner from './header';
import Under from './footer';

interface PostData {
  placeid: number;
  userid: string;
  
  title: string;
  description: string;
  postimage: File | null;
}

const PostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postimage, setPostimage] = useState<File | null>(null);
  const [placeid, setPlaceid] = useState(0);
  const [animeid, setAnimeid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PostData | null>(null);

  const { name }: { name?: string } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          console.log(name);
          const encodedName = encodeURIComponent(name);
          const response = await axios.get(`http://127.0.0.1:8000/gmap/${encodedName}/`);
          setData(response.data);
          setPlaceid(response.data.placeid);
          setAnimeid(response.data.animeid);
          setLoading(false);
        }
      } catch (error) {
        console.error("An error occurred while fetching place data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    try {
      // Retrieve user id from local storage
      const userid = localStorage.getItem('UserID');
      console.log(userid);
      if (userid === null) throw new Error('User not logged in');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (postimage) {
        formData.append('postimage', postimage);
      }
      formData.append('placeid', String(placeid));
      formData.append('animeid', String(animeid));
      formData.append('userid', userid);

      console.log(formData);

      const res = await axios.post(`http://127.0.0.1:8000/post/create_post/${placeid}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res);

      // Handle successful post creation...
      console.log(res.data);
    } catch (error) {
      // Handle errors...
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='postform'>
        <Baner/>
        <h1 className='posttitle'>投稿する</h1>
        <form onSubmit={handleSubmit} className="create-post-form">
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="title"
        />
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="description"
        />
        <input
            type="file"
            onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setPostimage(file);
            }}
            className="file-input"
        />
        <button type="submit" className="submit-button">Create Post</button>
        </form>
        <Under/>
    </div>
  );
  
};

export default PostPage;
