import React from "react";
import styles from "../styles/FilterView.module.css";
import {useState} from "react";


const genreList = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];

function FilterSwitch() {

    const [activeGenre, setActiveGenre] = useState("All");

    return (
        
        <div className={styles.filters}>
            {genreList.map((genre) => (
                <button
                    key = {genre}
                    className = {`${styles.filterButton} ${activeGenre === genre ? styles.active : ""}`}
                    onClick = {() => setActiveGenre(genre)}
                >
                    {genre}
                </button>

                
            )) 
            }
            
        </div>
    )
}

function GalleryView() {
        return (
        <div className={styles.container}>
            <FilterSwitch />
            
            <div className={styles.gallery}>
                {/* Gallery items would be rendered here */}
                <p>Gallery items will be displayed here.</p>

            </div>
            
        </div>
    );
}

export default GalleryView;