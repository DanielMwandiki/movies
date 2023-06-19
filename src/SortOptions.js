import React from 'react';

const SortOptions = ({ sortBy, handleSortChange }) => {
  return (
    <div className="sort-container">
      <label htmlFor="sort-by">Sort By:</label>
      <select id="sort-by" value={sortBy} onChange={handleSortChange}>
        <option value="">Default</option>
        <option value="imdbRating">Rating</option>
        <option value="Year">Release Date</option>
      </select>
    </div>
  );
};

export default SortOptions;
