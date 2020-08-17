import React from 'react';
import './result-block.scss';

import { ResultItem } from '../result-item/result-item';

export const ResultBlock = ({ result }) => (
  <div className="result-block">
    <p className="result-block__price">{result.totalPrice} ГРН</p>
    {result.groups.length ? <ResultItem data={result.groups} title="Групи" type="groups" icon="flaticon-sugar-cubes" /> : null}
    {result.tests.length ? <ResultItem data={result.tests} title="Тести" type="tests" icon="flaticon-block"/> : null}
    {result.bonus.length ? <ResultItem data={result.bonus} title="Бонуси" type="bonus" icon="flaticon-gift"/> : null}
  </div>
)