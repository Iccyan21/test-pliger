import React, { useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import Under from "./footer";

async function fetchLocations(query: string): Promise<any[]> {
  // Local環境
  const response = await fetch(`http://127.0.0.1:8000/gmap/places/search/?q=${encodeURIComponent(query)}`);
  // 携帯のVer
  // const response = await fetch(`http://172.20.10.4:8000/gmap/places/search/?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  console.log(data);
  return data;
}

const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const mapRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocations("");
        setLocations(data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchRef.current?.value || "";
    console.log(query);
    try {
      const data = await fetchLocations(query);
      console.log(data);
      setLocations(data);
      if (data.length > 0) {
        moveToMarker(data[0]);
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };

  const moveToMarker = (location: any) => {
    if (mapRef.current && location) {
      const maps = mapRef.current.maps;
      //緯度経度の移動
      const position = { lat: parseFloat(location.lat), lng: parseFloat(location.lng) };
      mapRef.current.map.panTo(position);
      const marker = new maps.Marker({ position });
      marker.setMap(mapRef.current.map);

      marker.addListener("click", function() {
        const url = `gmap/parace/${encodeURIComponent(location.name)}/`;
        window.location.href = url;
      });
    }
  };
  const renderMarkers = (map: any, maps: any) => {
    locations.forEach((location: any) => {
      const marker = new maps.Marker({
        position: { lat: parseFloat(location.lat), lng: parseFloat(location.lng) },
        map,
      });
      const infowindow = new maps.InfoWindow({
        content: `
          <div class="custom-infowindow">
            <h3>${location.name}</h3>
            <p>${location.animetitle}</p>
          </div>
        `,
      });
  
      marker.addListener("click", function(this: google.maps.Marker) {
        infowindow.open(map, this);
        const url = `gmap/${encodeURIComponent(location.name)}/`;
        window.location.href = url;
      });
      
      
  
      // マーカーをクリックせずに常時表示
      infowindow.open(map, marker);
    });
  };
  
  
  

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <input type="text" placeholder="検索キーワード" ref={searchRef} style={{ padding: "10px", marginRight: "10px", borderRadius: "5px", border: "none", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)" }} />
          <button type="submit" style={{ padding: "10px 20px", borderRadius: "5px", background: "linear-gradient(to bottom, #4e6ef2, #3e51e4)", color: "#fff", border: "none", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)" }}>検索</button>
        </form>
      </div>
  
      <div style={{ height: "610px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyANo-MndvZ0THsRxGEaTBHUfRCUXLv3w2g" }} // TODO: 自分のAPIキーを指定
          defaultCenter={{ lat: 35.6794397, lng: 139.7663463 }}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            mapRef.current = { map, maps }; // マップとマップの参照を保存
            renderMarkers(map, maps);
          }}
        ></GoogleMapReact>
      </div>
      <Under />
    </div>
  
  );
  
  
};

export default MapComponent;
