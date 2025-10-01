import React from "react";
import styles from '../styles/ListView.module.css';

function ListView() {
        return (
        <div className={styles.main}>

            <div className={styles.searchBox}>
                <input 
                    type="search" 
                    name="search" 
                    className={styles.searchBar} 
                    placeholder="Search for movie name..." 
                />
            </div>

            <div className={styles.controlsContainer}>
                
                <div className={styles.sortDropdown}>
                    <select name="sort" id="sort" className={styles.sortSelect}>
                        {/* <option value="" disabled selected>Sort by...</option> */}
                        <option value="title" selected>Sort by Title</option>
                        <option value="rank">Sort by Rank</option>
                    </select>
                </div>

                <div className={styles.orderRadio}>
                    
                        <input 
                            type="radio" 
                            name="order" 
                            id="asc" 
                            className={styles.viewRadio} 
                            defaultChecked 
                        />
                        <label htmlFor="asc">Ascending</label>

                    
                        <input 
                            type="radio" 
                            name="order" 
                            id="desc" 
                            className={styles.viewRadio} 
                        />
                        <label htmlFor="desc">Descending</label>
                    

                </div>
            </div>

        </div>
    );
}

export default ListView;