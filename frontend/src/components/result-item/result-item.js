import React from 'react';
import './result-item.scss';

import { ItemDetails } from '../item-details/item-details';
import classnames from 'classnames';

export const ResultItem = ({ data, type, title, icon }) => (
  <div className="result-item">
    <div className="result-item__header">
      <p className={classnames(`result-item__icon result-item__${type}`)}>
        <i className={classnames("fi", icon)}></i>
      </p>
      <p className="result-item__title">{title}</p>
    </div>
    <div className="result-item__group">
      {data.map((item, index) => <ItemDetails key={index} data={item}/>)}
    </div>
  </div> 
)