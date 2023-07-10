import React, { useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import Under from "./footer";
import './Map.css'
async function fetchLocations(query: string): Promise<any[]> {
  const response = await fetch(`http://127.0.0.1:8000/gmap/places/search/?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  console.log(data);
  return data;
}

async function fetchDirections(start: string, end: string): Promise<any> {
  console.log(start)
  console.log(end)
  const response = await fetch(`http://127.0.0.1:8000/gmap/guide/directions/?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
    method: 'GET',
    // 必要に応じてヘッダーやその他のオプションを指定できます
  });
  const data = await response.json();
  console.log(data);
  return data;
}


const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
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

  useEffect(() => {
    const clearMarkers = () => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      setMarkers([]);
    };

    clearMarkers();
    if (mapRef.current) {
      renderMarkers(mapRef.current.map, mapRef.current.maps);
    }
  }, [locations]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchRef.current?.value || "";
    console.log(query);
    try {
      const data = await fetchLocations(query);
      console.log(data);
      setLocations(data);
      if (data.length > 0) {
        const currentLocation = "35.6863444, 139.7622598"; // 皇居の座標
        moveToMarker(data[0], currentLocation);
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };
  
  const moveToMarker = async (location: any, currentLocation: string) => {
    if (mapRef.current && location) {
      const maps = mapRef.current.maps;
      const position = { lat: parseFloat(location.lat), lng: parseFloat(location.lng) };
      mapRef.current.map.panTo(position);
      const marker = new maps.Marker({ position });
      marker.setMap(mapRef.current.map);
  
      console.log(marker);
  
      marker.addListener("click", function() {
        const url = `gmap/place/${encodeURIComponent(location.name)}/`;
        window.location.href = url;
      });
  
      setMarkers((prevMarkers) => [...prevMarkers, marker]);
  
      try {
        const data = await fetchDirections(currentLocation, location.name);
        console.log(data);
        // TODO: 結果の経路をマップ上に描画します
        drawRouteOnMap(data);
      } catch (error) {
        console.error("経路の取得に失敗しました:", error);
      }
    }
  };
  
  

  const renderMarkers = (map: any, maps: any) => {
    const newMarkers: any[] = [];

    locations.forEach((location: any) => {
      const marker = new maps.Marker({
        position: { lat: parseFloat(location.lat), lng: parseFloat(location.lng) },
        map,
      });



      const buttonId = `button_${location.name}`; // 重複しないようにidを作成
      const button = `<button style="padding: 10px 20px; color: white; background-color: #007BFF; border: none; border-radius: 4px; cursor: pointer; width: 100%; max-width: 300px;" id="${buttonId}">ここへ行く</button>`;


      const infowindow = new maps.InfoWindow({
          content: `
          <div class="custom-infowindow">
              <h3>${location.name}</h3>
              <p>${location.animetitle}</p>
              ${button}
          </div>
          `,
      });

      // InfoWindowが開いた後にクリックイベントを追加
      google.maps.event.addListener(infowindow, 'domready', () => {
          const element = document.getElementById(buttonId);

          if (!element) return;

          element.addEventListener('click', async () => {
              try {
                  console.log("AAA")
                  
                  const currentLocation = "35.6863444, 139.7622598"; // 皇居の座標
                  console.log(currentLocation)
                  const data = await fetchDirections(currentLocation, location.name);
                 
                  console.log("fetched data:", data);
                  // TODO: 結果の経路をマップ上に描画します
                  drawRouteOnMap(data);
              } catch (error) {
                  console.log("JIJIJ")
                  console.error("経路の取得に失敗しました:", error);
              }
          });
      });


      marker.addListener("click", function(this: google.maps.Marker) {
        infowindow.open(map, this);
        const url = `gmap/${encodeURIComponent(location.name)}/`;
        window.location.href = url;
      });

      infowindow.open(map, marker);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // ピンで現在地を表示
    const currentLocationMarker = new maps.Marker({
      position: { lat: 35.6863444, lng: 139.7622598 }, // 皇居の座標
      map,
    });
    setMarkers((prevMarkers) => [...prevMarkers, currentLocationMarker]);
  };

  const drawRouteOnMap = async (routeData: any[]) => {
    const currentLocation = "35.6863444, 139.7622598"; // 現在地の座標
  
    console.log(routeData);
    if (mapRef.current && routeData.length > 0) {
      const maps = mapRef.current.maps;
      const directionsRenderer = new maps.DirectionsRenderer({
        map: mapRef.current.map,
        suppressMarkers: true,
      });

      console.log(routeData[0])
      const startLocation = routeData[0].start_location;
      console.log(startLocation); 

      if (
        routeData[0]?.start_location?.lat === undefined ||
        routeData[0]?.start_location?.lng === undefined
      ) {
        console.log(
          `Missing lat or lng value at index 0. Step: ${JSON.stringify(routeData[0])}`
        );
        console.log("BBB");
        // throw new Error(`Missing lat or lng value at index 0. Step: ${JSON.stringify(routeData[0])}`);
      }
      console.log(routeData[0])

  
      const waypoints = routeData.map((step: any, index: number) => {
        console.log(step.start_location)

        const lat = parseFloat(step.start_location.lat);
        const lng = parseFloat(step.start_location.lng);
        console.log(lat)
        console.log(lng)

        if (isNaN(lat) || isNaN(lng)) {
          console.error(
            `Invalid lat or lng value. lat: ${step.start_location?.lat}, lng: ${step.start_location?.lng}`
            
            
          );
          
          // throw new Error(`Invalid lat or lng value. lat: ${step.start_location?.lat}, lng: ${step.start_location?.lng}`);
        }
        return {
          location: { lat, lng },
          stopover: true,
        };
      });
  
      try {
        const currentLocationCoordinates = currentLocation.split(",");
        const request = {
          origin: {
            lat: parseFloat(currentLocationCoordinates[0]),
            lng: parseFloat(currentLocationCoordinates[1]),
          },
          destination: {
            lat: parseFloat(routeData[routeData.length - 1]?.end_location?.lat),
            lng: parseFloat(routeData[routeData.length - 1]?.end_location?.lng),
          },
          waypoints: waypoints,
          travelMode: "DRIVING",
        };
  
        const directionsService = new maps.DirectionsService();
        directionsService.route(request, (result: any, status: any) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Failed to get route. Status:", status);
          }
        });
      } catch (error) {
        console.error("Failed to get current location:", error);
      }
    }
  };
    
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <input
            type="text"
            placeholder="検索キーワード"
            ref={searchRef}
            style={{
              padding: "10px",
              marginRight: "10px",
              borderRadius: "5px",
              border: "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              background: "linear-gradient(to bottom, #4e6ef2, #3e51e4)",
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            検索
          </button>
        </form>
      </div>

      <div style={{ height: "780px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyANo-MndvZ0THsRxGEaTBHUfRCUXLv3w2g" }} // TODO: 自分のAPIキーを指定
          defaultCenter={{ lat: 35.6794397, lng: 139.7663463 }}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            mapRef.current = { map, maps };
            renderMarkers(map, maps);
          }}
        ></GoogleMapReact>
      </div>
      <Under />
    </div>
  );
};

export default MapComponent;
