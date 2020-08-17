import React from 'react';
import './search-item.scss';

import { ItemDetails } from '../item-details/item-details';

export const SearchItem = ({ data, change, isChecked }) => (
  <div className="search-item">
    <label className="checkbox">
      <ItemDetails data={data} />
      <input
        type="checkbox"
        onChange={() => change(data)}
        checked={isChecked}
      />
      <span className="checkmark"></span>
    </label>
    <p className="search-item__price">{data.price} ГРН</p>
  </div>
)