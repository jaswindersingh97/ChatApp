import React from 'react';
import styles from './SearchOverlay.module.css';
import Dummy from './dummy';

function SearchOverlay({ closeSearch }) {
  return (
    <div className={styles.searchOverlay}>
      <div className={styles.searchContainerLeft}>
        <div className={styles.top}>
        <input type="text" placeholder="Search..." className={styles.searchInput} />
        <button>Search</button>
        </div>
        <div className={styles.down}>
            <Dummy number={10}/>
        </div>
        {/* Your search content goes here */}
      </div>
      <div className={styles.searchContainerRight} onClick={closeSearch}>
        {/* Clicking this will close the search window */}
      </div>
    </div>
  );
}

export default SearchOverlay;