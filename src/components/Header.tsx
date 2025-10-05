import React from 'react';

import styles from '../styles/Header.module.css';

import {
  Link
} from "react-router-dom";

function Header() {
  return (
      <header className={styles.header}>
        <Link to="/">
          <h1>TMDB Movie reviews application</h1>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/list">Search</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </nav>
        
      </header>
  );
}

export default Header;
