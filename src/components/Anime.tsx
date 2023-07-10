import React, { useEffect, useState } from 'react';
import './Anime.css'
import { Link } from 'react-router-dom';
import Under from './footer';
import Baner from './header';

interface AnimeData {
  animeid: number;
  title: string;
  desc: string;
  related: string;
  animeimage: string;
}

function AnimeComponent() {
  const [data, setData] = useState<AnimeData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/anime/');
        const jsonData = await response.json();
        
        setData(jsonData);
        console.log(jsonData)
        jsonData.forEach((item: AnimeData) => {
          console.log(item.animeimage);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className = "Anime">
      <Baner/>
      <div className='title'>
        <h2>人気のアニメ</h2>
      </div>
      
        <div className="anime-list">
         
        
        {data.map((item: AnimeData) => (
          <Link to={`/anime/${encodeURIComponent(item.title)}`} key={item.animeid}>

            <div className="anime-card">
              <img src={`http://127.0.0.1:8000${item.animeimage}`} alt="Anime" />
              <h2>{item.title}</h2>
            </div>
          </Link>
        ))}
        
      </div>
      <div className='title'>
        <h2>おすすめのアニメ</h2>
      </div>
      
        <div className="anime-list1">
         
        
        {data.map((item: AnimeData) => (
          <Link to={`/anime/${encodeURIComponent(item.title)}`} key={item.animeid}>

            <div className="anime-card">
              <img src={`http://127.0.0.1:8000${item.animeimage}`} alt="Anime" />
              <h2>{item.title}</h2>
            </div>
          </Link>
        ))}
        
      </div>

    <Under />
    </div>

  );
  
  
}

export default AnimeComponent;
