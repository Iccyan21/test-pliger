import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Animedetail.css'
import Under from './footer';
import Baner from './header';

interface AnimeData {
  animeid: number;
  animeimage: string;
  title: string;
  description: string;

}

interface PlaceData {
  placeid: number;
  animeid: number;
  name: string;
  address: string;
  descpiption: string;
  notes: string;
  access: string;
  placeimage: string;
  lat: string;
  lng: string;
}

interface AnimeDetailParams {
  title: string;
  [key: string]: string | undefined;
}

function AnimeDetail() {
  const { title } = useParams<AnimeDetailParams>();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (title) {
          const animeResponse = await fetch(`http://127.0.0.1:8000/anime/${encodeURIComponent(title)}/`);
          const animeJsonData: AnimeData = await animeResponse.json();
          
          setAnimeData(animeJsonData);
          console.log(animeJsonData.animeid)

          const placeResponse = await fetch(`http://127.0.0.1:8000/gmap/anime/${animeJsonData.animeid}/`);
          const placeJsonData: PlaceData[] = await placeResponse.json();
         
          setPlaceData(placeJsonData);
          console.log(placeJsonData)
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [title]);

  if (!animeData || !placeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Animedetail">
        <img src={`http://127.0.0.1:8000${animeData.animeimage}`} className="animeimage" alt="Anime" />
        <h1 className='animetitle'>{animeData.title}</h1>
        <h3 className="underline" id="midasi">作品あらすじ</h3>
        <p className="discription">{animeData.description}</p>
        <br></br><br></br><br></br>
       
        <h2 className='seichi-desc-title'>舞台となった場所</h2>
        <div className="seichi-list">
            
                {placeData.map((place) => (
                    <Link to={`/gmap/${place.name}`}>
                    <div key={place.placeid}>
                        <div className="seichi-card">
                            <img src={`http://127.0.0.1:8000${place.placeimage}`} alt="Anime" />
                            <h2>{place.name}</h2>
                        </div>
                    </div>
                    </Link>
                ))}
        </div>
        <Under />
    </div>
    
   
  );
}

export default AnimeDetail;
