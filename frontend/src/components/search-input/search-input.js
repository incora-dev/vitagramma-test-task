import React from 'react';
import './search-input.scss';

import Search from 'assets/icons/search.svg';

export const SearchInput = ({ valueChanged, value }) => (
  <div className="search-input">
    <img
      alt="Search icon"
      src={Search}
      className="search-input__icon"
    />
    <input
      type="text"
      onChange={({ target }) => valueChanged(target.value)}
      placeholder="Пошук"
      value={value}
    />
  </div>
)