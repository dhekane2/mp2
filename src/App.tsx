import React from 'react';
import 'normalize.css';
import './App.css';

import {
  HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Header from './components/Header';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailsView from './components/DetailsView';


function App() {
  return (
    <div className='App'>
      <Router>
        <Header/>

        <Routes>
          <Route path="/list" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/details/1" element={<DetailsView/>} />
          <Route path="*" element={<ListView />} />
        </Routes>

        </Router>
    </div>
  );
}

export default App;
