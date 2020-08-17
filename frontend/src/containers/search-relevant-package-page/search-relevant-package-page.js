import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './search-relevant-package-page.scss';

import Header from 'components/header/header';
import { SearchBlock } from 'components/search-block/search-block';
import { ResultBlock } from 'components/result-block/result-block';
import { Footer } from 'components/footer/footer';

import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'constants/common.constants';
import * as ActionTypes from 'services/index.actions';

const LIMIT = DEFAULT_LIMIT;

function SearchRelevantPackagePage() {
  const dispatch = useDispatch();
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [offsetTests, setOffsetTests] = useState(0);
  const [offsetGroups, setOffsetGroups] = useState(0);
  const [groupsSearch, setGroupsSearch] = useState('');
  const [testsSearch, setTestsSearch] = useState('');

  const groups = useSelector(({ groups }) => groups.groups);
  const tests = useSelector(({ tests }) => tests.tests);
  const hasMoreTests = useSelector(({ tests }) => tests.hasMoreTests)
  const hasMoreGroups = useSelector(({ groups }) => groups.hasMoreGroups)
  const results = useSelector(({ groups }) => groups.results);
  const isSearching = useSelector(({ groups }) => groups.isSearching);

  const searchTests = (value) => {
    setTestsSearch(value);
    dispatch(ActionTypes.getTests.request(LIMIT, DEFAULT_OFFSET, value))
  }

  const searchGroups = (value) => {
    setGroupsSearch(value);
    dispatch(ActionTypes.getGroups.request(LIMIT, DEFAULT_OFFSET, value))
  }

  const toggleTest = (item) => {
    if (!selectedTests.some(({ id }) => id === item.id)) {
      setSelectedTests([...selectedTests, item]);
    } else {
      deleteTest(item)
    }
  }

  const toggleGroup = (item) => {
    if (!selectedGroups.some(({ id }) => id === item.id)) {
      setSelectedGroups([...selectedGroups, item]);
    } else {
      deleteGroup(item)
    }
  }

  const search = () => {
    const groupsIds = selectedGroups.reduce((ids, group) => [
      ...ids,
      ...group.tests.map(({ id }) => id),
    ], []);
    const ids = Array.from(new Set([...selectedTests.map(({ id }) => id), ...groupsIds]));
    dispatch(ActionTypes.search.request(ids))
  }

  const loadMoreTests = () => {
    setOffsetTests(offsetTests + DEFAULT_LIMIT)
    dispatch(ActionTypes.loadMoreTests.request(LIMIT, offsetTests + DEFAULT_LIMIT, testsSearch))
  }

  const loadMoreGroups = () => {
    setOffsetGroups(offsetGroups + DEFAULT_LIMIT)
    dispatch(ActionTypes.loadMoreGroups.request(LIMIT, offsetGroups + DEFAULT_LIMIT, groupsSearch))
  }

  const clearSelectedTests = () => {
    dispatch(ActionTypes.getTests.request(LIMIT, DEFAULT_OFFSET))
    setTestsSearch('');
    setSelectedTests([]);
  }

  const clearSelectedGroups = () => {
    dispatch(ActionTypes.getGroups.request(LIMIT, DEFAULT_OFFSET))
    setGroupsSearch('');
    setSelectedGroups([])
  }

  const deleteTest = (test) => {
    setSelectedTests(selectedTests.filter(({ id }) => id !== test.id));
  }

  const deleteGroup = (group) => {
    setSelectedGroups(selectedGroups.filter(({ id }) => id !== group.id))
  }

  useEffect(() => {
    dispatch(ActionTypes.getGroups.request(LIMIT, DEFAULT_OFFSET))
    dispatch(ActionTypes.getTests.request(LIMIT, DEFAULT_OFFSET))
  }, [dispatch])

  return (
    <div className="page">
      <Header />
      <div className="page__content">
        <div className="page__content-search">
          <SearchBlock
            toggleTest={toggleTest}
            searchChanged={searchTests}
            data={tests}
            loadMore={loadMoreTests}
            id="scrollable-tests"
            hasMore={hasMoreTests}
            selectedItems={selectedTests}
            title="Тести"
            clear={clearSelectedTests}
            searchValue={testsSearch}
            deleteElement={deleteTest}
          />
          <SearchBlock
            toggleTest={toggleGroup}
            searchChanged={searchGroups}
            data={groups}
            loadMore={loadMoreGroups}
            id="scrollable-groups"
            hasMore={hasMoreGroups}
            selectedItems={selectedGroups}
            title="Групи"
            clear={clearSelectedGroups}
            searchValue={groupsSearch}
            deleteElement={deleteGroup}
          />
        </div>
        <div className="page__button">
          <button
            disabled={(!selectedTests.length && !selectedGroups.length) || isSearching}
            className="btn btn-green"
            onClick={search}
          >{isSearching ? '...' : 'Пошук'}</button>
        </div>
        {results.length ? <div className="page__results">
          {results.map((result, index) => <ResultBlock key={index} result={result} />)}
        </div> : null}
      </div>
      <Footer />
    </div>
  );
}

export default SearchRelevantPackagePage;
