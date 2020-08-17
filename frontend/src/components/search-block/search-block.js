import React from 'react';
import './search-block.scss';

import { SearchInput } from 'components/search-input/search-input';
import { SearchItem } from 'components/search-item/search-item';
import InfiniteScroll from 'react-infinite-scroll-component';
import closeIcon from 'assets/icons/x.svg'

export const SearchBlock = ({
  title,
  data,
  selectedItems,
  searchChanged,
  toggleTest,
  loadMore,
  id,
  hasMore,
  clear,
  searchValue,
  deleteElement
}) => 
  <div className="search-wrapper">
    <div className="search-wrapper__header">
      <p className="search-wrapper__header-title">{title}</p>
      <button className="btn btn-red" onClick={clear}>Очистити</button>
    </div>
    <div className="search-block">
      <SearchInput valueChanged={searchChanged} value={searchValue}/>
      <div className="search-block__tags">
        {selectedItems.map((item, index) => (
          <div key={`${index} ${item.title}`} className="search-block__tags-item">
            <img alt="close" src={closeIcon} onClick={() => deleteElement(item)}/>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <div id={id} className="search-block__items">
        {data.length ? <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={hasMore}
          scrollableTarget={id}
          loader={<h4>Загрузка...</h4>}
        >
          {data.map((test, index) => 
            <SearchItem
              data={test}
              key={`${index} ${test.title}`}
              change={toggleTest}
              isChecked={selectedItems.some(({ id }) => id === test.id)}
            />
          )}
        </InfiniteScroll> : <p>Не знайдено</p>}
      </div>
    </div>
  </div>