import React from 'react';
import 'normalize.css';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  
  Routes
} from "react-router-dom";
import Header from './components/Header';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';


function App() {
  return (
    <div className='App'>
      <Router basename='/mp2'>
        <Header/>

        <Routes>
          <Route path="/list" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
        </Routes>

        </Router>
    </div>
  );
}

export default App;
