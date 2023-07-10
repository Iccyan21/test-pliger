import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Under from './footer';
import './place.css';
import Baner from './header';
import { Link } from 'react-router-dom';

interface CandidateData {
  placeid: number;
  name: string;
  descpiption: string;
  notes: string;
  accsess: string;
  placeimage: string;
}

interface PostData {
  postid: number;
  placeid: number;
  placename: string;
  userid: string;
  title: string;
  description: string;
  postimage: string;
}

function YourComponent(props: { placeid: number }) {
  const { placeid } = props;

  const [data, setData] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/post/posts/${placeid}/`);
        const jsonData: PostData[] = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [placeid]);

  return (
    <div className="placeposts">
      <div className="placedesc">
        <h2>投稿</h2>
      </div>

      <div className="seichi-list">
        {data.map((item) => (
          <div key={item.postid}>  {/* <- 'postid' をキーとして使用 */}
            <div className="seichi-card">
              <img src={`http://127.0.0.1:8000${item.postimage}`} alt={item.title} className="placeimage" />
              <h2>{item.title}</h2>
              <p>{item.userid}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function CandidateDataComponent() {
  const [data, setData] = useState<CandidateData | null>(null);
  const { name }: { name?: string } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const encodedName = encodeURIComponent(name);
          const response = await fetch(`http://127.0.0.1:8000/gmap/${encodedName}/`);
          const jsonData: CandidateData = await response.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [name]);

  return (
    <div className="place">
      {data !== null ? (
        <div>
          <Baner />

          <img src={`http://127.0.0.1:8000${data.placeimage}`} alt={data.name} className="placeimage" />

          <h1 className="placename">{data.name}</h1>
          <div className="placedesc">
            <h2>説明</h2>
            <p>{data.descpiption}</p>
          </div>

          <div className="placedesc">
            <h2>注意点</h2>
            <p>{data.notes}</p>
          </div>

          <div className="placedesc">
            <h2 className="underline">アクセス</h2>
            <p>{data.accsess}</p>
          </div>

         

          <Link
            to={`/post/${encodeURIComponent(data.name)}`}
            onClick={() => console.log(data.name)}
          >
            <h2>投稿する</h2>
          </Link>

        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className="post"></div>

      {data !== null && <YourComponent placeid={data.placeid} />}

      <Under />
    </div>
  );
}

export default CandidateDataComponent;
