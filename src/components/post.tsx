import { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Baner from './header';
import Under from './footer';
import './post.css';

interface CreatePostProps {
  placeid?: string; // placeid をオプションのパラメーターに変更
}

const CreatePost = ({ placeid }: CreatePostProps) => {
  const [animeid, setAnimeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postimage, setPostImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const { placeid: routePlaceId } = useParams(); // ルーティングパラメーターから placeid を取得

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPostImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    console.log(token);

    const formData = new FormData();
    formData.append('animeid', animeid);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('postimage', postimage || '');

    axios.post(`http://127.0.0.1:8000/post/create_post/${routePlaceId || placeid}/`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}` // 認証トークンをリクエストヘッダーに含める
    }
    })


    .then((response) => {
      console.log(response.data);
      navigate(`/place/${routePlaceId || placeid}`);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className='postform'>
    <Baner />
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Anime ID"
            value={animeid}
            onChange={(e) => setAnimeId(e.target.value)}
        />
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
        />
        <button type="submit">Create Post</button>
        </form>
        < Under />
    </div>
  );
};

export default CreatePost;
