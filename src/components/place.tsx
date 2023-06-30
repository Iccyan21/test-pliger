import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Under from './footer';
interface CandidateData {
  placeid: number;
  name: string;
  descpiption: string;
  notes: string;
  accsess: string;
  placeimage: string; // 修正: 画像のパスを保持するために string 型を使用
}

interface postdata{
    placeid: number;
    userid: string;
    title: string;
    description: string;
    postimage: string;
}

function YourComponent(props: { placeid : number }) {
  const { placeid } = props;

  const [data, setData] = useState<postdata[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/post/posts/${placeid}/`);
        const jsonData = await response.json();
        setData(jsonData);
        console.log(data)

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [placeid]);

  return (
    <div className='placeposts'>
        <h2>投稿</h2>
      {data.map((item) => (
        <div key={item.placeid}>
          <img src={`http://127.0.0.1:8000${item.postimage}`} alt={item.title} className="placeimage"/>
          <h1>{item.title}</h1>
          <h1>{item.description}</h1>
          <p>{item.userid}</p>
        </div>
      ))}
    </div>
  );
}

function CandidateDataComponent() {
  const [data, setData] = useState<CandidateData | null>(null);
  const { name }: { name?: string } = useParams();

  
  useEffect(() => {
    const fetchData = async () => {
      if (name) {
        try {
          const encodedName = encodeURIComponent(name);
          const response = await fetch(`http://127.0.0.1:8000/gmap/${encodedName}/`);
          const jsonData: CandidateData = await response.json();
          setData(jsonData);
          console.log(jsonData)
          console.log(jsonData.placeimage)
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [name]);
  
  return (
    <div className='place'>
      {data !== null ? (
        <div>
         
          {/* Image */}
          <img src={`http://127.0.0.1:8000${data.placeimage}`} alt={data.name} className="placeimage"/>
          <h1>{data.name}</h1>
          <h2>説明</h2>
          <p>{data.descpiption}</p>
          <h2>注意点</h2>
          <p>{data.notes}</p>
          <h2>アクセス</h2>
          <p>{data.accsess}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {data !== null && <YourComponent placeid={data.placeid} />}
      <Under />
    </div>
  );
}

export default CandidateDataComponent;
