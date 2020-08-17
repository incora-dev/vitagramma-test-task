import React from 'react';
import './item-details.scss'

export const ItemDetails = ({ data }) => (
  <div className="test-item">
    <span className="test-item__text">
      <p>{data.title}</p>
      {data.tests && <div className="test-item__list">
        {data.tests.map((item, index) => (
          <p key={`${index} ${item.title}`}>
            <span>{item.title}</span>
            {index < data.tests.length - 1 && <span>, &nbsp;</span>}
          </p>
        ))}
      </div>}
    </span>
  </div>
)