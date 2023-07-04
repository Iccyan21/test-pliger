import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MapComponent from './components/Map';

import AnimeComponent from './components/Anime';
import Login from './components/user/login';
import AnimeDetail from './components/Animedetail'
import CandidateDataComponent from './components/place'

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/anime" element={<AnimeComponent />} />
          <Route path="/anime/:title" element={<AnimeDetail />} />
          <Route path="/gmap/:name" element={<CandidateDataComponent />}/>
        </Routes>
       
      </BrowserRouter>

   
     
    </div>
  );
}

export default App;
